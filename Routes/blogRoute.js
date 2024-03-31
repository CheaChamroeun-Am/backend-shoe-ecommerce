import express from "express";
import asyncHandler from "express-async-handler";
import protect from "../Middleware/AuthMiddleware.js";
import Blog from "../Models/BlogModel.js";

const blogROuter = express.Router()

// Get Blog
blogROuter.get(
    "/",
    asyncHandler(async (req, res) => {
        const blog = await Blog.find({})
        res.json(blog)
    }
    )
)
blogROuter.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const blog = await Blog.findById(req.params.id)
        if (blog) {
            res.json(blog)
        } else {
            res.status(404)
            throw new Error("Blog not found")
        }
    })
)

export default blogROuter;
