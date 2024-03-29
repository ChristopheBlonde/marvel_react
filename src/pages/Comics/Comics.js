import "./Comics.scss";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardComics from "../../components/CardComics/CardComics";
import Cookies from "js-cookie";
import axios from "axios";
import * as qs from "qs";
import Paging from "../../components/Paging/Paging";
import vision from "../../images/vision.png";
require("dotenv").config();

const Comics = ({
  count,
  setCount,
  limitCard,
  setLimitCard,
  validationHero,
  token,
  openModalLogin,
}) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchComics, setSearchComics] = useState("");
  const [validationFavoritesHero, setValidationFavoritesHero] = useState(false);
  const [favorites, setFavorites] = useState();
  const [scroll, setScroll] = useState(false);

  const urlServer = process.env.REACT_APP_URL_SERVER;
  /* paging */

  const location = useLocation();
  let currentPage = qs.parse(location.search.substring(1)).page;

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${urlServer}/comics?title=${searchComics}&limit=${limitCard}&page=${currentPage}`
      );
      if (token) {
        const fetchDataFavorite = async () => {
          const res = await axios.get(
            `${urlServer}/favorites/${Cookies.get("infoUser").split(",")[0]}`,
            {
              headers: {
                authorization: `Bearer ${Cookies.get("tokenMarvel")}`,
              },
            }
          );
          setFavorites(res.data.favorites);
        };
        fetchDataFavorite();
      }

      setCount(response.data.count);
      setData(response.data);
      setIsLoading(false);
    };
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
  }, [searchComics, setCount, limitCard, currentPage, token, urlServer]);

  const handleChangeComic = (event) => {
    setSearchComics(event.target.value);
  };
  /* Add favorites */
  const handleFavoritesComics = async (index) => {
    try {
      if (token) {
        const comics = data.results[index];
        const res = await axios.put(
          `${urlServer}/user/update/${Cookies.get("infoUser").split(",")[0]}`,
          { comics: comics },
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

  /* Scroll to top */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return isLoading ? (
    <div className="loading">
      <div>Chargement en cours...</div>
    </div>
  ) : (
    <section>
      <div className="comicsSearch">
        <div className="findComics">
          <label htmlFor="search">
            <input
              value={searchComics}
              onChange={handleChangeComic}
              placeholder="Rechercher un comic"
              type="text"
            />
          </label>
          <FontAwesomeIcon className="iconSearch" icon="search" />
        </div>
      </div>

      {scroll ? (
        <div onClick={scrollToTop} className="scrollToUp">
          <FontAwesomeIcon className="iconScroll" icon="chevron-up" />
          <img className="scrollImg" src={vision} alt="thor" />
        </div>
      ) : null}

      <Paging
        onPage={currentPage}
        itemCount={count}
        itemLimit={limitCard}
        setLimitCard={setLimitCard}
        title="comics"
        url="/comics"
      />
      <div className="containerCard content">
        {data.results.map((elem, index) => {
          return (
            <CardComics
              key={elem._id}
              _id={elem._id}
              name={elem.title}
              path={elem.thumbnail.path}
              extension={elem.thumbnail.extension}
              description={elem.description}
              index={index}
              handleFavorites={handleFavoritesComics}
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

export default Comics;
