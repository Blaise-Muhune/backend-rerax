const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
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
  size: [[String, Number, Boolean]],
  currentIndex: [Number],
  xs: Boolean,
  s: Boolean,
  m: Boolean,
  l: Boolean,
  xl: Boolean,
  xxl: Boolean,
});

const Item = mongoose.model("items", itemSchema);

module.exports = Item;
