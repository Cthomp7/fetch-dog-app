import React, { useState, useEffect } from "react";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import styles from "./SearchBar.module.css";

interface SearchBarProps<T> {
  data: T[] | null;
  searchKeys?: string[] | null;
  onSearchResult?: (results: T[]) => void;
  fuseOptions?: IFuseOptions<T>;
  onSearchSelection: (key?: string, value?: string) => void;
}

const SearchBar = <T,>({
  data,
  searchKeys,
  onSearchResult,
  onSearchSelection,
  fuseOptions,
}: SearchBarProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<FuseResult<T>[] | null>(
    null
  );
  const [fuseInstance, setFuseInstance] = useState<Fuse<T>>();
  const [favoritesMode, setFavoritesMode] = useState<boolean>(false);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (fuseInstance && query) {
      const results = fuseInstance.search(query);
      if (results) setSearchResult(results);
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        margin: "20px auto",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="/fetch-dog-app/svg/search.svg"
          alt="Search"
          style={{
            width: "30px",
            height: "30px",
          }}
        />
      </div>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by breed..."
          className={styles.searchBar}
        />
        {searchResult && (
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
        }`}
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
