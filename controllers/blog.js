const Blog = require("../models/Blog");
const multer = require("multer");
const fs = require("fs");
const Buffer = require("safe-buffer").Buffer;
const { Storage } = require("@google-cloud/storage");

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

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
  if (!req.file) {
    res.status(400).json({
      errors: "Could not upload image",
    });
  }
  // Create new blob in the bucket referencing the file
  const blob = bucket.file(req.file.originalname);

  // initialize a writable stream
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  // Check for errors in Writestream object
  blobStream.on("error", (err) => next(err));

  blobStream.on("finish", () => {
    // Assembling public URL for accessing the file via HTTP
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURI(blob.name)}?alt=media`;
    const blog = new Blog({
      name: req.body.name,
      description1: req.body.description1,
      description2: req.body.description2,
      image: publicUrl,
    });
    blog
      .save()
      .then((blog) => {
        if (!blog) {
          return res.status(400).json({
            errors: "Blog not created",
          });
        } else {
          return res.json(blog);
        }
      })
      .catch((err) => console.log(err));
  });

  // When there is no more data to be consumed from the stream
  blobStream.end(req.file.buffer);
};

// Update Blog
exports.updateBlog = (req, res) => {
  // Create new blob in the bucket referencing the file
  const blob = bucket.file(req.file.originalname);

  // initialize a writable stream
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  // Check for errors in Writestream object
  blobStream.on("error", (err) => next(err));

  blobStream.on("finish", () => {
    // Assembling public URL for accessing the file via HTTP
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURI(blob.name)}?alt=media`;
    let updates = {
      name: req.body.name,
      description1: req.body.description1,
      description2: req.body.description2,
      image: publicUrl,
    };
    const options = { _id: req.blog._id };
    Blog.updateOne(options, updates).then((blog) => {
      if (!blog) {
        return res.status(400).json({
          errors: "Blog Not Updated",
        });
      } else {
        return res.json(blog);
      }
    });
  });

  // When there is no more data to be consumed from the stream
  blobStream.end(req.file.buffer);
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
