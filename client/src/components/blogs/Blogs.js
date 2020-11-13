import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogs } from "../../actions/apiCore";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  const getBlog = () => {
    getBlogs()
      .then((res) => {
        setBlogs(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBlog();
  }, []);

  console.log(blogs);

  const blogLayout = () => (
    <div className="container">
      <header
        class="blog-heading"
        style={{
          background: `url(${process.env.PUBLIC_URL}/assets/blog-heading.jpg) no-repeat center/cover`,
        }}
      >
        <h2>BLOGS</h2>
      </header>
      <section class="class-cards">
        {blogs.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt="" />
            <h4>{item.name}</h4>
            <Link to={`/blog/${item._id}`}>
              Learn More <i class="fa fa-chevron-right"></i>
            </Link>
          </div>
        ))}
      </section>
    </div>
  );

  return <React.Fragment>{blogLayout()}</React.Fragment>;
};

export default Blogs;
