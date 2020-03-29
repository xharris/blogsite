export const status = (code, res, props) => res.status(code).json({ ...props });

export const controllers = {
  add: (name, model, opt) => (req, res) => {
    const body = req.body;
    if (!body) return status(400, res, { message: `Provide a ${name}` });

    const instance = new model(body);
    if (!instance) {
      return status(400, res, { message: err });
    }

    instance.date_created = Date.now();
    instance.date_modified = Date.now();

    if (opt.modify) {
      var ret = opt.modify(instance, req, res);
      if (ret) return ret;
    }

    instance
      .save()
      .then(() => {
        if (opt.after) return opt.after(instance);
        return status(201, res, {
          id: instance._id,
          message: `${name} created!`
        });
      })
      .then(() => {})
      .catch(async err => {
        if (err.code === 11000) {
          const find_existing = async () =>
            await model.findOne(err.keyValue, (err, inst2) => inst2.data);

          return status(200, res, {
            data: await find_existing(),
            message: `${name} already exists!`
          });
        } else {
          return status(400, res, { err, message: `${name} not created!` });
        }
      });
  },

  update: (name, model, opt) => async (req, res) => {
    const body = req.body || {};
    if (!body) return status(400, res, { error: "Provide a body to update" });

    model.findOne({ _id: req.params.id }, (err, instance) => {
      if (err) return status(404, res, { err, message: `${name} not found!` });
      if (!instance) return status(400, res, { message: err });

      for (var key in body) {
        instance[key] = opt.body_mod
          ? opt.body_mod(key, instance[key], body[key], req) || body[key]
          : body[key];
      }
      instance.date_modified = Date.now();
      instance
        .save()
        .then(() => {
          return status(200, res, {
            id: instance._id,
            message: `${name} updated!`
          });
        })
        .catch(err => {
          if (err.code === 11000) {
            return status(201, res, {
              id: instance._id,
              message: `${name} already exists!`
            });
          } else {
            return status(400, res, { err, message: `${name} not updated!` });
          }
        });
    });
  },

  delete: (name, model) => async (req, res) => {
    await model
      .findOneAndDelete({ _id: req.params.id }, (err, instance) => {
        return err || !instance
          ? status(400, res, { error: err || `${name} not found` })
          : status(200, res, { data: instance });
      })
      .catch(err => console.error(err));
  },

  get_by_id: (name, model, opt) => async (req, res) => {
    await model
      .findOne({ _id: req.params.id }, (err, instance) => {
        // if (opt.after_find && !err) {
        //   var ret = opt.after_find(instance);
        //   if (ret) return ret;
        // }
        return err || !instance
          ? status(400, res, { error: err || `${name} not found` })
          : status(200, res, { data: instance });
      })
      .populate(opt.populate)
      .catch(err => console.error(err));
  },

  get_all: (name, model, opt) => async (req, res) => {
    const q = await model
      .find(opt.params ? opt.params(req) : {}, (err, instances) => {
        if (!err && instances.length) {
          if (opt.modify) {
            return new Promise(async () => {
              return await opt.modify(instances);
            }).then(() => {
              return status(200, res, { data: instances });
            });
          } else {
            return status(200, res, { data: instances });
          }
        }
        return status(404, res, { error: err || `${name} not found` });
      })
      .populate(opt.populate)
      .catch(err => console.error(err));
  }
};

export const use_ctrl = (key, name, model, ctrl_opt) =>
  controllers[key](name, model, ctrl_opt);

const build_ctrl = opt => {
  if (!opt.name) console.error("controller needs name");
  if (!opt.model) console.error("controller needs model");
  if (!opt.ctrls) console.error("controller has no controllers!");

  var ret_obj = {};

  for (var key of opt.ctrls) {
    const ctrl_opt = opt.ctrl_opt && opt.ctrl_opt[key] ? opt.ctrl_opt[key] : {};
    if (controllers[key])
      ret_obj[key] = use_ctrl(key, opt.name, opt.model, ctrl_opt);
  }

  return ret_obj;
};

export default build_ctrl;
