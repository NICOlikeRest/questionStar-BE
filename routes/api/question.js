const express = require("express");
const router = express.Router();

const questionModel = require("../../models/questionModel");

// 新建问卷
router.post("/", (req, res) => {
  questionModel
    .create({ ...req.body })
    .then((data) => {
      console.log(data._id.toString());
      res.status(200).send({
        errno: 0,
        data: {
          id: data._id.toString(),
        },
      });
    })
    .catch((error) => {
      console.error("Error creating the question:", error);
      res.status(500).send({
        errno: 1,
        message: "Error creating question",
      });
    });
});

// 查询某个问卷列表
router.get("/:id", (req, res) => {
  const { id } = req.params;
  questionModel
    .find({ _id: id })
    .then((questions) => {
      res.status(200).send({
        errno: 0,
        data: questions[0],
      });
    })
    .catch((error) => {
      console.error("Error retrieving questions:", error);
      res.status(500).send({
        errno: 1,
        message: "Error retrieving data",
      });
    });
});

// 发布问卷
router.patch("/:id", async (req, res) => {
  const id = req.params.id; // 从URL中获取问卷ID
  const {
    title,
    desc,
    css,
    js,
    isPublished,
    componentList,
    isDeleted,
    isStar,
  } = req.body; // 从请求体中获取要更新的数据

  try {
    await questionModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true } // 返回更新后的文档
    );

    res.status(200).send({
      errno: 0,
    });
  } catch (error) {
    console.error("Error updating the question or creating components:", error);
    res.status(500).send({
      errno: 1,
      message: "Error updating question or creating components",
    });
  }
});

// 查询问卷列表
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  questionModel
    .find({})
    .skip(skip)
    .limit(limit)
    .then(async (questions) => {
      const total = await questionModel.countDocuments({});
      if (!questions.length) {
        return res.status(404).send({
          errno: 1,
          message: "No questions found",
        });
      }
      res.status(200).send({
        errno: 0,
        data: {
          list: questions,
          total: total,
        },
      });
    })
    .catch((error) => {
      console.error("Error retrieving questions:", error);
      res.status(500).send({
        errno: 1,
        message: "Error retrieving data",
      });
    });
});

// 复制问卷
router.post("/depulicate/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const originalQestion = await questionModel.findOne({ _id: id });
    if (!originalQestion) {
      return res.status(404).send({
        errno: 1,
        essage: "Question not found",
      });
    }

    // 创建新问卷数据，去掉 _id 并修改必要字段
    const { componentList, css, desc, js, title, isPublished, isStar } =
      originalQestion;

    const newQuestionData = {
      componentList,
      css,
      desc,
      js,
      title,
      isPublished,
      isStar,
    };

    // 创建新问卷文档
    const newQuestion = new questionModel(newQuestionData);
    await newQuestion.save();

    // 返回新问卷数据
    res.status(200).send({
      errno: 0,
    });
  } catch (error) {
    res.status(500).send({
      errno: 1,
      message: "Error duplicating question",
    });
  }
});

// 批量删除
router.delete("/", async (req, res) => {
  const ids = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send({
      errno: 1,
      message: "Invalid input: IDs should be a non-empty array",
    });
  }

  try {
    await questionModel.deleteMany({
      _id: { $in: ids },
    });
    res.status(200).send({
      errno: 0,
    });
  } catch (error) {
    console.error("Error deleting questions:", error);
    res.status(500).send({
      errno: 1,
      message: "Error deleting questions",
    });
  }
});

module.exports = router;
