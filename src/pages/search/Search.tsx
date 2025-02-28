import React, { useEffect, useState } from "react";
import DogCard from "../../components/DogCard/DogCard.tsx";
import SearchBar from "../../components/SearchBar/SearchBar.tsx";
import { Dog } from "../../types/types";
import styles from "./Search.module.css";

interface SearchQuery {
  key: string | null;
  value: string | null;
}

const Search = () => {
  const [dogs, setDogs] = useState<Dog[] | null>(null);
  const [dogBreeds, setDogBreeds] = useState<string[] | null>(null);
  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    key: null,
    value: null,
  });

  // Fetch dog breeds for fuse.js search bar
  useEffect(() => {
    const fetchDogBreeds = async () => {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs/breeds",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const dogBreeds = await response.json();
      setDogBreeds(dogBreeds);
    };
    fetchDogBreeds();
  }, []);

  const fetchDogs = (async (key?: string, value?: string) => {
    try {
      let searchData;
      let searchParameters = "";

      if (key === "favorites") {
        if (favoriteDogs.length > 0) {
          searchData = favoriteDogs;
        } else {
          setDogs(null);
        }
      } else if (key === "breed") {
        if (value && searchQuery.value) {
          value = value || searchQuery.value;
          searchParameters = `&breeds=${encodeURIComponent(value)}`;
          setSearchQuery({ key, value });
        }
        const response = await fetch(
          `https://frontend-take-home-service.fetch.com/dogs/search?size=50&sort=breed:asc${searchParameters}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const results = await response.json();
        searchData = results.resultIds;
      }

      if (searchData && searchData.length > 0) {
        const postResponse = await fetch(
          "https://frontend-take-home-service.fetch.com/dogs",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchData),
            credentials: "include",
          }
        );

        const postData = await postResponse.json();
        setDogs(postData);
      }
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  })

  useEffect(() => {
    fetchDogs("breed");
  }, []);

  const handleSearchSelection = (key?: string, value?: string) => {
    fetchDogs(key, value);
  };

  const handleOnFavorite = (id: string, remove: boolean) => {
    if (!remove) {
      setFavoriteDogs((prev) => {
        if (prev.includes(id)) {
          return prev;
        }
        return [...prev, id];
      });
    } else {
      setFavoriteDogs((prev) => prev.filter((dogId) => dogId !== id));
      setDogs((prev) => (prev ? prev.filter((dog) => dog.id !== id) : null));
    }
  };

  return (
    <div>
      <SearchBar
        data={dogBreeds}
        searchKeys={dogBreeds}
        onSearchSelection={handleSearchSelection}
      />
      <div className={styles.dogGalleryContainer}>
        <div className={styles.dogGallery}>
          {dogs?.map((dog) => {
            return (
              <DogCard
                key={dog.id}
                dog={dog}
                favorite={favoriteDogs.includes(dog.id)}
                onFavorite={handleOnFavorite}
              ></DogCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Search;
