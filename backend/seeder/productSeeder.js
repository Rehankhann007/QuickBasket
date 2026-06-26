require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Product = require("../models/Product");

const products = [
  // Fruits
  {
    name: "Apple",
    description: "Fresh Shimla Apple",
    category: "Fruits",
    price: 180,
    stock: 100,
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
  },
  {
    name: "Banana",
    description: "Fresh Banana",
    category: "Fruits",
    price: 60,
    stock: 100,
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224"
  },
  {
    name: "Orange",
    description: "Juicy Orange",
    category: "Fruits",
    price: 120,
    stock: 100,
    image: "https://images.unsplash.com/photo-1547514701-42782101795e"
  },

  // Vegetables
  {
    name: "Tomato",
    description: "Fresh Tomato",
    category: "Vegetables",
    price: 40,
    stock: 200,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337"
  },
  {
    name: "Potato",
    description: "Fresh Potato",
    category: "Vegetables",
    price: 30,
    stock: 300,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655"
  },
  {
    name: "Onion",
    description: "Fresh Onion",
    category: "Vegetables",
    price: 35,
    stock: 300,
    image: "https://images.unsplash.com/photo-1508747703725-719777637510"
  },

  // Dairy
  {
    name: "Amul Milk",
    description: "500ml Milk",
    category: "Dairy",
    price: 35,
    stock: 100,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150"
  },
  {
    name: "Amul Butter",
    description: "100g Butter",
    category: "Dairy",
    price: 58,
    stock: 100,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d"
  },

  // Bakery
  {
    name: "Brown Bread",
    description: "Healthy Bread",
    category: "Bakery",
    price: 45,
    stock: 100,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff"
  },

  // Drinks
  {
    name: "Coca Cola",
    description: "750ml Bottle",
    category: "Beverages",
    price: 45,
    stock: 150,
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e"
  },
  {
    name: "Sprite",
    description: "750ml Bottle",
    category: "Beverages",
    price: 45,
    stock: 150,
    image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc"
  },

  // Snacks
  {
    name: "Lays Chips",
    description: "Magic Masala",
    category: "Snacks",
    price: 20,
    stock: 300,
    image: "https://images.unsplash.com/photo-1613919113640-25732ec5e61f"
  },
  {
    name: "Kurkure",
    description: "Masala Munch",
    category: "Snacks",
    price: 20,
    stock: 300,
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60"
  },

  // Grocery
  {
    name: "Aashirvaad Atta",
    description: "5kg Pack",
    category: "Grocery",
    price: 290,
    stock: 100,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5"
  },
  {
    name: "Basmati Rice",
    description: "5kg Premium",
    category: "Grocery",
    price: 650,
    stock: 100,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c"
  },
  {
    name: "Toor Dal",
    description: "1kg",
    category: "Grocery",
    price: 180,
    stock: 120,
    image: "https://images.unsplash.com/photo-1603048719539-9ecb1d3aefc5"
  }
];

const seed = async () => {
  try {

    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products Added Successfully");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);

  }
};

seed();