import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getClass, getUserHistory } from "../../actions/apiCore";
import { isAuthenticated } from "../../actions/auth";
import "./styles.css";

const Class = (props) => {
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
    booking: [],
  });

  const [userHistory, setUserHistory] = useState([]);
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
          booking: data.booking,
        });
        hasBooked(data);
      })
      .catch((err) => console.log(err));
  };
  const [book, setBook] = useState(false);

  const getUserHistoryData = (userId, token) => {
    getUserHistory(userId, token).then((res) => {
      setUserHistory(res);
    });
  };
  console.log(userHistory);

  const joinNow = () => (
    <Link to={`/appointment/${class_data.id}`} class="btn class-join">
      Join Now
    </Link>
  );

  const browseClasses = () => (
    <div className="booked_class">
      <span>You have already booked this class</span>
      <Link to={`/classes`} class="btn class-join">
        Browse Classes
      </Link>
    </div>
  );

  useEffect(() => {
    getClassData(id);
    if (isAuthenticated()) {
      getUserHistoryData(user._id, token);
    }

    window.scrollTo(0, 0);
  }, []);

  const hasBooked = (data) => {
    data.booking.map((item) => {
      if (user._id === item.user) {
        setBook(true);
      }
    });
  };

  console.log(book);

  const classLayout = () => (
    <div>
      <header
        class="class-heading"
        style={{
          background: `url(${process.env.PUBLIC_URL}/assets/class-heading.jpg) no-repeat center/cover`,
        }}
      >
        <h2>Class Details</h2>
      </header>

      <div class="class-page">
        <section class="class-info">
          <div class="class-time">
            <h3>Class Information</h3>
            <div class="day-time">
              <p>
                <i class="fa fa-calendar-week fa-fw"></i>
                {class_data.day}
              </p>
              <p>
                <i class="far fa-clock fa-fw"></i>
                {class_data.slot.time}
              </p>
            </div>
            {isAuthenticated() && book && browseClasses()}
            {isAuthenticated() && !book && joinNow()}
            {!isAuthenticated() && (
              <div className="login-class">
                <span>Login to Book this Class</span>
                <Link to={`/login`} class="btn class-join">
                  Login
                </Link>
              </div>
            )}
          </div>
          <div class="instructor-details">
            <h3>About Instructor</h3>
            <div class="about-instructor">
              <img
                src={class_data.teacher.image}
                alt="instructor"
                class="img-instructor"
              />
              <div class="name-instructor">
                <h3>{class_data.teacher.name}</h3>
                <p>{class_data.teacher.role}</p>
                <div class="social-info">
                  <ul>
                    <li>
                      <a href={class_data.social.instagram}>
                        <i class="fab fa-instagram-square fa-2x"></i>
                      </a>
                    </li>
                    <li>
                      <a href={class_data.social.linkedin}>
                        <i class="fab fa-linkedin fa-2x"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="class-desc">
          <img src={class_data.image} alt="" class="class-image" />
          <div class="day-time">
            <p>
              <i class="fa fa-calendar-week fa-fw"></i>
              {class_data.day}
            </p>
            <p>
              <i class="far fa-clock fa-fw"></i>
              {class_data.slot.time}
            </p>
          </div>
          <h2>{class_data.name}</h2>
          <p>{class_data.description}</p>
        </section>
      </div>
    </div>
  );

  return <React.Fragment>{classLayout()}</React.Fragment>;
};

export default Class;
