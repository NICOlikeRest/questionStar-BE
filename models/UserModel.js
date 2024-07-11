const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  nickname: {
    type: String,
    require: true,
  },
});

//创建模型对象  对文档操作的封装对象
let UserModel = mongoose.model("users", UserSchema);

//暴露模型对象
module.exports = UserModel;
