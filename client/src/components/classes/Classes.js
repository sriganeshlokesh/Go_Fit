import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllClasses } from "../../actions/apiCore";
import "./styles.css";

const Classes = () => {
  const [classes, setClasses] = useState([]);

  const getClass = () => {
    getAllClasses().then((res) => {
      setClasses(res);
    });
  };

  useEffect(() => {
    getClass();
  }, []);

  const classesLayout = () => (
    <div className="container">
      <header
        class="heading"
        style={{
          background: `url(${process.env.PUBLIC_URL}/assets/heading.jpg) no-repeat center/cover`,
        }}
      >
        <h2>You Want It, We Got It!</h2>
        <p>
          Go Fit aims to give its members the very best: from modern equipment,
          to a clean and welcoming atmosphere with an expert staff.
        </p>
      </header>

      <section class="class-cards">
        {classes.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt="" />
            <h4>
              {item.name} ({item.slot.name})
            </h4>
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
    </div>
  );

  return <div>{classesLayout()}</div>;
};
export default Classes;
