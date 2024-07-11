const express = require("express");
const router = express.Router();

const UserModel = require("../../models/UserModel");

//注册用户  注意：要先设置Header，然后再请求
router.post("/register", (req, res) => {
  UserModel.create({ ...req.body })
    .then((data) => {
      res.status(200).send({
        errno: 0,
      });
    })
    .catch((error) => {
      console.error("创建用户失败:", error);
      res.status(400).send({
        errno: 1,
        message: "添加失败：" + error.message,
      });
    });
});

// 登录
router.post("/login", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  console.log(username, password);
  UserModel.findOne({ username: username })
    .then((data) => {
      if (data && data.password == password) {
        res.status(200).send({
          errno: 0,
        });
      } else {
        res.status(400).send({
          errno: 1,
          message: "用户名或密码错误",
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        errno: 1,
        message: "并没有该用户！请注册！",
      });
    });
});

// 获取用户信息 TODO
router.get("/info", (req, res) => {
  res.status(200).send({
    errno: 0,
    data: {
      username: "nico",
      nickname: "yty",
    },
  });
});

module.exports = router;
