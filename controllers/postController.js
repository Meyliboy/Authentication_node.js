const User = require("../models/User");
const { validate } = require("../models/joiValidate");

class PostContoller {
  async create(req, res) {
    const { name, email, password } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).json({
        message: "This email is available in the database",
      });
    try {
      const new_user = await User.create({
        name,
        email,
        password,
      });

      await new_user.save();
      res.status(201).json({
        message: "You have successfully registered 😶‍🌫️",
        data: new_user,
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
}

module.exports = new PostContoller();
