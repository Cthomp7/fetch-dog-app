import React, { useState, useEffect, useRef } from "react";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import styles from "./SearchBar.module.css";

interface SearchBarProps<T> {
  data: T[] | null;
  searchKeys?: string[] | null;
  fuseOptions?: IFuseOptions<T>;
  onSearchSelection: (key?: string, value?: string) => void;
  onOrderChange: (order: string) => void;
  onMatch: () => void;
  favorites: number;
  mode: string;
}

const SearchBar = <T,>({
  data,
  searchKeys,
  onSearchSelection,
  onOrderChange,
  onMatch,
  fuseOptions,
  favorites,
  mode,
}: SearchBarProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<FuseResult<T>[] | null>(
    null
  );
  const [showResults, setShowResults] = useState(false);
  const [fuseInstance, setFuseInstance] = useState<Fuse<T>>();
  const [order, setOrder] = useState("asc"); //desc
  const [savedFavorites, setSavedFavorites] = useState<number>(0);
  const [favoritesMode, setFavoritesMode] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMatchButtonAnimating, setIsMatchButtonAnimating] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Intialize Fuse
  useEffect(() => {
    if (data) {
      const defaultOptions = {
        includeScore: true,
      };
      setFuseInstance(new Fuse(data, defaultOptions));
    }
  }, [data, searchKeys, fuseOptions]);

  // Animation handling for Favorites button
  useEffect(() => {
    if (favorites > savedFavorites) {
      setIsAnimating(true);
      setSavedFavorites(favorites);
    }
  }, [favorites, savedFavorites]);

  // Animation timer
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Animation handling for Find your Match button
  useEffect(() => {
    if (mode === "favorites") {
      setIsMatchButtonAnimating(true);
      const timer = setTimeout(() => {
        setIsMatchButtonAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  // Close results when clicking outside of the search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate search results based on user input using fuse.js
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (fuseInstance && query) {
      const results = fuseInstance.search(query);
      if (results) {
        setSearchResult(results);
        setShowResults(true);
      }
    } else {
      setSearchResult(null);
    }
  };

  // Display search results if search bar is focused
  const handleFocus = () => {
    if (searchResult) {
      setShowResults(true);
    }
  };

  // Handle search bar option being selected
  const handleOptionClick = (key?: string, value?: string) => {
    key = key || "breed";
    setSearchQuery("");
    setSearchResult(null);
    onSearchSelection(key, value);

    if (favoritesMode) {
      setFavoritesMode(!favoritesMode);
    }
  };

  // Handle "Favorites" button onClick action
  const handleOnClickFavorite = () => {
    const active = !favoritesMode
    setFavoritesMode(active);
    if (active) {
      handleOptionClick("favorites");
    } else {
      handleOptionClick();
    }
  };

  // Handle sending onMatch message
  const handleOnClickMatch = () => {
    setFavoritesMode(false);
    onMatch();
  };

  // Handle changing sorting order from asc to desc
  const handleOnClickOrder = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    onOrderChange(newOrder);
  };

  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <img
          src="/fetch-dog-app/svg/search.svg"
          alt="Search"
          className={styles.searchIcon}
        />
      </div>
      <div className={styles.searchBarContainer} ref={searchContainerRef}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={handleFocus}
          placeholder="Search by breed..."
          className={styles.searchBar}
        />
        {searchResult && searchResult.length > 1 && showResults && (
          <div className={styles.searchResults}>
            {searchResult.map((result) => {
              return (
                <button
                  key={String(result.item)}
                  className={styles.searchResult}
                  onClick={() =>
                    handleOptionClick("breed", String(result.item))
                  }
                >
                  {String(result.item)}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {mode === "breed" && (
        <button className={styles.arrowBubble} onClick={handleOnClickOrder}>
          {order === "asc" ? (
            <img
              src="/fetch-dog-app/svg/a-arrow-up.svg"
              alt="arrow"
              className={styles.arrowIcon}
            />
          ) : (
            <img
              src="/fetch-dog-app/svg/a-arrow-down.svg"
              alt="arrow"
              className={styles.arrowIcon}
            />
          )}
        </button>
      )}
      <button
        className={`${styles.favoriteButton} ${
          favoritesMode ? styles.favoriteButtonActive : ""
        } ${isAnimating ? styles.bounce : ""}`}
        onClick={handleOnClickFavorite}
      >
        <img
          src={
            favoritesMode
              ? "/fetch-dog-app/svg/heart.svg"
              : "/fetch-dog-app/svg/heart-filled.svg"
          }
          alt="heart"
          className={styles.heart}
        />{" "}
        Favorites
      </button>
      {mode === "favorites" && favorites > 0 && (
        <div className={styles.matchContainer}>
          <button
            className={`${styles.matchButton} ${
              isMatchButtonAnimating ? styles.bounce : ""
            }`}
            onClick={handleOnClickMatch}
          >
            ♥️ Find your Match!
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
