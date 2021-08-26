import "./Character.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardComics from "../../components/CardComics/CardComics";
import CardHeroes from "../../components/CardHeroes/CardHeroes";
import Cookies from "js-cookie";
import axios from "axios";

const Character = (props) => {
  const { validationHero, token, openModalLogin } = props;
  const { characterid } = useParams();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [validationFavoritesHero, setValidationFavoritesHero] = useState(false);
  const [favorites, setFavorites] = useState();

  const fetchDataFavorite = async () => {
    const res = await axios.get(
      `https://marvel-backend-chris.herokuapp.com/favorites/${
        Cookies.get("infoUser").split(",")[0]
      }`,
      // `http://localhost:5000/favorites/${
      //   Cookies.get("infoUser").split(",")[0]
      // }`,
      {
        headers: {
          authorization: `Bearer ${Cookies.get("tokenMarvel")}`,
        },
      }
    );
    setFavorites(res.data.favorites);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://marvel-backend-chris.herokuapp.com/comics/${characterid}`
        // `http://localhost:5000/comics/${characterid}`
      );
      if (token) {
        fetchDataFavorite();
      }
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, [characterid, token]);

  /* Add hero to favorites */
  const handleFavoritesHero = async () => {
    const hero = data;
    try {
      if (token) {
        const res = await axios.put(
          `https://marvel-backend-chris.herokuapp.com/user/update/${
            Cookies.get("infoUser").split(",")[0]
          }`,
          // `http://localhost:5000/user/update/${
          //   Cookies.get("infoUser").split(",")[0]
          // }`,
          { characters: hero },
          { headers: { authorization: `Bearer ${Cookies.get("tokenMarvel")}` } }
        );
        if (res.status === 200) {
          setFavorites(res.data.favorites);
          setValidationFavoritesHero(true);
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

  /* Add comic to favorites */
  const handleFavoritesComics = async (index) => {
    try {
      if (token) {
        const comics = data.comics[index];
        const res = await axios.put(
          `https://marvel-backend-chris.herokuapp.com/user/update/${
            Cookies.get("infoUser").split(",")[0]
          }`,
          // `http://localhost:5000/user/update/${
          //   Cookies.get("infoUser").split(",")[0]
          // }`,
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
  console.log(favorites);
  return isLoading ? (
    <div className="loading">
      <div>Chargement en cours...</div>
    </div>
  ) : (
    <div className="content hero">
      <h1>Hero : {data.name}</h1>
      <div className="heroComics">
        <CardHeroes
          key={data._id}
          name={data.name}
          path={data.thumbnail.path}
          extension={data.thumbnail.extension}
          description={data.description}
          _id={data._id}
          handleFavorites={handleFavoritesHero}
          validationHero={validationHero}
          validationFavoritesHero={validationFavoritesHero}
          favorites={favorites}
        />
      </div>
      <h3>Tous les comics dans lesquels {data.name} apparait !!</h3>
      <div className="containerCard">
        {data.comics.map((elem, index) => {
          return (
            <CardComics
              key={elem._id}
              _id={elem.id}
              name={elem.title}
              path={elem.thumbnail.path}
              extension={elem.thumbnail.extension}
              description={elem.description}
              index={index}
              handleFavorites={handleFavoritesComics}
              validationHero={validationHero}
              validationFavoritesHero={validationFavoritesHero}
              favorites={favorites}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Character;
