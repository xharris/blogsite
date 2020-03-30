const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const securePassword = require("secure-password");
const pwd = securePassword();

export const verify_password = async (password, hash) => {
  const result = await pwd.verify(Buffer.from(password), Buffer.from(hash));
  return (
    result === securePassword.VALID ||
    result === securePassword.VALID_NEEDS_REHASH
  );
};

const schema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  deleted: { type: Boolean, default: false },

  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true }
});

export const model = mongoose.model("user", schema);
