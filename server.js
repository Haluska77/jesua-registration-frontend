var path = require('path');
const express = require('express');
const app = express();
app.use(express.static('./dist/frontend-ui'));
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: "./dist/frontend-ui"});
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);