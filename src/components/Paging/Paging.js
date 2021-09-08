import { useState, useEffect } from "react";
import "./Paging.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Paging = ({ onPage, itemCount, itemLimit, url, setLimitCard, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(1000);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    if (onPage) {
      setCurrentPage(onPage);
    }
    if (itemCount) {
      setCount(itemCount);
    }
    if (itemLimit) {
      setLimit(itemLimit);
    }
  }, [onPage, itemLimit, itemCount]);

  const handleChangeLimit = (event) => {
    setLimit(event.target.value);
    setLimitCard(event.target.value);
  };

  const pagesNumber = Math.ceil(count / limit);
  if (currentPage > pagesNumber) {
    setCurrentPage(1);
  }
  const arrPages = [];
  for (let i = 1; i <= pagesNumber; i++) {
    arrPages.push(<div className="num">{i}</div>);
  }

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
  return (
    <div className="paging">
      <div>
        <label htmlFor="numberHeros">Nombre de {title} par page</label>
        <select
          value={limit}
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
      <div className="numContainer">
        <FontAwesomeIcon
          id="arrowLeft"
          onClick={() => {
            const container = document.getElementById("pagingNum");
            sideScroll(container, "left", 25, 200, 10);
          }}
          className="iconPaging"
          icon="arrow-left"
        />
        <div id="pagingNum" className="pagingNum">
          {arrPages.map((elem, index) => (
            <Link key={index} to={`${url}?page=${index + 1}&limit=${limit}`}>
              {elem}
            </Link>
          ))}
        </div>
        <FontAwesomeIcon
          id="arrowRight"
          onClick={() => {
            const container = document.getElementById("pagingNum");
            sideScroll(container, "right", 25, 200, 10);
          }}
          className="iconPaging"
          icon="arrow-right"
        />
      </div>
    </div>
  );
};

export default Paging;
