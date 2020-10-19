const Blog = require("../models/Blog");
const multer = require("multer");
const fs = require("fs");
const Buffer = require("safe-buffer").Buffer;

// Get Blog By Id
exports.blogById = (req, res, next, id) => {
  Blog.findById(id).exec((err, blog) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    }
    req.blog = blog;
    next();
  });
};

// Get a Blog
exports.getBlog = (req, res) => {
  const blog = req.blog;
  blog.image = undefined;
  return res.json(blog);
};

// Get class image
exports.getImage = (req, res, next) => {
  if (req.blog.image.data) {
    res.set("Content-Type", req.blog.image.contentType);
    return res.send(req.blog.image.data);
  }
  next();
};

// Create a Blog
exports.createBlog = (req, res) => {
  let img = fs.readFileSync(req.file.path);
  let encode_image = img.toString("base64");
  let finalImg = {
    contentType: req.file.mimetype,
    data: Buffer.from(encode_image, "base64"),
  };
  const blog = new Blog({
    name: req.body.name,
    image: finalImg,
    description1: req.body.description1,
    description2: req.body.description2,
  });
  blog.save().then((blog) => {
    if (!blog) {
      return res.status(400).json({
        errors: "Blog not created",
      });
    } else {
      blog.image = undefined;
      return res.json(blog);
    }
  });
};

// Update Blog
exports.updateBlog = (req, res) => {
  let updates = {
    name: req.body.name,
    description1: req.body.description1,
    description2: req.body.description2,
  };
  if (req.file) {
    let img = fs.readFileSync(req.file.path);
    let encode_image = img.toString("base64");
    let finalImg = {
      contentType: req.file.mimetype,
      data: Buffer.from(encode_image, "base64"),
    };
    updates.image = finalImg;
  }
  const options = { _id: req.blog._id };
  Blog.updateOne(options, updates).then((blog) => {
    if (!blog) {
      return res.status(400).json({
        errors: "Blog Not Updated",
      });
    } else {
      blog.image = undefined;
      return res.json(blog);
    }
  });
};

// Delete Blog
exports.deleteBlog = (req, res) => {
  const blog = req.blog;
  blog.deleteOne((err) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    } else {
      res.json({
        message: "Blog Deleted",
      });
    }
  });
};

// Get All Blogs
exports.getAllBlogs = (req, res) => {
  Blog.find().exec((err, blogs) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    }
    return res.json(blogs);
  });
};
