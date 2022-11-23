const express = require("express");
const { getUserGameHistory } = require("../controllers/game");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  searchUsers,
  getCountUsersChart,
} = require("../controllers/user");

router
.route('/get-chart-dashboard')
.get(getCountUsersChart);

router
  .route("/")
  .get(getUsers)
  .post(createUser);

router
  .route("/get-user/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

router
.route("/changePassWord/:id")
.post(changePassword);

router
.route('/search')
.post(searchUsers)

router
.route('/get-user-history/:userId')
.get(getUserGameHistory)

module.exports = router;
