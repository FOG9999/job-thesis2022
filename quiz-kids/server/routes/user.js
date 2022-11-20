const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  searchUsers,
} = require("../controllers/user");

router
  .route("/")
  .get(getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

router
.route("/changePassWord/:id")
.post(changePassword);

router
.route('/search')
.post(searchUsers)

module.exports = router;
