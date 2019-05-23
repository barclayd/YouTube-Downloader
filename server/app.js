import cors from 'cors';

const express = require('express');

const app = express();

app.use(cors('*'));

// eslint-disable-next-line no-console
app.listen({ port: 8000 }, () => console.log(
  '🚀 Server ready at http://localhost:8000',
));
