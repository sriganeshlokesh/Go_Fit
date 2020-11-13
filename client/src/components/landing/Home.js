import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getClasses } from "../../actions/apiCore";
import "./styles.css";

const Home = () => {
  const [classes, setClasses] = useState([]);

  const getClassesData = () => {
    getClasses()
      .then((data) => {
        setClasses(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getClassesData();
  }, []);
  return (
    <div className="container">
      <header
        class="showcase"
        style={{
          background: `url(${process.env.PUBLIC_URL}/assets/slide.jpg) no-repeat center/cover`,
        }}
      >
        <h2>Go Book your Next Appointment</h2>
        <p>Remember Why You Started</p>
        <Link to="#" class="btn">
          Book Appointment <i class="fa fa-chevron-right"></i>
        </Link>
      </header>

      <header class="caption">
        <h2>Let's Workout Through This</h2>
      </header>

      <section class="class-cards">
        {classes.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt="" />
            <h3>{item.name}</h3>
            <div className="class-timing">
              <h6>
                <i class="fas fa-calendar-day fa-fw"></i>
                {item.day}
              </h6>
              <h6>
                <i class="far fa-clock"></i>
                {item.slot.time}
              </h6>
            </div>
            <Link to={`/class/${item._id}`}>
              Learn More <i class="fa fa-chevron-right"></i>
            </Link>
          </div>
        ))}
      </section>
      <section
        class="appointment"
        style={{
          background: `url(${process.env.PUBLIC_URL}/assets/appointment.jpg) no-repeat center/cover`,
        }}
      >
        <div class="content">
          <h2>Keep Moving With Us!</h2>
          <p>United We Move and now let's keep moving together!</p>
          <a href="#" class="btn">
            Book Appointment <i class="fa fa-chevron-right"></i>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
