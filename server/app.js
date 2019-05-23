import cors from 'cors';
import ytdl from 'ytdl-core';

const express = require('express');

const app = express();

app.use(cors('*'));

app.get('/download', (req, res) => {
  const { URL } = req.query;
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(URL, {
    format: 'mp4',
  }).pipe(res);
});

// eslint-disable-next-line no-console
app.listen({ port: 8000 }, () => console.log('🚀 Server ready at http://localhost:8000'));
