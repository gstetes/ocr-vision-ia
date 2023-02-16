const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Routes = require('./routes');

const app = express();

const { PORT } = process.env;
const port = PORT || 4444;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/', Routes);

app.listen(port, () => console.log(`Listening on ${port}`));