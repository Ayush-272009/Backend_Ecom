require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
const connectDB = require("./config/mongodb");
const indexRoutes = require("./routes/index.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/products.routes");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
