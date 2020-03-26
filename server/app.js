import cors from 'cors';
import ytdl from 'ytdl-core';

const express = require('express');

const app = express();

app.use(cors('*'));

app.get('/check-download', async (req, res, next) => {
  try {
    const { URL } = req.query;
    const {
      player_response: {
        videoDetails: { title, author },
      },
    } = await ytdl.getBasicInfo(URL);
    res.json({
      status: true,
      title,
      author,
    });
    next();
  } catch (e) {
    console.log(e);
  }
});

app.get('/download', async (req, res) => {
  try {
    const {
      URL, downloadFormat, quality, title,
    } = req.query;
    if (downloadFormat === 'audio-only') {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${title.substring(0, 40)}.mp3`,
      );
      ytdl(URL, {
        filter: format => format.container === 'm4a' && !format.encoding,
        quality: quality === 'high' ? 'highest' : 'lowest',
      }).pipe(res);
    } else {
      res.header(
        'Content-Disposition',
        `attachment; filename="${title.substring(0, 25)}.mp4"`,
      );
      ytdl(URL, {
        filter: downloadFormat === 'video-only' ? 'videoonly' : 'audioandvideo',
        quality: quality === 'high' ? 'highestvideo' : 'lowestvideo',
      }).pipe(res);
    }
  } catch (e) {
    console.log(e);
  }
});

// eslint-disable-next-line no-console
app.listen({ port: 8000 }, () => console.log('🚀 Server ready at http://localhost:8000'));
