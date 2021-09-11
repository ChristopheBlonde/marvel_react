import "./Favorites.scss";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import CardComics from "../../components/CardComics/CardComics";
import CardHeroes from "../../components/CardHeroes/CardHeroes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";
require("dotenv").config();

const Favorites = ({ validationHero }) => {
  const { id } = useParams();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState();

  const urlServer = process.env.REACT_APP_URL_SERVER;

  const fetchData = useCallback(async () => {
    const response = await axios.get(`${urlServer}/favorites/${id}`, {
      headers: { authorization: `Bearer ${Cookies.get("tokenMarvel")}` },
    });
    setFavorites(response.data.favorites);
    setData(response.data.favorites);
    setIsLoading(false);
  }, [id, urlServer]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Add in favorites */
  const handleFavorites = async (index) => {
    try {
      const characters = data.characters[index];
      await axios.put(
        `${urlServer}/user/update/${Cookies.get("infoUser").split(",")[0]}`,
        { characters: characters },
        { headers: { authorization: `Bearer ${Cookies.get("tokenMarvel")}` } }
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavoritesComics = async (index) => {
    try {
      const comics = data.comics[index];
      await axios.put(
        `${urlServer}/user/update/${Cookies.get("infoUser").split(",")[0]}`,
        { comics: comics },
        { headers: { authorization: `Bearer ${Cookies.get("tokenMarvel")}` } }
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  /* Scroll arrows */
  const sideScroll = (element, direction, speed, distance, step) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      if (direction === "left") {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  };

  return isLoading ? (
    <div className="loading">
      <div>Chargement en cours...</div>
    </div>
  ) : (
    <div className="favorites">
      <h1>Mes Favoris</h1>
      <div className="content containerScroll">
        <h3>Les Héros</h3>
        <div id="heros" className="favoritesHero">
          {data.characters.length === 0 ? (
            <div className="emptyFavorites">
              Tu n'as pas encore de héros en favoris
            </div>
          ) : (
            <>
              <div className="scrollLeftHero">
                <FontAwesomeIcon
                  className="iconFavoriteArrow"
                  icon="arrow-left"
                  onClick={() => {
                    const container = document.getElementById("heros");
                    sideScroll(container, "left", 25, 419, 20);
                  }}
                />
              </div>
              {data.characters.map((elem, index) => {
                return (
                  <div key={elem._id}>
                    <CardHeroes
                      _id={elem._id}
                      name={elem.name}
                      path={elem.thumbnail.path}
                      extension={elem.thumbnail.extension}
                      description={elem.description}
                      index={index}
                      favorites={favorites}
                      handleFavorites={handleFavorites}
                      validationHero={validationHero}
                    />
                  </div>
                );
              })}
              <div className="scrollRightHero">
                <FontAwesomeIcon
                  className="iconFavoriteArrow"
                  icon="arrow-right"
                  onClick={() => {
                    const container = document.getElementById("heros");
                    sideScroll(container, "right", 25, 419, 20);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="content containerScroll">
        <h3>les Comics</h3>
        <div id="comics" className="favoritesComics">
          {data.comics.length === 0 ? (
            <div className="emptyFavorites">
              Tu n'as pas encore de Comics en favoris
            </div>
          ) : (
            <>
              <div className="scrollLeft">
                <FontAwesomeIcon
                  className="iconFavoriteArrow"
                  icon="arrow-left"
                  onClick={() => {
                    const container = document.getElementById("comics");
                    sideScroll(container, "left", 25, 670, 20);
                  }}
                />
              </div>
              {data.comics.map((elem, index) => {
                return (
                  <div key={elem._id}>
                    <CardComics
                      name={elem.title}
                      _id={elem._id}
                      path={elem.thumbnail.path}
                      extension={elem.thumbnail.extension}
                      description={elem.description}
                      index={index}
                      handleFavorites={handleFavoritesComics}
                      favorites={favorites}
                      validationHero={validationHero}
                    />
                  </div>
                );
              })}
              <div className="scrollRight">
                <div className="iconFavoriteArrow">
                  <FontAwesomeIcon
                    className="iconFavoriteArrow"
                    icon="arrow-right"
                    onClick={() => {
                      const container = document.getElementById("comics");
                      sideScroll(container, "right", 25, 670, 20);
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
