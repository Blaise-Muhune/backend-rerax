const express = require("express");
const router = express.Router();
const Item = require("../types/itemModel"); // Import your Mongoose Item model or schema

// GET all items
router.get("/all", (req, res) => {
  Item.find()
    .then((items) => {
      res.json(items);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving items" });
    });
  // res.json({
  //   statusCode: 200,
  //   statusMessage: "SUCCESS",
  // });
});

// GET a single Item
router.get("/:id", (req, res) => {
  const itemId = req.params.id;
  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ error: "item not found" });
      }
      res.json(item);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving item" });
    });
});

// POST a new item
router.post("/", (req, res) => {
  const newItem = new Item(req.body);
  newItem
    .save()
    .then((item) => {
      res.status(201).json(item);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error creating item" });
    });
});

// PUT/update a item
router.put("/:id", (req, res) => {
  const itemId = req.params.id;
  Item.findByIdAndUpdate(itemId, req.body, { new: true })
    .then((item) => {
      if (!item) {
        return res.status(404).json({ error: "item not found" });
      }
      res.json(item);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error updating item" });
    });
});

// DELETE a item
router.delete("/:id", (req, res) => {
  const itemId = req.params.id;
  Item.findByIdAndDelete(itemId)
    .then(() => {
      res.json({ message: "item deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error deleting item" });
    });
});

module.exports = router;
