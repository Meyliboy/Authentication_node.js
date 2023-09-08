const User = require("../models/User");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { validate, validateLogin } = require("../models/joiValidate");

class PostContoller {
  async create(req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).json({
        message: "This email is available in the database",
      });
    try {
      const new_user = await User.create(
        _.pick(req.body, ["name", "email", "password"])
      );
      const salt = await bcrypt.genSalt();
      new_user.password = await bcrypt.hash(new_user.password, salt);
      await new_user.save();

      res.status(201).json({
        message: "You have successfully registered🕺",
        data: _.pick(new_user, ["_id", "name", "email"]),
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }

  async loginUser(req, res) {
    try {
      const { error } = validateLogin(req.body);
      if (error) return res.status(400).json(error.details[0].message);

      let user = await User.findOne({ email: req.body.email });
      if (!user)
        return res.status(400).json({
          message: "Email or password is incorrect...",
        });

      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isValidPassword)
        return res.status(400).json({
          message: "Email or password is incorrect...",
        });

      res.json(true);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}

module.exports = new PostContoller();
