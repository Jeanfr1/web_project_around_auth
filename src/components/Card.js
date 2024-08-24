import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ cardData, onCardClick, onCardDelete, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);
  const { link, name, owner, likes } = cardData;

  const isOwn = owner._id === currentUser._id;
  const isLiked = likes.some((like) => like._id === currentUser._id);

  const cardDeleteButtonClassName = `elements__button-trash ${
    isOwn ? "elements__button-trash_hidden" : ""
  }`;

  const cardLikeButtonClassName = `elements__like-button ${
    isLiked ? "active" : ""
  }`;

  return (
    <div className="elements__card">
      {isOwn && (
        <button
          type="button"
          className={cardDeleteButtonClassName}
          onClick={() => onCardDelete(cardData)}
        ></button>
      )}
      <img
        className="elements__image"
        src={link}
        alt={name}
        onClick={() => onCardClick(cardData)}
      />
      <div className="elements__group">
        <h2 className="elements__title">{name}</h2>
        <button
          className={cardLikeButtonClassName}
          type="button"
          onClick={() => onCardLike(cardData)}
        ></button>
      </div>
      <span className="elements__like-count">{likes.length}</span>
    </div>
  );
}

export default Card;
