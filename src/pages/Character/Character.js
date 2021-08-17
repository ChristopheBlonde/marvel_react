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

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:5000/comics/${characterid}`
      );
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, [characterid]);

  /* Add hero to favorites */
  const handleFavoritesHero = async () => {
    const hero = data;
    try {
      if (token) {
        const res = await axios.put(
          `http://localhost:5000/user/update/${
            Cookies.get("infoUser").split(",")[0]
          }`,
          { characters: hero },
          { headers: { authorization: `Bearer ${Cookies.get("tokenMarvel")}` } }
        );
        if (res.status === 200) {
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
      } else {
        openModalLogin();
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
    <div className="content hero">
      <h1>Hero : {data.name}</h1>
      <div className="heroComics">
        <CardHeroes
          name={data.name}
          path={data.thumbnail.path}
          extension={data.thumbnail.extension}
          description={data.description}
          _id={data._id}
          handleFavorites={handleFavoritesHero}
        />
        {validationFavoritesHero ? (
          <p className="validated">{validationHero}</p>
        ) : null}
      </div>
      <h2>Tous les comics dans lesquels {data.name} apparait !!</h2>
      <div className="containerCard">
        {data.comics.map((elem, index) => {
          return (
            <div key={elem._id}>
              <CardComics
                _id={elem.id}
                name={elem.title}
                path={elem.thumbnail.path}
                extension={elem.thumbnail.extension}
                description={elem.description}
                index={index}
                handleFavorites={handleFavoritesComics}
              />
              {validationFavoritesHero === index ? (
                <p className="validated">{validationHero}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Character;
