import React, { useState } from "react";
import styles from "./DogCard.module.css";
import { Dog } from "../../types/types";

interface DogCardProps {
  dog: Dog;
  favorite: boolean;
  onFavorite: (id: string, remove: boolean) => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, favorite, onFavorite }) => {
  const { id, name, breed, age, img, zip_code } = dog;
  const [favorited, setFavorited] = useState(favorite);

  // Handle if a dog card is favorited
  const favoriteDog = () => {
    const favorite = !favorited;
    setFavorited(favorite);
    onFavorite(id, !favorite);
  };

  // Generate age text based on age field
  const getAgeText = (age: number) => {
    if (age === 0) return "> 1 year";
    return `${age} ${age === 1 ? "year" : "years"}`;
  };

  return (
    <button
      className={styles.cardContainer}
      onClick={favoriteDog}
      aria-label={`${favorite ? "Remove" : "Add"} ${name} to favorites`}
    >
      <div className={styles.card}>
        <img className={styles.image} src={img} alt="dog" />
        <div className={styles.overlay}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.info}>{breed}</p>
          <div className={styles.subInfoContainer}>
            <p className={styles.info}>{getAgeText(age)} old</p>
            <div className={styles.zipContainer}>
              <img
                src="/fetch-dog-app/svg/map-pin.svg"
                alt="map pin"
                className={styles.mapPin}
              />
              <p className={styles.zip}>{zip_code}</p>
            </div>
          </div>
        </div>
        {favorited ? (
          <img
            src="/fetch-dog-app/svg/heart-filled.svg"
            alt="heart"
            className={styles.heart}
            style={{ opacity: 1 }}
          />
        ) : (
          <img src="/fetch-dog-app/svg/heart.svg" alt="heart" className={styles.heart} />
        )}
      </div>
    </button>
  );
};

export default DogCard;
