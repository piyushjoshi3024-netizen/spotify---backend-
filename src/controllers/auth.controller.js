const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret"
    );

    res.cookie("token", token, { httpOnly: true });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:");
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(404).json({
      message: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(404).json({
      message: "Invalid credentials",
    });
  }

  console.log("JWT_SECRET inside login:", process.env.JWT_SECRET);

const token = jwt.sign(
  {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET || "secret"
);

console.log("Token created");
;
  console.log("After jwt.sign");

  res.cookie("token", token, {
    httpOnly: true,
  });

  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

async function logoutUser(req , res) {

 res.clearCookie("token")
 res.status(200).json({ message :"User logged out successfully"})

}
module.exports = { registerUser, loginUser, logoutUser };
