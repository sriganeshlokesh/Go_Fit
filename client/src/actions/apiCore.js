import axios from "axios";

export const getClasses = () => {
  return axios
    .get("/api/class/all/class")
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getClass = (id) => {
  return axios
    .get(`/api/class/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const getBlogs = () => {
  return axios
    .get("/api/blog/all/blog")
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const getBlog = (id) => {
  return axios
    .get(`/api/blog/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};
