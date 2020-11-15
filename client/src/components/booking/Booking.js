import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../actions/auth";
import axios from "axios";
import "./styles.css";

const Booking = (props) => {
  const bookingId = props.location.state.id;
  const { user, token } = isAuthenticated();
  console.log(user);
  const [booking, setBooking] = useState({
    id: "",
    user: {},
    class: {},
    teacher: {},
    slot: {},
  });

  const getBooking = (id, bookingId, token) => {
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

  useEffect(() => {
    getBooking(user._id, bookingId, token).then((data) => {
      setBooking({
        id: data._id,
        user: data.user,
        class: data.class,
        teacher: data.class.teacher,
        slot: data.class.slot,
      });
    });
  }, []);

  const bookingLayout = () => (
    <div>
      <header
        class="success-heading"
        style={{
          background: `url(${process.env.PUBLIC_URL}/assets/booking-heading.jpg) no-repeat center/cover`,
        }}
      >
        <h2>Booking Successful</h2>
      </header>

      <div class="booking-page">
        <div class="booking-card">
          <div class="success-card">
            <p class="booking-heading">
              <i class="far fa-user fa-fw"></i>Confirmation Number#:{" "}
            </p>
            <p class="booking-content">{booking.id}</p>
          </div>
          <div class="user-card">
            <p class="name-heading">
              <i class="far fa-user fa-fw"></i>Name:{" "}
            </p>
            <p class="name-content">{booking.user.name} </p>
          </div>
          <div class="class-card">
            <p class="classes-heading">
              <i class="fas fa-dumbbell fa-fw"></i>Class:{" "}
            </p>
            <p class="class-content">{booking.class.name}</p>
          </div>
          <div class="instructor-card">
            <p class="instructor-heading">
              <i class="fas fa-hiking fa-fw"></i>Instructor:{" "}
            </p>
            <p class="instructor-content">{booking.teacher.name}</p>
          </div>
          <div class="daytime-card">
            <p class="daytime-time">
              <i class="fas fa-calendar-day fa-fw"></i>Day: {booking.class.day}
            </p>
            <p class="daytime-date">
              <i class="far fa-clock fa-fw"></i>Time: {booking.slot.time}
            </p>
            <p class="daytime-daytime">
              <i class="far fa-sun fa-fw"></i>
              {booking.slot.name}
            </p>
          </div>
          <div class="duration-card">
            <p class="duration-heading">
              <i class="far fa-bell fa-fw"></i>Duration:{" "}
            </p>
            <p class="duration-content">{booking.class.duration} Hours</p>
          </div>
          <div class="booking-button">
            <Link to="/classes" class="btn">
              Browse Classes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  return <React.Fragment>{bookingLayout()}</React.Fragment>;
};

export default Booking;
