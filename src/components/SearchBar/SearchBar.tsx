import React, { useState, useEffect, useRef } from "react";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import styles from "./SearchBar.module.css";

interface SearchBarProps<T> {
  data: T[] | null;
  searchKeys?: string[] | null;
  fuseOptions?: IFuseOptions<T>;
  onSearchSelection: (key?: string, value?: string) => void;
  onMatch: () => void;
  favorites: number;
  mode: string;
}

const SearchBar = <T,>({
  data,
  searchKeys,
  onSearchSelection,
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
        threshold: 0.3,
      };
      setFuseInstance(new Fuse(data, defaultOptions));
    }
  }, [data, searchKeys, fuseOptions]);

  useEffect(() => {
    if (favorites > savedFavorites) {
      setIsAnimating(true);
      setSavedFavorites(favorites);
    }
  }, [favorites, savedFavorites]);

  // Animation handling for Favorites button
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

  const handleFocus = () => {
    if (searchResult) {
      setShowResults(true);
    }
  };

  const handleOptionClick = (key?: string, value?: string) => {
    key = key || "breed";
    setSearchQuery("");
    setSearchResult(null);
    onSearchSelection(key, value);
  };

  const handleOnClickFavorite = () => {
    setFavoritesMode(!favoritesMode);
    if (!favoritesMode) {
      handleOptionClick("favorites");
    } else {
      handleOptionClick();
    }
  };

  const handleOnClickMatch = () => {
    onMatch();
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
      {mode === "favorites" && (
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
