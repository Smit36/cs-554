const express = require('express');
const cors = require('cors');
const { configRoutes } = require('./routes');
const { applyMiddleware } = require('./middleware');
const path = require('path');

const app = express();
app.use(cors());
applyMiddleware(app);
configRoutes(app);
// Step 1:
app.use(express.static(path.resolve(__dirname, './frontend/build')));
// Step 2:
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './frontend/build', 'index.html'));
});

module.exports = app;

/*

return {data:data, length:data.length}

*/
