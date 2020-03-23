export const controllers = {
  add: (name, model, opt) => (req, res) => {
    const body = req.body;
    if (!body)
      return res.status(400).json({
        success: false,
        error: `Provide a ${name}`
      });

    const instance = new model(body);
    if (!instance)
      return res.status(400).json({
        success: false,
        error: err
      });

    instance.date_created = Date.now();
    instance.date_modified = Date.now();

    if (opt.modify) {
      var ret = opt.modify(instance, req, res);
      if (ret) return ret;
    }

    instance
      .save()
      .then(() => {
        return res.status(201).json({
          success: true,
          id: instance._id,
          message: `${name} created!`
        });
      })
      .catch(err => {
        return res.status(400).json({
          err,
          message: `${name} created!`
        });
      });
  },

  update: (name, model) => async (req, res) => {
    const body = req.body;
    if (!body)
      return res.status(400).json({
        success: false,
        error: "Prove a body to update"
      });

    model.findOne({ _id: req.params.id }, (err, instance) => {
      if (err)
        return res.status(404).json({
          err,
          message: `${name} not found!`
        });
      for (var key in body) {
        instance[key] = body[key];
      }
      instance.date_modified = Date.now();
      instance
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: instance._id,
            message: `${name} updated!`
          });
        })
        .catch(err =>
          res.status(404).json({
            err,
            message: `${name} not updated!`
          })
        );
    });
  },

  delete: (name, model) => async (req, res) => {
    await model
      .findOneAndDelete({ _id: req.params.id }, (err, instance) => {
        return err || !instance
          ? res
              .status(400)
              .json({ success: false, error: err || `${name} not found` })
          : res.status(200).json({ success: true, data: instance });
      })
      .catch(err => console.error(err));
  },

  get_by_id: (name, model) => async (req, res) => {
    await model
      .findOne({ _id: req.params.id }, (err, instance) => {
        return err || !instance
          ? res
              .status(400)
              .json({ success: false, error: err || `${name} not found` })
          : res.status(200).json({ success: true, data: instance });
      })
      .catch(err => console.error(err));
  },

  get_all: (name, model) => async (req, res) => {
    await model
      .find({}, (err, instances) => {
        return err || !instances.length
          ? res
              .status(404)
              .json({ success: false, error: err || `${name} not found` })
          : res.status(200).json({ success: true, data: instances });
      })
      .catch(err => console.error(err));
  }
};

const build_ctrl = opt => {
  if (!opt.name) console.error("controller needs name");
  if (!opt.model) console.error("controller needs model");
  if (!opt.ctrls) console.error("controller has no controllers!");

  var ret_obj = {};

  for (var key of opt.ctrls) {
    const ctrl_opt = opt.ctrl_opt && opt.ctrl_opt[key] ? opt.ctrl_opt[key] : {};
    if (controllers[key])
      ret_obj[key] = controllers[key](opt.name, opt.model, ctrl_opt);
  }

  return ret_obj;
};

export default build_ctrl;
