import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/landing/Home";
import Classes from "./components/classes/Classes";
import Blogs from "./components/blogs/Blogs";
import "./App.css";
import Navbar from "./components/layouts/navbar/Navbar";
import Footer from "./components/layouts/footer/Footer";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./actions/PrivateRoute";
import Blog from "./components/blog/Blog";
import Class from "./components/class/Class";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/classes" exact component={Classes} />
        <Route path="/blogs" exact component={Blogs} />
        <Route path="/blog/:blogId" exact component={Blog} />
        <Route path="/class/:classId" exact component={Class} />
        <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
