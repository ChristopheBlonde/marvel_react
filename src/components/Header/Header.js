import "./Header.scss";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import logo from "../../images/Marvel_Logo.png";
import spiderGirl from "../../images/spider_girl.png";
import groot from "../../images/root.png";
import Login from "../Modals/Login";
import Signup from "../Modals/Signup";
import Cookies from "js-cookie";

const Header = ({
  token,
  setToken,
  openModalLogin,
  closeModalLogin,
  openModalSignup,
  closeModalSignup,
  toggleModal,
  modalIsOpen,
  modalIsOpenSignup,
}) => {
  const [locationModal, setLocationModal] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const location = useLocation();
  const history = useHistory();

  const user = Cookies.get("infoUser");
  const handleRouteFavorites = () => {
    if (!user) {
      openModalLogin();
      setLocationModal(true);
    }
  };

  const handleDisconnect = () => {
    if (user) {
      const cookieLog = Cookies.get("infoUser").split(",")[0];
      if (cookieLog && location.pathname === `/favorites/${cookieLog}`) {
        history.push("/");
      }
    }

    Cookies.remove("tokenMarvel");
    Cookies.remove("infoUser");
    setToken(false);
  };

  return (
    <header>
      <div className="headerImg content">
        <div>
          <img className="heroImgHeader1" src={spiderGirl} alt="spider girl" />
        </div>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo marvel" />
          </Link>
        </div>
        <div>
          <img className="heroImgHeader2" src={groot} alt="thor" />
        </div>
      </div>

      <nav className="content navHeader">
        <div>
          <Link to="/">
            <button>Personnages</button>
          </Link>
          <Link to="/comics">
            <button>Comics</button>
          </Link>
          <Link
            to={
              user
                ? `/favorites/${user.split(",")[0]}`
                : location.pathname + location.search
            }
          >
            <button onClick={handleRouteFavorites}>Favoris</button>
          </Link>
        </div>
        {token ? (
          <div className="userLogged">
            <button className="btnDisconnect" onClick={handleDisconnect}>
              Déconnexion
            </button>
            <div className="userConnected">
              <img src={user.split(",")[2]} alt="avatar user" />
              <span className="userName">{user.split(",")[1]}</span>
            </div>
          </div>
        ) : (
          <div className="noUser">
            <button onClick={openModalSignup}>S'inscrire</button>
            <button onClick={openModalLogin}>Se connecter</button>
          </div>
        )}
      </nav>
      <Login
        openModal={openModalLogin}
        modalIsOpen={modalIsOpen}
        closeModal={closeModalLogin}
        toggleModal={toggleModal}
        locationModal={locationModal}
        setToken={setToken}
        hidePassword={hidePassword}
        setHidePassword={setHidePassword}
      />
      <Signup
        openModal={openModalSignup}
        modalIsOpen={modalIsOpenSignup}
        closeModal={closeModalSignup}
        toggleModal={toggleModal}
        setToken={setToken}
        hidePassword={hidePassword}
        setHidePassword={setHidePassword}
      />
    </header>
  );
};

export default Header;
