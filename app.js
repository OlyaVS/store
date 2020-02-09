const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res, next) => {
  User.findById('5e3fe82d654d8db4f0ce9e1d')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch( (err) => {
      console.log(err);
    });
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb+srv://olyasavon:Pinksobe11@cluster0-lzcv7.mongodb.net/test?retryWrites=true&w=majority')
  .then(result => {
    User
      .findOne()
      .then(user => {
      if (!user) {
        const user = new User({
          name: 'Olya',
          email: 'olya@mail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });

    app.listen(4700);
  })
  .catch(err => console.log(err));
