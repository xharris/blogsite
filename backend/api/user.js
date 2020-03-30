import build_ctrl, { status, prep_new_instance } from "../controller";
import { model, verify_password } from "./models/user";
const { model: user_info_model } = require("./user_info");
const express = require("express");
const router = express.Router();
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require("jsonwebtoken");

const controller = build_ctrl({
  name: "User",
  model: model,
  ctrls: ["add", "update", "get_by_id"],
  requires_auth: ["update"],
  ctrl_opt: {
    add: {
      modify_async: async instance => {
        instance.password = await pwd.hash(Buffer.from(instance.password));
      },
      after: async (instance, req, res) => {
        var info_inst = new user_info_model(
          prep_new_instance({ user_id: instance._id })
        );
        return await info_inst
          .save()
          .then(e => {
            return status(200, res, {
              id: e._id,
              data: e,
              message: `User info created`
            });
          })
          .catch(e => {
            return status(200, res, {
              id: e._id,
              data: e,
              message: `User info already exists!`
            });
          });
      }
    }
  }
});

const login = async (req, res) => {
  return await model.findOne(
    { username: req.body.username },
    async (err, instance) => {
      if (err) return status(404, res, { err, message: `${name} not found!` });
      if (!instance) return status(400, res, { message: err });

      const result = await pwd.verify(
        Buffer.from(req.body.password),
        Buffer.from(instance.password)
      );

      const gen_token = () =>
        jwt.sign(
          {
            data: {
              user: req.body.username,
              password: req.body.password
            },
            expiresIn: process.env.JWT_EXPIRES_IN
          },
          process.env.JWT_KEY
        );

      switch (result) {
        case securePassword.INVALID_UNRECOGNIZED_HASH:
          return console.error(
            "This hash was not made with secure-password. Attempt legacy algorithm"
          );
        case securePassword.INVALID:
          return status(400, res, { message: "Invalid password" });
        case securePassword.VALID:
          return status(200, res, {
            _id: instance._id,
            data: instance._doc.info,
            token: gen_token(),
            message: "Authenticated"
          });
        case securePassword.VALID_NEEDS_REHASH:
          try {
            instance.password = await pwd.hash(userPassword);
            return instance.save().then(() => {
              return status(200, res, {
                _id: instance._id,
                data: instance._doc.info,
                token: gen_token(),
                message: "Authenticated"
              });
            });

            // Save improvedHash somewhere
          } catch (err) {
            return status(200, res, {
              _id: instance._id,
              data: instance._doc.info,
              token: gen_token(),
              message: "Authenticated (poorly)"
            });
          }
          break;
      }
    }
  );
};

const checkAuth = async (req, res) => {
  return new Promise(async (_res, _rej) => {
    try {
      _res(jwt.verify(req.body.token || "", process.env.JWT_KEY));
    } catch (e) {
      return status(401, res, {
        message: `Authentication failed: token invalid`
      });
    }
  }).then(async user_info => {
    return await model
      .findOne({ username: user_info.data.user }, async (err, instance) => {
        const valid = await verify_password(
          user_info.data.password,
          instance.password
        );
        return valid === true
          ? status(200, res, { message: "Authentication success" })
          : status(401, res, {
              error: `Authentication failed: bad credentials`
            });
      })
      .catch(err =>
        status(401, res, { error: `Authentication failed: User no found` })
      );
  });
};

router.post("/user/add", controller.add);
router.post("/user/login", login);
router.post("/user/checkAuth", checkAuth);
router.post("/user/:id", controller.get_by_id);
router.put("/user/:id/update", controller.update);
router.post("/user/:id/delete", controller.update);

module.exports = { model, controller, router };
