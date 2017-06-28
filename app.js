// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var httpProxy = require('http-proxy');
// var app = express();

// app.use(logger('dev'));
// //PROXY TO API
// const apiProxy =
//   httpProxy.createProxyServer({
//     target: "http://127.0.0.1:3001"
//   });
// app.use('/api/v1', function (req, res) {
//   apiProxy.web(req, res);
// })
// // END PROXY
// module.exports = app;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var apiRoutes = express.Router();
var authentication = require('./server/controllers/authentication');
var product = require('./server/controllers/product');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Create a new users
apiRoutes.post('/register', function (req, res) {
  authentication.register(req.body, res);
});
//Login a new user
apiRoutes.post('/login', function (req, res) {
  authentication.login(req.body, res);
});
//Add a new product
apiRoutes.post('/products', authentication.verifyToken, function (req, res) {
  product.createProducts(req, res);
});

apiRoutes.get('/products', authentication.verifyToken, function (req, res) {
  product.getAllProducts(req, res);
});
apiRoutes.get('/general-products', authentication.verifyToken, function (req, res) {
  product.getAllProductsPublicAcess(req, res);
});

apiRoutes.get('/products/:id', authentication.verifyToken, function (req, res) {
  product.getProduct(req, res);
});
apiRoutes.put('/products/:id', authentication.verifyToken, function (req, res) {
  product.updateProduct(req, res);
});

apiRoutes.delete('/products/:id', authentication.verifyToken, function (req, res) {
  product.deleteProduct(req, res);
});
app.use('/api/v1', apiRoutes);

module.exports = app;