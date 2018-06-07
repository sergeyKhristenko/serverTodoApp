const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./utils/DataBaseUtils');
const { serverPort } = require('./utils/config.json');

db.setUpConnection();

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// include routes
const routes = require('./routes/router');
app.use('/', routes);

const servre = app.listen(serverPort, () => {
  console.log(`Server is up on ${serverPort}`);
});
