const express = require("express");
const router = express.Router();
const Random = require("mockjs").Random;
const statModel = require("../../models/StatModel");
const questionModel = require("../../models/QuestionModel");

// 获取某个答卷列表
router.get("/:id", async (req, res) => {
  // console.log(req.params);
  const { id } = req.params;

  let componentList = [];

  const data = await questionModel.findOne({ _id: id });

  componentList = data.componentList;

  const statList = [];

  for (let i = 0; i < 10; i++) {
    const stat = {
      _id: Random.id(),
    };
    componentList.forEach((c) => {
      const { fe_id, type, props } = c;
      console.log(fe_id, type, props);
      switch (type) {
        case "questionInput":
          stat[fe_id] = Random.ctitle();
          break;
        case "questionTextarea":
          stat[fe_id] = Random.ctitle();
          break;
        case "questionRadio":
          stat[fe_id] = props.options[0].text;
          break;
        case "questionCheckbox":
          stat[fe_id] = `${props.list[0].text}, ${props.list[1].text}`;
          break;
      }
    });

    statList.push(stat);
  }
  console.log("statList", statList);

  res.status(200).send({
    errno: 0,
    data: {
      total: 100,
      list: statList,
    },
  });
});

router.get("/:questionId/:componentId", (req, res) => {
  const { questionId, componentId } = req.params;
  res.status(200).send({
    errno: 0,
    data: {
      stat: [
        { name: "选项1", count: 20 },
        { name: "选项2", count: 30 },
        { name: "选项3", count: 10 },
      ],
    },
  });
});

module.exports = router;
