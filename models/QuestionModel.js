const mongoose = require("mongoose");

let QuestionSchema = new mongoose.Schema({
  title: String,
  desc: String,
  css: String,
  js: String,
  isPublished: Boolean,
  isStar: Boolean,
  answerCount: Boolean,
  createdAt: Date,
  isDeleted: Boolean,
  componentList: [Object],
});

//创建模型对象  对文档操作的封装对象
let QuestionModel =
  mongoose.models.question || mongoose.model("question", QuestionSchema);

//暴露模型对象
module.exports = QuestionModel;
