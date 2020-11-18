let express = require('express');
const app = express();
const port = 3000;
let mongoose = require('./configs/mongoose');
let commonServices = require('./configs/CommonServices');

mongoose();
require('./app/Products/Routes')(app, express);


app.get('/', (req, res) => {
    res.send('Hello World - Shopping Cart');
})

app.listen(port, (req, res) => {
    console.log(`Server running at `, port);
})

commonServices.addDataIntoDB()
