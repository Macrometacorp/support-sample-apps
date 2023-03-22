import express from 'express';
import bodyParser from 'body-parser';
import {userRoutes} from "./routes/user.js"
import {productRoutes} from "./routes/product.js"
import {orderRoutres} from "./routes/order.js"
import createSW from './util/createSW.js';
import createViews from './util/createViews.js';
import createQW from './util/createQW.js';

const app = express();
// setting Views, Stream Workers and QueryWorkers
(async function(){
  await createViews()
  await createSW()
  await createQW()
})()

app.use(bodyParser.json());

// User routes
app.use('/user', userRoutes);
// Product routes
app.use('/product', productRoutes);
// Order routes
app.use('/order', orderRoutres);
// 404 not found
app.all('*', function(req, res){
  res.send('Not found!', 404);
});
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});