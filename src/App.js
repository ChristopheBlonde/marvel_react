import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Character from "./pages/Character/Character";
import Comics from "./pages/Comics/Comics";
import Favorites from "./pages/Favorites/Favorites";
import Cookies from "js-cookie";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSearch,
  faStar,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
library.add(faStar, faSearch, faWindowClose);

function App() {
  const [count, setCount] = useState("");
  const [limitCard, setLimitCard] = useState(100);
  const [token, setToken] = useState(Cookies.get("tokenMarvel") ? true : false);
  const [validationFavoritesHero, setValidationFavoritesHero] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenSignup, setModalIsOpenSignup] = useState(false);

  const validationHero = "Vos favoris ont bien été modifiés";

  /* Open close Modals */
  const openModalLogin = () => {
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModalLogin = () => {
    setModalIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const openModalSignup = () => {
    setModalIsOpenSignup(true);
    document.body.style.overflow = "hidden";
  };

  const closeModalSignup = () => {
    setModalIsOpenSignup(false);
    document.body.style.overflow = "auto";
  };

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
    setModalIsOpenSignup(!modalIsOpenSignup);
  };

  return (
    <Router>
      <Header
        token={token}
        setToken={setToken}
        openModalLogin={openModalLogin}
        closeModalLogin={closeModalLogin}
        openModalSignup={openModalSignup}
        closeModalSignup={closeModalSignup}
        toggleModal={toggleModal}
        modalIsOpen={modalIsOpen}
        modalIsOpenSignup={modalIsOpenSignup}
      />
      <Switch>
        <Route exact path="/">
          <Home
            count={count}
            setCount={setCount}
            limitCard={limitCard}
            setLimitCard={setLimitCard}
            validationHero={validationHero}
            token={token}
            openModalLogin={openModalLogin}
          />
        </Route>
        <Route path="/comics/:characterid">
          <Character
            validationHero={validationHero}
            token={token}
            openModalLogin={openModalLogin}
          />
        </Route>
        <Route path="/comics">
          <Comics
            count={count}
            setCount={setCount}
            limitCard={limitCard}
            setLimitCard={setLimitCard}
            validationHero={validationHero}
            token={token}
            openModalLogin={openModalLogin}
          />
        </Route>
        <Route path="/favorites/:id">
          <Favorites
            validationFavoritesHero={validationFavoritesHero}
            setValidationFavoritesHero={setValidationFavoritesHero}
            validationHero={validationHero}
          />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
