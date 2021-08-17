import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CardComics.scss";

const CardComics = (props) => {
  const {
    name,
    path,
    extension,
    description,
    index,
    handleFavorites,
    validationFavoritesHero,
    validationHero,
  } = props;

  return (
    <div>
      <div className="cardComics">
        <div className="headCard">
          <h2>{name} </h2>
        </div>
        <div className="col-1">
          <img src={path + "." + extension} alt={name} />
          <p>{description}</p>
        </div>
        <div className="cardBottom">
          <label htmlFor="iconFav" onClick={() => handleFavorites(index)}>
            Clic pour ajouter au favoris
            <FontAwesomeIcon
              id="iconFav"
              className="iconFav"
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

export default CardComics;
