import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./styles.css";

const Footer = () => {
  return (
    <div>
      <footer class="footer">
        <div class="footer-inner">
          <div>
            <i class="fa fa-globe fa-2x"></i>
            English (United States)
          </div>
          <ul>
            <li>
              <Link href="#">&copy; GoFit 2020</Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};
export default Footer;
