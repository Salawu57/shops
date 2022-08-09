const path = require('path');
const errorController = require('./controller/error')
const express = require('express');

const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const router = require('./routes/admin');

const shopRoutes = require('./routes/shop');



app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', router);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync()
.then(result => {
    console.log(result);
    app.listen(3000);
})
.catch(err => console.log(err));

