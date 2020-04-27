const app         = require('express')();
const bodyParser  = require('body-parser');
const cors        = require('cors');
const middleware  = require('./utils/middleware');
const mountRoutes = require('./controllers');

app.use(cors());
app.use(bodyParser.json());
app.use(middleware.tokenExtractor);
app.use(middleware.logger());

mountRoutes(app);

app.use(middleware.errorHandler);

module.exports = app;

