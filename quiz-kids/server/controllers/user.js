const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { userType, firstName, lastName, userName, mail, password } = req.body;
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)
  console.log(salt)
  console.log(hashedPassword)
  const user = new User({
    userType,
    firstName,
    lastName,
    userName,
    mail,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCountUsersChart = async (req, res) => {
  try {
    const users = await User.find();
    const numOfTeachers = users.filter(u => u.userType == 'Teacher').length;
    const numOfStudents = users.filter(u => u.userType == 'Student').length;
    res.status(200).send({ numOfStudents, numOfTeachers })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const searchUsers = async (req, res) => {
  try {
    const { filters } = req.body;
    function escapeRegExp(input) {
      if (!input) return '';
      return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }
    // build object query in mongoose
    let buildFilters = (excludeFields = []) => {
      let props = Object.getOwnPropertyNames(filters);
      let searchFilters = {};
      props.forEach(p => {
        if (excludeFields.indexOf(p) >= 0) {
          searchFilters[p] = filters[p].trim()
        }
        else if (filters[p] && excludeFields.indexOf(p) < 0) {
          searchFilters[p] = new RegExp(escapeRegExp(filters[p].trim()), 'i');
        }
      })
      return searchFilters;
    }
    let users = await User.find({ ...buildFilters(['userType']) }).select('-password');
    users = users.filter(x => ['admin', 'administrator'].indexOf(x.userName) < 0);
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No user with id: ${id}`);
  }

  const { userType, firstName, lastName, userName, mail, password } = req.body;
  const user = new User({
    _id: id,
    userType,
    firstName,
    lastName,
    userName,
    mail,
    password,
  });

  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No user with id: ${id}`);
  }

  try {
    await User.findByIdAndRemove(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPass, newPass } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No user with id: ${id}`);
  }
  try {
    let user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    if (await bcrypt.compare(oldPass, user.password)) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPass, salt);
      await User.findByIdAndUpdate(id, { password: hashedPassword });
      return res.json({ success: true });
    }
    else res.json({ message: 'Mật khẩu cũ không đúng' })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser, changePassword, searchUsers, getCountUsersChart };
