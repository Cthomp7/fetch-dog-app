import React from "react";
import styles from "./DogCard.module.css";

interface DogCardProps {
  name?: string;
  breed?: string;
  age?: string;
}

const DogCard: React.FC<DogCardProps> = ({
  name = "Max",
  breed = "Golden Retriever",
  age = "2 years",
}) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <img
          className={styles.image}
          src="https://images.unsplash.com/photo-1507146426996-ef05306b995a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHVwcHklMjBkb2d8ZW58MHx8MHx8fDA%3D"
          alt="dog"
        />
        <div className={styles.overlay}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.info}>Breed: {breed}</p>
          <p className={styles.info}>Age: {age}</p>
        </div>
      </div>
    </div>
  );
};

export default DogCard;
