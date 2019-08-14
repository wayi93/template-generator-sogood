const express = require('express');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

const app = express();

/** for load body parameters */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var api_template = require('./webservice/template');
app.use('/api', api_template);

app.listen(port, () => console.log(`Listening on port ${port}`));
