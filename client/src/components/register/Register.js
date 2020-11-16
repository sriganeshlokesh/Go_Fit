import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import classnames from "classnames";
import { authenticate, isAuthenticated } from "../../actions/auth";
import axios from "axios";
import "./styles.css";

const Register = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    phone: "",
    errors: "",
    redirect: false,
  });

  const { name, email, password, password2, phone, errors, redirect } = input;

  const handleChange = (name) => (event) => {
    setInput({ ...input, errors: false, [name]: event.target.value });
  };

  const registerUser = (event) => {
    event.preventDefault();
    register({ name, email, password, password2, phone });
  };

  const redirectUser = () => {
    if (redirect) {
      return <Redirect to="/user/dashboard" />;
    }
  };

  async function register(user) {
    await axios
      .post(`/api/auth/register`, user)
      .then((res) => {
        authenticate(res.data, () => {
          setInput({
            ...input,
            redirect: true,
          });
        });
      })
      .catch((err) => {
        setInput({ ...input, errors: err.response.data });
      });
  }
  const registerForm = () => (
    <div class="container">
      <div class="row">
        <div class="col-lg-10 col-xl-9 mx-auto my-auto">
          <div class="card card-register flex-row my-5">
            <div
              class="card-img-left d-none d-md-flex"
              style={{
                background: `url(${process.env.PUBLIC_URL}/assets/register.jpg) left/cover`,
              }}
            ></div>
            <div class="card-content">
              <h5 class="card-title text-center">Register</h5>
              <form noValidate class="form-register" onSubmit={registerUser}>
                <div class="form-label-group">
                  <input
                    type="text"
                    id="inputUsername"
                    name="name"
                    onChange={handleChange("name")}
                    className={classnames("form-control", {
                      "is-invalid": errors.name,
                    })}
                    placeholder="Username"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                  <label for="inputUsername">Username</label>
                </div>

                <div class="form-label-group">
                  <input
                    type="email"
                    id="inputEmail"
                    name="email"
                    placeholder="Email address"
                    onChange={handleChange("email")}
                    className={classnames("form-control", {
                      "is-invalid": errors.email,
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                  <label for="inputEmail">Email address</label>
                </div>

                <div class="form-label-group">
                  <input
                    type="password"
                    id="inputPassword"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange("password")}
                    className={classnames("form-control", {
                      "is-invalid": errors.password,
                    })}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                  <label for="inputPassword">Password</label>
                </div>

                <div class="form-label-group">
                  <input
                    type="password"
                    id="inputConfirmPassword"
                    name="password2"
                    placeholder="Confirm Password"
                    onChange={handleChange("password2")}
                    className={classnames("form-control", {
                      "is-invalid": errors.password2,
                    })}
                  />
                  <label for="inputConfirmPassword">Confirm Password</label>
                  {errors.password2 && (
                    <div className="invalid-feedback">{errors.password2}</div>
                  )}
                </div>

                <div class="form-label-group">
                  <input
                    type="number"
                    id="inputPhone"
                    name="phone"
                    placeholder="Enter Phone Number"
                    onChange={handleChange("phone")}
                    className="form-control"
                  />
                  <label for="inputPhone">Phone Number</label>
                </div>

                <input
                  class="btn btn-lg btn-button btn-block text-uppercase"
                  type="submit"
                  value="Register"
                />
                <Link class="d-block text-center mt-2" to="/login">
                  Sign In
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {registerForm()}
      {redirectUser()}
    </div>
  );
};
export default Register;
