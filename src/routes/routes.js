// routes.js
const express = require("express");
const router = express.Router();
const {
  startStreaming,
  stopStreaming,
} = require("../controllers/streamController");

router.post("/start-stream", async (req, res) => {
  const { rtspUrl, observatoryCode } = req.body;
  if (!rtspUrl || !observatoryCode) {
    return res.status(400).send("RTSP URL 또는 Observatory Code 문제");
  }

  const streamKey = observatoryCode;

  try {
    const streamUrl = await startStreaming(rtspUrl, streamKey);
    return res.json({ streamUrl });
  } catch (error) {
    return res.status(500).send("스트리밍 시작 중 오류 발생");
  }
});

router.post("/stop-stream", (req, res) => {
  const { observatoryCode } = req.body;
  if (!observatoryCode) {
    return res.status(400).send("Observatory Code 입력 필수");
  }

  const streamKey = observatoryCode;
  stopStreaming(streamKey);

  res.send(`스트리밍 중지 : 관측소번호 - ${streamKey}`);
});

module.exports = router;
