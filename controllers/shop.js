const Product = require('../models/product');
const Order= require('../models/order');

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/' });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products' });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-details', {
        pageTitle: product.title,
        path: '/products',
        product: product
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: user.cart.items
      })
    })
    .catch();
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .then(result => console.log(result));
};

exports.postDeleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => ({ quantity: item.quantity, product: {...item.productId._doc} }));

      const order = new Order({
        products: products,
        user: {
          name: req.user.name,
          userId: req.user
        }
      });

      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() =>  res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order
    .find({'user.userId': req.user._id})
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders: orders,
      })
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  })
};
