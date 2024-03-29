import "./Home.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as qs from "qs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardHeroes from "../../components/CardHeroes/CardHeroes";
import Cookies from "js-cookie";
import Paging from "../../components/Paging/Paging";
import thor from "../../images/thor.png";
require("dotenv").config();

const Home = ({
  count,
  setCount,
  limitCard,
  setLimitCard,
  token,
  validationHero,
  openModalLogin,
}) => {
  const [searchCharater, setSearchCharacter] = useState("");
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [validationFavoritesHero, setValidationFavoritesHero] = useState(false);
  const [favorites, setFavorites] = useState();
  const [scroll, setScroll] = useState(false);

  const location = useLocation();
  const currentPage = qs.parse(location.search.substring(1)).page;

  const urlServer = process.env.REACT_APP_URL_SERVER;

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${urlServer}/characters?name=${searchCharater}&limit=${limitCard}&page=${currentPage}`
      );
      setData(response.data);
      setCount(response.data.count);
      setIsLoading(false);
    };

    /* check favorite */
    if (token) {
      const fetchDataFavorite = async () => {
        const res = await axios.get(
          `${urlServer}/favorites/${Cookies.get("infoUser").split(",")[0]}`,
          { headers: { authorization: `Bearer ${Cookies.get("tokenMarvel")}` } }
        );
        setFavorites(res.data.favorites);
      };
      fetchDataFavorite();
    }
    /* Scroll visibility */
    const toggleScrollToTop = () => {
      if (window.pageYOffset > 600) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", toggleScrollToTop);

    fetchData();
  }, [searchCharater, limitCard, currentPage, setCount, token, urlServer]);

  /* input search value */
  const handleChangeCharacter = (event) => {
    setSearchCharacter(event.target.value);
  };

  /* add in favorites */
  const handleFavorites = async (index) => {
    try {
      if (token) {
        const characters = data.results[index];

        const res = await axios.put(
          `${urlServer}/user/update/${Cookies.get("infoUser").split(",")[0]}`,
          { characters: characters },
          { headers: { authorization: `Bearer ${Cookies.get("tokenMarvel")}` } }
        );

        if (res.status === 200) {
          setFavorites(res.data.favorites);
          setValidationFavoritesHero(index);
          setTimeout(() => {
            setValidationFavoritesHero(false);
          }, 2000);
        }
      } else {
        openModalLogin();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return isLoading ? (
    <div className="loading">
      <div>Chargement en cours...</div>
    </div>
  ) : (
    <section className="characters content">
      <div className="inputSearch">
        <div className="findHero">
          <label htmlFor="search">
            <input
              value={searchCharater}
              onChange={handleChangeCharacter}
              type="text"
              className="search"
              placeholder="Rechercher un personnage"
            />
          </label>
          <FontAwesomeIcon className="iconSearch" icon="search" />
        </div>
      </div>

      <Paging
        onPage={currentPage}
        itemCount={count}
        itemLimit={limitCard}
        setLimitCard={setLimitCard}
        title="héros"
        url="/"
      />

      {scroll ? (
        <div onClick={scrollToTop} className="scrollToUp">
          <FontAwesomeIcon className="iconScroll" icon="chevron-up" />
          <img className="scrollImg" src={thor} alt="thor" />
        </div>
      ) : null}

      <div className="containerCard">
        {data.results.map((elem, index) => {
          return (
            <CardHeroes
              key={elem._id}
              _id={elem._id}
              name={elem.name}
              description={elem.description}
              index={index}
              path={elem.thumbnail.path}
              extension={elem.thumbnail.extension}
              handleFavorites={handleFavorites}
              validationFavoritesHero={validationFavoritesHero}
              validationHero={validationHero}
              favorites={favorites}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Home;
