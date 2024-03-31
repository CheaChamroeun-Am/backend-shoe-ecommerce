import express from "express";
import asyncHandler from "express-async-handler";
import protect from "../Middleware/AuthMiddleware.js";
import generateToken from "../utils/generateToken.js";
import User from "./../Models/UserModel.js";
import Product from "../Models/ProductModel.js";
const userRouter = express.Router();

// LOGIN
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  })
);

// REGISTER
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  })
);

// PROFILE
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);
userRouter.get('/favorite' , protect , asyncHandler(async(req,res)=> {
  const user = await User.findById(req.user._id) ;
  if(user) {
    res.json(user.favorite) ;
  } else {
    res.status(404) ;
    throw new Error('User not found') ;
  }
}))
userRouter.post('/favorite/:id' , protect , asyncHandler(async(req,res)=> {
  console.log(  req.params.id  )
  const user = await User.findById(req.user._id) ; 
  if(user) {
    // find product by id 
    const product = await Product.findById(req.params.id) ;
    if(product) {
      // check if product is already in favorite list
      const isFavorite = user.favorite.find( (item) => item.product.toString() === product._id.toString() ) ;
      if(isFavorite) {
        // remove from favorite list
        user.favorite = user.favorite.filter( (item) => item.product.toString() !== product._id.toString() ) ;
      } else {
        // add to favorite list
        user.favorite.push({
          product : product._id , 
          name : product.name ,
          image : product.image ,
          price : product.price , 
          countInStock : product.countInStock
        }) ;
      }  
      user.save()
      res.json(user) ;
    }  
  }
}))



export default userRouter;
