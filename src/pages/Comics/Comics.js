import "./Comics.scss";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardComics from "../../components/CardComics/CardComics";
import Cookies from "js-cookie";
import axios from "axios";
import * as qs from "qs";
import Paging from "../../components/Paging/Paging";

const Comics = (props) => {
  const {
    count,
    setCount,
    limitCard,
    setLimitCard,
    validationHero,
    token,
    openModalLogin,
  } = props;

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchComics, setSearchComics] = useState("");
  const [validationFavoritesHero, setValidationFavoritesHero] = useState(false);
  const [favorites, setFavorites] = useState();
  /* paging */

  const location = useLocation();
  let currentPage = qs.parse(location.search.substring(1)).page;

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://marvel-backend-chris.herokuapp.com/comics?title=${searchComics}&limit=${limitCard}&page=${currentPage}`
        // `http://localhost:5000/comics?title=${searchComics}&limit=${limitCard}&page=${currentPage}`
      );
      if (token) {
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
        fetchDataFavorite();
      }

      setCount(response.data.count);
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, [searchComics, setCount, limitCard, currentPage, token]);

  const handleChangeComic = (event) => {
    setSearchComics(event.target.value);
  };
  /* Add favorites */
  const handleFavoritesComics = async (index) => {
    try {
      if (token) {
        const comics = data.results[index];
        const res = await axios.put(
          `https://marvel-backend-chris.herokuapp.com/user/update/${
            Cookies.get("infoUser").split(",")[0]
          }`,
          // `http://localhost:5000/user/update/${
          //   Cookies.get("infoUser").split(",")[0]
          // }`,
          { comics: await comics },
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
