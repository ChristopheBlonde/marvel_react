import "./Comics.scss";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardComics from "../../components/CardComics/CardComics";
import Cookies from "js-cookie";
import axios from "axios";
import * as qs from "qs";

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

  /* paging */

  const location = useLocation();
  let currentPage = qs.parse(location.search.substring(1)).page;
  const handleChangeLimit = (event) => {
    setLimitCard(event.target.value);
  };

  const pagesNumber = Math.ceil(count / limitCard);
  if (currentPage > pagesNumber) {
    currentPage = 1;
  }
  const arrPages = [];
  for (let i = 1; i <= pagesNumber; i++) {
    arrPages.push(
      <div className="num">
        <Link to={`/comics?page=${i}&limit=${limitCard}`}>{i}</Link>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:5000/comics?title=${searchComics}&limit=${limitCard}&page=${currentPage}`
      );
      setCount(response.data.count);
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, [searchComics, setCount, limitCard, currentPage]);

  const handleChangeComic = (event) => {
    setSearchComics(event.target.value);
  };
  /* Add favorites */
  const handleFavoritesComics = async (index) => {
    try {
      if (token) {
        const comics = data.results[index];
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
      <div className="paging">
        <div>
          <label htmlFor="numberHeros">Nombre de comics par page</label>
          <select
            value={limitCard}
            onChange={handleChangeLimit}
            name="numberHeroes"
            id="numberHeroes"
          >
            <option value="20">20</option>
            <option value="40">40</option>
            <option value="60">60</option>
            <option value="80">80</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="pagingNum">{arrPages}</div>
      </div>
      <div className="containerCard content">
        {data.results.map((elem, index) => {
          return (
            <CardComics
              key={elem._id}
              data={data.results}
              name={elem.title}
              path={elem.thumbnail.path}
              extension={elem.thumbnail.extension}
              description={elem.description}
              index={index}
              handleFavorites={handleFavoritesComics}
              validationFavoritesHero={validationFavoritesHero}
              validationHero={validationHero}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Comics;
