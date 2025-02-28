import React, { useEffect, useState } from "react";
import DogCard from "../../components/DogCard/DogCard.tsx";
import SearchBar from "../../components/SearchBar/SearchBar.tsx";
import { Dog } from "../../types/types";
import styles from "./Search.module.css";
import Pagination from "../../components/Pagination/Pagination.tsx";

interface SearchQuery {
  key: string | null;
  value: string | null;
}

interface FetchDogsProps {
  key?: string | null;
  value?: string | null;
  from?: number;
  page?: number;
  order?: string;
}

const Search = () => {
  const [dogs, setDogs] = useState<Dog[] | null>(null);
  const [dogBreeds, setDogBreeds] = useState<string[] | null>(null);
  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);

  const [mode, setMode] = useState<string>("breed");
  const [pastOrder, setPastOrder] = useState<string>("asc");
  const [keycount, setKeycount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    key: null,
    value: null,
  });

  // Fetch dog breeds for fuse.js search bar
  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await fetch(
          "https://frontend-take-home-service.fetch.com/dogs/breeds",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const dogBreeds = await response.json();
        setDogBreeds(dogBreeds);
      } catch (error) {
        // redirect to sign-in page on fail
        window.location.href = `${window.location.origin}/fetch-dog-app`;
      }
    };
    fetchDogBreeds();
  }, []);

  // Function for fetching dog ids & data
  const fetchDogs = async ({
    key = "breed",
    value,
    from = 0,
    page,
    order,
  }: FetchDogsProps) => {
    try {
      order = order || pastOrder;
      let searchData;
      let searchParameters = "";

      if (key === "match") {
        searchData = [value];
        setKeycount(1);
      } else if (key === "favorites") {
        if (favoriteDogs.length > 0) {
          const start = ((page || currentPage) - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          searchData = favoriteDogs.slice(start, end);
          setKeycount(favoriteDogs.length);
        } else {
          setDogs(null);
          setKeycount(0);
        }
      } else if (key === "breed") {
        const searchValue = value || searchQuery.value;
        if (searchValue) {
          searchParameters = `&breeds=${encodeURIComponent(searchValue)}`;
          setSearchQuery({ key, value: searchValue });
        }
        const response = await fetch(
          `https://frontend-take-home-service.fetch.com/dogs/search?size=${itemsPerPage}&sort=breed:${order}${searchParameters}&from=${from}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const results = await response.json();
        const { resultIds, total } = results;
        searchData = resultIds;
        setKeycount(total);
      }

      setMode(key || "breed");

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
  };

  // Fetch initial batch of dogs (ascending by breed)
  useEffect(() => {
    fetchDogs({});
  }, []);

  // Handle when a search selection is made
  const handleSearchSelection = (key?: string, value?: string) => {
    fetchDogs({ key, value });
  };

  // Handle favoriting dog card
  const handleOnFavorite = (id: string, remove: boolean) => {
    if (!remove) {
      setFavoriteDogs((prev) => {
        if (prev.includes(id)) {
          return prev;
        }
        return [...prev, id];
      });
    } else if (mode === "favorites") {
      setFavoriteDogs((prev) => prev.filter((dogId) => dogId !== id));
      setDogs((prev) => (prev ? prev.filter((dog) => dog.id !== id) : null));
    }
  };

  const calculateFrom = (newPage?: number) => {
    newPage = newPage || currentPage;
    return itemsPerPage * (newPage - 1);
  };

  // Fetch new dogs when page number is changed
  const handlePageChange = (newPage: number) => {
    const from = calculateFrom(newPage);
    fetchDogs({ key: mode, from, page: newPage });
    setCurrentPage(newPage);
  };

  // Handle order (asc/desc) change
  const handleOrderChange = (order: string) => {
    const from = calculateFrom();
    setPastOrder(order);
    fetchDogs({ from, order });
  };

  // fetch user's match based on favorited dogs ids
  const findYourMatch = async () => {
    if (!favoriteDogs || favoriteDogs.length > 0) {
      const postResponse = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(favoriteDogs),
          credentials: "include",
        }
      );

      const dog = await postResponse.json();
      fetchDogs({ key: "match", value: dog.match });
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <span className={styles.pinkText}>Fetch</span> Your New Best Friend! 🐶
      </div>
      <SearchBar
        data={dogBreeds}
        searchKeys={dogBreeds}
        onSearchSelection={handleSearchSelection}
        onOrderChange={handleOrderChange}
        onMatch={findYourMatch}
        favorites={favoriteDogs.length}
        mode={mode}
      />
      {mode !== "match" && dogs && dogs.length > 1 && (
        <Pagination
          keycount={keycount}
          page={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
      {mode === "match" && dogs && (
        <p className={styles.title}>
          Your Match is <span className={styles.pinkText}>{dogs[0].name}!</span>
        </p>
      )}
      {mode === "favorites" && !dogs && (
        <p className={styles.title}>☝️ You haven't favorited any dogs yet!</p>
      )}
      <div className={styles.dogGalleryContainer}>
        <div
          className={`${styles.dogGallery} ${
            mode === "match" ? styles.matchMode : ""
          }`}
        >
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
      {dogs && dogs.length > 20 && (
        <Pagination
          keycount={keycount}
          page={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Search;
