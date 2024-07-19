const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const UserModel = require("../../models/UserModel");

// 创建一个生成 JWT 的函数
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, "nico", {
    expiresIn: "24h", // Token 有效期
  });
};

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

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username: username })
    .then((user) => {
      // 使用 user 替代 data 保持一致性
      if (user && user.password === password) {
        const token = generateToken(user); // 确保 user 是已定义的
        res.status(200).send({
          errno: 0,
          data: {
            token
          },
        });
      } else {
        res.status(400).send({
          errno: 1,
          message: "用户名或密码错误",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        errno: 1,
        message: "并没有该用户！请注册！",
      });
    });
});

// 解析 Token 的中间件
const authenticateToken = (req, res, next) => {
  // 从请求头中获取 Token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  if (token == null) return res.sendStatus(401); // 如果没有 Token，则未授权

  jwt.verify(token, "nico", (err, user) => {
    if (err) return res.sendStatus(403); // 如果 Token 无效，则禁止访问
    req.user = user; // 将解析的用户信息添加到请求对象
    next(); // 继续处理请求
  });
};


// 获取用户信息
router.get("/info", authenticateToken, (req, res) => {
  UserModel.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          errno: 1,
          message: "用户不存在",
        });
      }
      res.status(200).send({
        errno: 0,
        data: {
          username: user.username,
          nickname: user.nickname,
        },
      });
    })
    .catch((error) => {
      res.status(500).send({
        errno: 1,
        message: "内部服务器错误",
      });
    });
});

module.exports = router;
