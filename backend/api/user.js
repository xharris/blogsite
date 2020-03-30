import build_ctrl, { status } from "../controller";
import { model, verify_password } from "./models/user";
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

router.post("/user/add", controller.add);
router.post("/user/login", login);
router.post("/user/:id", controller.get_by_id);
router.put("/user/:id/update", controller.update);
router.post("/user/:id/delete", controller.update);

module.exports = { model, controller, router };
