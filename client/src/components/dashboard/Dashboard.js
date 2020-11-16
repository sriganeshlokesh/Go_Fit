import React, { useState, useEffect } from "react";
import moment from "moment";
import { isAuthenticated } from "../../actions/auth";
import { Link } from "react-router-dom";
import { getUserHistory, getUser } from "../../actions/apiCore";
import "./styles.css";

const Dashboard = () => {
  const { user, token } = isAuthenticated();

  const [customer, setCustomer] = useState({});
  const [bookingHistory, setBookingHistory] = useState([]);

  const userHistory = (userId, token) => {
    getUserHistory(userId, token).then((res) => {
      setBookingHistory(res);
    });
  };

  const getUserProfile = (userId, token) => {
    getUser(userId, token).then((res) => {
      setCustomer(res);
    });
  };

  useEffect(() => {
    getUserProfile(user._id, token);
    userHistory(user._id, token);
  }, []);

  const dashboardLayout = () => (
    <React.Fragment>
      <div className="cover"></div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-5" id="left">
            <div class="card" id="user">
              <div class="card-header">Profile ID: {customer._id}</div>
              <div class="card-block">
                <h4 class="card-title">Welcome, {customer.name}</h4>

                <div class="row mt-2"></div>
                <div class="row mt-2">
                  <div class="col-1">
                    <i class="fa fa-phone"></i>
                  </div>
                  <div class="col">Phone: +1 {customer.phone}</div>
                </div>
                <div class="row mt-2">
                  <div class="col-1">
                    <i class="fa fa-envelope"></i>
                  </div>
                  <div class="col">Email: {user.email}</div>
                </div>
                <div class="row mt-2">
                  <div className="col-1">
                    <i class="fas fa-running"></i>
                  </div>
                  <div class="col">
                    Joined: {moment(customer.createdAt).format("MMMM Do YYYY")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md">
            <div class="row">
              <div class="col">
                <div class="card" id="recentActivity">
                  <div class="card-header">Booking History</div>
                  <ul class="list-group">
                    {bookingHistory.length > 0 &&
                      bookingHistory.map((booking, index) => (
                        <li class="list-group-item">
                          <div class="row no-gutters">
                            <div class="col">
                              <div class="row no-gutters align-content-center">
                                <div>
                                  <span class="fa-stack fa-lg">
                                    <i class="fa fa-truck fa-fw"></i>
                                  </span>
                                </div>
                                <div class="col">
                                  <p>Booking ID: {booking._id}</p>
                                  <p>Class: {booking.class.name}</p>
                                  <p>
                                    Instructor: {booking.class.teacher.name}
                                  </p>
                                  <p>Date: {booking.class.day}</p>
                                  <p>Slot: {booking.class.slot.time}</p>
                                </div>
                              </div>
                            </div>
                            <div class="col right">
                              <div class="row no-gutters justify-content-center align-items-center">
                                <div class="view">
                                  <p>
                                    Date:{" "}
                                    {moment(booking.class.date).format(
                                      "MMMM Do YYYY"
                                    )}
                                  </p>
                                </div>
                                <div class="text-center">
                                  Booked: {moment(booking.createdAt).fromNow()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
  return <div>{dashboardLayout()}</div>;
};

export default Dashboard;
