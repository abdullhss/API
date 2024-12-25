import connect from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import branRouter from "./modules/brand/brand.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import categoryRouter from "./modules/category/category.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import notificationRouter from "./modules/notification/notification.controller.js";
import orderRouter from "./modules/order/order.router.js";
import productRouter from "./modules/product/product.router.js";
import reviewsRouter from "./modules/reviews/reviews.router.js";
import subcategoryRouter from "./modules/subcategory/subcategory.router.js";
import userRouter from "./modules/user/user.router.js";
import wishlistRouter from "./modules/wishlist/wishlist.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const initApp = (app, express) => {
  //convert Buffer Data
  app.use((req, res, next) => {
    if (req.originalUrl == "/order/webhook") {
      express.raw({ type: "application/json" })(req, res, next);
    } else {
      express.json()(req, res, next);
    }
  });

  // home page
  app.get("/", (req, res, next) => res.send("home page"));

  //Setup API Routing
  app.use(`/auth`, authRouter);
  app.use(`/user`, userRouter);
  app.use(`/products`, productRouter);
  app.use(`/categories`, categoryRouter);
  app.use(`/subcategory`, subcategoryRouter);
  app.use(`/review`, reviewsRouter);
  app.use(`/coupon`, couponRouter);
  app.use(`/cart`, cartRouter);
  app.use(`/orders`, orderRouter);
  app.use(`/brand`, branRouter);
  app.use(`/wishlist`, wishlistRouter);
  app.use(`/notification`, notificationRouter);

  app.all("*", (req, res, next) =>
    res.send("In-valid Routing Plz check url  or  method")
  );
  app.use(globalErrorHandling);
  connect;
};

export default initApp;
