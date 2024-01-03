// index.js
const express = require("express");
const NodeMediaServer = require("node-media-server");
const routes = require("./routes/routes");
const app = express();
const port = 5000;

app.use(express.json());
app.use("/", routes);

const mediaServerConfig = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: 8000,
    mediaroot: "./media",
    allow_origin: "*",
  },
  trans: {
    ffmpeg: "C:\\Program Files\\FFMPEG\\bin\\ffmpeg.exe",
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
      },
    ],
  },
};

var nms = new NodeMediaServer(mediaServerConfig);
nms.run();

app.listen(port, () => console.log(`Server running on port ${port}`));
