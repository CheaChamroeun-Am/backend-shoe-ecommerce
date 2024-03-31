import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const BlogSchema = mongoose.Schema(
    {
      title: {
        type: String,
      },
      article: {
        type: String,
      },
      image: {
        type: String,
      },
      author: {
        type: String,
      },
      view : {
        type : Number,
      }
    },
    {
      timestamps: true,
    }
  );
  const Blog = mongoose.model("Blog", BlogSchema);

  export default Blog;
