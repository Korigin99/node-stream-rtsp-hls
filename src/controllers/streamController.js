const { spawn } = require("child_process");
const os = require("os");

function getPrivateIP() {
  const interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    const iface = interfaces[devName].filter((details) => {
      return details.family === "IPv4" && !details.internal;
    });
    if (iface.length > 0) return iface[0].address;
  }
  return "localhost";
}

const ffmpegProcesses = {};

function startStreaming(rtspUrl, streamKey) {
  const ffmpeg = spawn("ffmpeg", [
    "-rtsp_transport",
    "tcp",
    "-i",
    rtspUrl,
    "-c",
    "copy",
    "-f",
    "flv",
    `rtmp://localhost/live/${streamKey}`,
  ]);

  ffmpegProcesses[streamKey] = ffmpeg;

  const streamStopTimer = setTimeout(() => {
    stopStreaming(streamKey);
  }, 5 * 60 * 1000);

  ffmpeg.on("close", () => {
    clearTimeout(streamStopTimer);
    delete ffmpegProcesses[streamKey];
  });

  const privateIP = getPrivateIP();
  const streamUrl = `http://${privateIP}:8000/live/${streamKey}/index.m3u8`;

  // 스트리밍 준비를 위해 3초 대기
  return new Promise((resolve) => {
    setTimeout(() => resolve(streamUrl), 3000);
  });
}

function stopStreaming(streamKey) {
  if (ffmpegProcesses[streamKey]) {
    ffmpegProcesses[streamKey].kill("SIGINT");
    delete ffmpegProcesses[streamKey];
  }
}

module.exports = { startStreaming, stopStreaming };
