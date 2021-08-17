import "./Favorites.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardComics from "../../components/CardComics/CardComics";
import CardHeroes from "../../components/CardHeroes/CardHeroes";
import axios from "axios";
import Cookies from "js-cookie";

const Favorites = ({ validationHero }) => {
  const { id } = useParams();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState();
  const [validationFavoritesHero, setValidationFavoritesHero] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:5000/favorites/${id}`,
        { headers: { authorization: `Bearer ${Cookies.get("tokenMarvel")}` } }
      );
      setFavorites(response.data.favorites);
      setData(response.data.favorites);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  /* Add in favorites */
  const handleFavorites = async (index) => {
    try {
      const characters = data.characters[index];
      const res = await axios.put(
        `http://localhost:5000/user/update/${
          Cookies.get("infoUser").split(",")[0]
        }`,
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavoritesComics = async (index) => {
    try {
      const comics = data.comics[index];
      const res = await axios.put(
        `http://localhost:5000/user/update/${
          Cookies.get("infoUser").split(",")[0]
        }`,
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
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <div className="loading">
      <div>Chargement en cours...</div>
    </div>
  ) : (
    <div className="favorites">
      <h1>Mes Favoris</h1>
      <div className="content">
        <h3>Les Héros</h3>
        <div className="favoritesHero">
          {data.characters.length === 0 ? (
            <div className="emptyFavorites">
              Tu n'as pas encore de héros en favoris
            </div>
          ) : (
            data.characters.map((elem, index) => {
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
                    validationFavoritesHero={validationFavoritesHero}
                    validationHero={validationHero}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="content">
        <h3>les Comics</h3>
        <div className="favoritesComics">
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
                  validationFavoritesHero={validationFavoritesHero}
                  validationHero={validationHero}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
