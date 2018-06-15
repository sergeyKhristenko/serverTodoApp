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
const user = require('./routes/userRoutes');
const cards = require('./routes/cardsRoutes');
const boards = require('./routes/boardsRoutes');
const columns = require('./routes/columnsRoutes');

app.use('/', user);
app.use('/cards', cards);
app.use('/boards', boards);
app.use('/columns', columns);

const servre = app.listen(serverPort, () => {
  console.log(`Server is up on ${serverPort}`);
});
