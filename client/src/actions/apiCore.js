import axios from "axios";

export const getUser = (id, token) => {
  return axios
    .get(`/api/user/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const getClasses = () => {
  return axios
    .get("/api/class/all/class?limit=6")
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllClasses = () => {
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

export const getBookings = (id, bookingId, token) => {
  console.log(id);
  console.log(bookingId);
  console.log(token);
  return axios
    .get(`/api/appointment/${bookingId}/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const bookAppointment = (classId, id, token) => {
  return axios
    .post(`/api/appointment/create/${id}/${classId}`, null, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};

// User Booking History
export const getUserHistory = (id, token) => {
  return axios
    .get(`/api/user/history/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};
