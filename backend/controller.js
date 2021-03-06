import { model as UserModel, verify_password } from "./api/models/user";
const jwt = require("jsonwebtoken");

export const status = (code, res, props) =>
  res ? res.status(code).json({ ...props }) : { code: code, ...props };
export const prep_new_instance = inst => {
  inst.date_created = Date.now();
  inst.date_modified = Date.now();
  return inst;
};
export const instance_modified = inst => {
  inst.date_modified = Date.now();
  return inst;
};

export const controllers = {
  add: (name, model, opt) => async (req, res) => {
    const body = req.body;
    if (!body) return status(400, res, { message: `Provide a ${name}` });

    if (opt.body_mod) {
      await opt.body_mod(body, req);
    }

    const instance = new model(body);
    if (!instance) {
      return status(400, res, { message: err });
    }
    prep_new_instance(instance);

    const save = async () =>
      await instance
        .save()
        .then(async () => {
          if (opt.after) {
            return await opt.after(instance);
          } else {
            return status(201, res, {
              id: instance._id,
              message: `${name} created!`,
            });
          }
        })
        .catch(async err => {
          if (err.code === 11000) {
            const existing_inst = await model.findOne(
              err.keyValue,
              (err, inst2) => inst2.data
            );

            if (opt.after) {
              return await opt.after(existing_inst, req, res);
            } else {
              return status(200, res, {
                data: existing_inst,
                message: `${name} already exists!`,
              });
            }
          } else {
            return status(400, res, { err, message: `${name} not created!` });
          }
        });

    if (opt.modify) {
      var ret = opt.modify(instance, req, res);
      if (ret) return ret;
      return await save();
    } else if (opt.modify_async) {
      var ret = await opt.modify_async(instance, req, res);
      if (ret) return ret;
      return await save();
    } else {
      return await save();
    }
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
      instance_modified(instance);
      instance
        .save()
        .then(() => {
          return status(200, res, {
            id: instance._id,
            message: `${name} updated!`,
          });
        })
        .catch(err => {
          if (err.code === 11000) {
            return status(201, res, {
              id: instance._id,
              message: `${name} already exists!`,
            });
          } else {
            return status(400, res, { err, message: `${name} not updated!` });
          }
        });
    });
  },

  delete: (name, model, opt) => async (req, res) => {
    var body = req.body || { _id: req.params.id };
    if (opt.body_mod) {
      await opt.body_mod(body, req);
    }
    await model
      .findOneAndDelete(body, (err, instance) => {
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
  },
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

  if (opt.requires_auth)
    Object.keys(opt.requires_auth).forEach(key => {
      if (ret_obj[key]) {
        const ctrl_opt =
          opt.ctrl_opt && opt.ctrl_opt[key] ? opt.ctrl_opt[key] : {};
        ret_obj[key] = async (req, res) => {
          try {
            const user_info = await jwt.verify(
              req.body.token || "",
              process.env.JWT_KEY
            );
            return await UserModel.findOne(
              { username: user_info.data.user },
              async (err, instance) => {
                const valid = await verify_password(
                  user_info.data.password,
                  instance.password
                );
                return valid === true
                  ? await use_ctrl(key, opt.name, opt.model, ctrl_opt)(req, res)
                  : status(401, res, { error: `You must be logged in` });
              }
            ).catch(err =>
              status(401, res, { error: `You must be logged in` })
            );
          } catch (err) {
            return status(401, res, { error: `You must be logged in` });
          }
        };
      }
    });

  return ret_obj;
};

export default build_ctrl;
