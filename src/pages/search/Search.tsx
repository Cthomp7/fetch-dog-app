/**
 * Search Page Component
 *
 * This page provides a searchable interface for browsing and managing dog listings.
 * Key features include:
 * - Dynamic search functionality for dog breeds using a SearchBar component
 * - Pagination support for browsing large sets of dog data
 * - Dog card display with favoriting functionality
 * - Ability to view favorite dogs
 * - Automatic fetching of dog breeds for search suggestions
 *
 * The component manages state for:
 * - Current dog listings
 * - Available dog breeds
 * - Favorited dogs
 * - Pagination state
 * - Search queries
 */

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
}

const Search = () => {
  const [dogs, setDogs] = useState<Dog[] | null>(null);
  const [dogBreeds, setDogBreeds] = useState<string[] | null>(null);
  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);

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

  // Function for fetching dog ids & data
  const fetchDogs = async ({
    key = "breed",
    value,
    from = 1,
  }: FetchDogsProps) => {
    try {
      let searchData;
      let searchParameters = "";

      if (key === "favorites") {
        if (favoriteDogs.length > 0) {
          searchData = favoriteDogs;
          setKeycount(favoriteDogs.length);
        } else {
          setDogs(null);
        }
      } else if (key === "breed") {
        const searchValue = value || searchQuery.value;
        if (searchValue) {
          searchParameters = `&breeds=${encodeURIComponent(searchValue)}`;
          setSearchQuery({ key, value: searchValue });
        }
        const response = await fetch(
          `https://frontend-take-home-service.fetch.com/dogs/search?size=${itemsPerPage}&sort=breed:asc${searchParameters}&from=${from}`,
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
    } else {
      setFavoriteDogs((prev) => prev.filter((dogId) => dogId !== id));
      setDogs((prev) => (prev ? prev.filter((dog) => dog.id !== id) : null));
    }
  };

  // Fetch new dogs when page number is changed
  const handlePageChange = (newPage: number) => {
    const from = itemsPerPage * (newPage - 1);
    fetchDogs({ from });
    setCurrentPage(newPage);
  };

  return (
    <div>
      <SearchBar
        data={dogBreeds}
        searchKeys={dogBreeds}
        onSearchSelection={handleSearchSelection}
      />

      <Pagination
        keycount={keycount}
        page={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
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
