import express from "express";
import connectDB from "./connectDB.js";
import { userController } from "./user/user.controller.js";
import { productController } from "./product/product.controller.js";
import { cartController } from "./cart/cart.controller.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

const app = express();
const PORT = 8000;

app.use(limiter);
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.9:3000/"],
  })
);
await connectDB();
app.use(express.json());
app.use(userController);
app.use(productController);
app.use(cartController);

app.listen(PORT, () => {
  console.log("App is listening at port 8000");
});
