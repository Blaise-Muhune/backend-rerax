const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  wishlistItems: [
    {
      id: Number,
      name: String,
      imgUrl: String,
      price: Number,
      isWished: Boolean,
    },
  ],
  cart: [
    {
      id: Number,
      name: String,
      imgUrl: String,
      price: Number,
      description: String,
      isWished: Boolean,
      recentlyVisited: Boolean,
      cartInfo: {
        addedToCart: Boolean,
        addedTocartDate: String,
        howMany: Number,
      },
      size: [{ label: String, numberIncart: Number }],
      currentIndex: [Number],
      xs: Boolean,
      s: Boolean,
      m: Boolean,
      l: Boolean,
      xl: Boolean,
      xxl: Boolean,
    },
  ],
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("users", userSchema);

module.exports = User;
