const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const blackListmodel = require("../models/blacklist.model");
const productModel = require("../models/payment.model");
const Razorpay = require("razorpay");
const paymentModel = require("../models/payment.model");
const orderModel = require("../models/order.model");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.signup = async (req, res, next) => {
  try {
    const { email, password, username, role } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email,
      password: hashedpassword,
      username,
      role,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "user created successfully",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All the fields are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid User or Password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "User signed in successfully",
      user,
      token,
    });
  } catch (error) {
    next(err);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const { token } = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    const isTokenblacklisted = await blackListmodel.findOne({ token });

    if (isTokenblacklisted) {
      return res.status(400).json({
        message: "Token is already blacklisted",
      });
    }

    await blackListmodel.create({ token });
  } catch (error) {
    next(error);
  }
};

//This code helps handle the logout functionality in a Node.js app
//where JWT tokens are used for authentication.
// When a user logs out, their token is added to the blacklist
//to ensure it can't be used again, even if it's still valid.
//This approach prevents unauthorized access after logging out.

module.exports.getProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    res.status(200).json({
      message: "User successfully fetched",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getProducts = async (req, res, next) => {
  try {
    const products = await productModel.find({});

    res.status(200).json({
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getProductById = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);

    res.status(200).json({
      product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.createOrder = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);

    const option = {
      amount: product.amount * 100,
      currency: "INR",
      receipt: product._id,
    };

    const order = await instance.orders.create(option);
    //yha orders razorpay se aara hai

    res.status(200).json({
      order,
    });

    const payment = await paymentModel.create({
      order_id: order.id,
      amount: product.amount,
      currency: "INR",
      status: "pending",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const {
      validatePaymentVerification,
    } = require("../node_modules/razorpay/dist/utils/razorpay-utils.js");

    const isValid = validatePaymentVerification(
      {
        order_id: orderId,
        payment_id: paymentId,
      },
      signature,
      secret
    );

    if (isValid) {
      const payment = await paymentModel.findOne({
        orderId: orderId,
      });

      payment.paymentId = paymentId;
      payment.signature = signature;
      paayment.status = "success";

      await payment.save();

      res.status(200).json({
        message: "Payment verified successfully",
      });
    } else {
      const payment = await paymentModel.findOne({ orderId: orderId });
      payment.status = "failed";

      res.status(400).json({
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    next(error);
  }
};
