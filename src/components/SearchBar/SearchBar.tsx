import React, { useState, useEffect, useRef } from "react";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import styles from "./SearchBar.module.css";

interface SearchBarProps<T> {
  data: T[] | null;
  searchKeys?: string[] | null;
  fuseOptions?: IFuseOptions<T>;
  onSearchSelection: (key?: string, value?: string) => void;
  favorites: number;
}

const SearchBar = <T,>({
  data,
  searchKeys,
  onSearchSelection,
  fuseOptions,
  favorites,
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
    if (favorites > Number(savedFavorites)) {
      setIsAnimating(true);
      setSavedFavorites(favorites);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [favorites, savedFavorites]);

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

  const handleOnFavoriteClick = () => {
    setFavoritesMode(!favoritesMode);
    if (!favoritesMode) {
      handleOptionClick("favorites");
    } else {
      handleOptionClick();
    }
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
        {searchResult && showResults && (
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
        onClick={handleOnFavoriteClick}
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
    </div>
  );
};

export default SearchBar;
