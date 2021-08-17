import "./Favorites.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardComics from "../../components/CardComics/CardComics";
import CardHeroes from "../../components/CardHeroes/CardHeroes";
import axios from "axios";
import Cookies from "js-cookie";

const Favorites = (props) => {
  const {
    setValidationFavoritesHero,
    validationFavoritesHero,
    validationHero,
  } = props;

  const { id } = useParams();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:5000/favorites/${id}`,
        { headers: { authorization: `Bearer ${Cookies.get("tokenMarvel")}` } }
      );
      setData(response.data.favorites);
      setIsLoading(false);
    };
    fetchData();
  }, [setData, id]);
  /* Add in favorites */
  const handleFavorites = async (index) => {
    try {
      const comics = data[index];
      const res = await axios.put(
        `http://localhost:5000/user/update/${
          Cookies.get("infoUser").split(",")[0]
        }`,
        { comics: comics },
        { headers: { authorization: `Bearer ${Cookies.get("tokenMarvel")}` } }
      );
      if (res.status === 200) {
        setValidationFavoritesHero(index);
        setTimeout(() => {
          setValidationFavoritesHero(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(data);
  return isLoading ? (
    <div>
      <div>Chargement en cours...</div>
    </div>
  ) : (
    <div className="favorites">
      <h1>Mes Favoris</h1>
      <div className="content">
        <h2>Les Héros</h2>
        <div>
          {data.characters.map((elem, index) => {
            return (
              <div key={elem._id}>
                <CardHeroes
                  _id={elem}
                  name={elem.name}
                  path={elem.thumbnail.path}
                  extension={elem.thumbnail.extension}
                  description={elem.description}
                  index={index}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h2>les Comics</h2>
        <div>
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
                  handleFavorites={handleFavorites}
                />
                {validationFavoritesHero === index ? (
                  <p className="validated">{validationHero}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
