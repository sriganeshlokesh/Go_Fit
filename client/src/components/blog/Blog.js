import React, { useState, useEffect } from "react";
import { getBlog } from "../../actions/apiCore";
import moment from "moment";
import "./styles.css";

const Blog = (props) => {
  const [blog, setBlog] = useState({});
  const id = props.match.params.blogId;

  const blogContent = (blogId) => {
    getBlog(blogId)
      .then((res) => {
        setBlog(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    blogContent(id);
  }, []);

  const blogLayout = () => (
    <div className="container">
      <section class="blog-head">
        <div class="inner-blog">
          <h2 class="blog-h2">{blog.name}</h2>
        </div>
        <div class="blog-date">
          <ul>
            <li>{blog.author}</li>
            <li>{moment(blog.createdAt).format("MMMM Do YYYY")}</li>
          </ul>
        </div>
      </section>
      <section class="blog-image">
        <img src={blog.image} alt="" />
      </section>

      <section class="blog-content">
        <p className="desc1">{blog.description1}</p>
        <hr />
        <p className="desc2">{blog.description2}</p>
        <hr />
        <p className="desc3">{blog.description3}</p>
        <p className="desc4">{blog.description4}</p>
      </section>
    </div>
  );
  return <React.Fragment>{blogLayout()}</React.Fragment>;
};

export default Blog;
