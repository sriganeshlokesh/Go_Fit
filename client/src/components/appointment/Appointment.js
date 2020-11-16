import React, { useState, useEffect } from "react";
import { getClass, bookAppointment } from "../../actions/apiCore";
import { isAuthenticated } from "../../actions/auth";
import { Link, Redirect } from "react-router-dom";
import "./styles.css";

const Appointment = (props) => {
  const [class_data, setClass] = useState({
    id: "",
    name: "",
    image: "",
    capacity: "",
    slot: {},
    teacher: {},
    social: {},
    day: "",
    description: "",
    duration: 0,
  });
  const id = props.match.params.classId;
  const { user, token } = isAuthenticated();

  const getClassData = (classId) => {
    getClass(classId)
      .then((data) => {
        setClass({
          id: data._id,
          name: data.name,
          image: data.image,
          capacity: data.capacity,
          slot: data.slot,
          teacher: data.teacher,
          social: data.teacher.social,
          day: data.day,
          description: data.description,
          duration: data.duration,
        });
      })
      .catch((err) => console.log(err));
  };
  const createAppointment = () => {
    bookAppointment(class_data.id, user._id, token).then((res) => {
      redirectToHome(res._id);
    });
  };

  const redirectToHome = (bookingId) => {
    props.history.push({
      pathname: "/success/booking",
      state: {
        id: bookingId,
      },
    });
    return <Redirect to="/success/booking" />;
  };

  useEffect(() => {
    getClassData(id);
  }, []);

  const appointmentLayout = () => (
    <div>
      <header
        class="appointment-heading"
        style={{
          background: `url(${process.env.PUBLIC_URL}/assets/booking-heading.jpg) no-repeat center/cover`,
        }}
      >
        <h2>Book Appointment</h2>
      </header>

      <div class="appointment-page">
        <div class="appointment-card">
          <div class="user-card">
            <p class="name-heading">
              <i class="far fa-user fa-fw"></i>Name:{" "}
            </p>
            <p class="name-content">{user.name}</p>
          </div>
          <div class="email-card">
            <p class="email-heading">
              <i class="far fa-user fa-fw"></i>Email:{" "}
            </p>
            <p class="email-content">{user.email}</p>
          </div>
          <div class="class-card">
            <p class="classes-heading">
              <i class="fas fa-dumbbell fa-fw"></i>Class:{" "}
            </p>
            <p class="class-content">{class_data.name}</p>
          </div>
          <div class="instructor-card">
            <p class="instructor-heading">
              <i class="fas fa-hiking fa-fw"></i>Instructor:{" "}
            </p>
            <p class="instructor-content">{class_data.teacher.name}</p>
          </div>
          <div class="daytime-card">
            <p class="daytime-time">
              <i class="fas fa-calendar-day fa-fw"></i>Day: {class_data.day}
            </p>
            <p class="daytime-date">
              <i class="far fa-clock fa-fw"></i>Time: {class_data.slot.time}
            </p>
            <p class="daytime-daytime">
              <i class="far fa-sun fa-fw"></i>
              {class_data.slot.name}
            </p>
          </div>
          <div class="duration-card">
            <p class="duration-heading">
              <i class="far fa-bell fa-fw"></i>Duration:{" "}
            </p>
            <p class="duration-content">{class_data.duration} Hours</p>
          </div>
          <div>
            <p class="confirm-header">Confirm Booking?</p>
          </div>
          <div class="booking-button">
            <button class="btn" onClick={createAppointment}>
              Confirm
            </button>
            <Link to={`/class/${id}`} class="cancel-booking">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return <React.Fragment>{appointmentLayout()}</React.Fragment>;
};

export default Appointment;
