import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import dbconnect from "../config/db.config.js";
import productRoutes from "../routes/productRoutes.js";
dotenv.config();

const app = express();

app.use(morgan("combined"));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/api", productRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
