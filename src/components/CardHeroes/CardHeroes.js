import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./CardHeroes.scss";

const CaedHeroes = (props) => {
  const {
    name,
    _id,
    path,
    extension,
    description,
    index,
    handleFavorites,
    validationFavoritesHero,
    validationHero,
    favorites,
  } = props;

  let checkCard = false;
  if (favorites) {
    favorites.characters.forEach((elem) => {
      if (_id === elem._id) {
        checkCard = true;
      }
      return checkCard;
    });
  }
  return (
    <div>
      <div className="cardHeroes">
        <div className="headCard">
          <h2>{name} </h2>
        </div>
        <Link to={`/comics/${_id}`} className="character">
          <img src={path + "." + extension} alt={name} />
          <p>{description}</p>
        </Link>
        <div className="cardBottom">
          <label htmlFor="iconFav" onClick={() => handleFavorites(index)}>
            {checkCard
              ? "clic pour supprimer des favoris"
              : "Clic pour ajouter aux favoris"}
            <FontAwesomeIcon
              id="iconFav"
              className={checkCard ? "iconFav" : "iconFav iconWhite"}
              onClick={() => handleFavorites(index)}
              icon="star"
            />
          </label>
        </div>
      </div>
      {validationFavoritesHero === index ? (
        <p className="validated">{validationHero}</p>
      ) : null}
    </div>
  );
};

export default CaedHeroes;
