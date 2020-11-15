import React, { useState } from "react";
import { isAuthenticated } from "../../actions/auth";
import { Link } from "react-router-dom";
import "./styles.css";

const Dashboard = () => {
  const { user, token } = isAuthenticated();

  const dashboardLayout = () => (
    <React.Fragment>
      <div className="cover"></div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-5" id="left">
            <div class="card" id="user">
              <div class="card-header">Profile ID: {user._id}</div>
              <div class="card-block">
                <h4 class="card-title">Welcome, {user.name}</h4>
                <div class="row">
                  <div class="col"></div>
                </div>
                <div class="row mt-2">
                  <div class="col-1">
                    <i class="fa fa-map-marker"></i>
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-1">
                    <i class="fa fa-phone"></i>
                  </div>
                  <div class="col">+1 31231231231</div>
                </div>
                <div class="row mt-2">
                  <div class="col-1">
                    <i class="fa fa-envelope"></i>
                  </div>
                  <div class="col">{user.email}</div>
                </div>
                <div class="row mt-2">
                  <div class="col">Joined:</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md">
            <div class="row">
              <div class="col">
                <div class="card" id="recentActivity">
                  <div class="card-header">Booking History</div>
                  {/* <ul class="list-group">
                    {purchase.map((order, index) => (
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
                                <p>Transaction ID: {order.transaction_id}</p>
                                <p>Price: {order.amount}</p>
                              </div>
                            </div>
                          </div>
                          <div class="col right">
                            <div class="row no-gutters justify-content-center align-items-center">
                              <div class="view">
                                <p>{order.status}</p>
                              </div>
                              <div class="text-center">
                                {moment(order.createdAt).fromNow()}
                              </div>
                            </div>
                          </div>
                          <div className="col-2 mx-5 pull-right text-center mt-2">
                            <Link
                              to={`/order/${order.transaction_id}`}
                              className="btn view-order"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul> */}
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
