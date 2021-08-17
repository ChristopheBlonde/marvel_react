import React from "react";
import "./Footer.scss";
import git from "./images/logo_github.png";
import logoReacteur from "./images/reacteur.png";
import logoReact from "./images/logo_react.png";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <nav className="nav">
          <span>Made with</span>
          <a href="https://create-react-app.dev/">
            <img src={logoReact} alt="logo react" />
            React
          </a>
          <span>at</span>
          <a href="https://www.lereacteur.io/">
            <img
              className="logoReacteur"
              src={logoReacteur}
              alt="logo reacteur"
            />
            Le Reacteur
          </a>
          <span>by</span>
          <a href="https://github.com/ChristopheBlonde">
            <img src={git} alt="logo github" />
            Chris
          </a>
        </nav>
      </div>
    </footer>
  );
};
export default Footer;
