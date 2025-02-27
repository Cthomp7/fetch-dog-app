import React, { useState, useEffect } from "react";
import Fuse from 'fuse.js';

interface SearchBarProps<T> {
  data: T[];
  searchKeys: string[];
  onSearchResult?: (results: T[]) => void;
  fuseOptions?: Fuse.IFuseOptions<T>;
}

const SearchBar = <T,>({ 
  data, 
  searchKeys, 
  onSearchResult, 
  fuseOptions 
}: SearchBarProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fuseInstance, setFuseInstance] = useState<Fuse<T>>();

  useEffect(() => {
    // Initialize Fuse instance with default options
    const defaultOptions = {
      keys: searchKeys,
      threshold: 0.3,
      ...fuseOptions
    };
    setFuseInstance(new Fuse(data, defaultOptions));
  }, [data, searchKeys, fuseOptions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (fuseInstance && query) {
      const results = fuseInstance.search(query).map(result => result.item);
      onSearchResult?.(results);
    } else {
      onSearchResult?.(data);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: "10px",
      margin: '20px auto',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <img
          src="/svg/search.svg"
          alt="Search"
          style={{
            width: '20px',
            height: '20px',
          }}
        />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search..."
        style={{
          padding: '10px 15px',
          fontSize: '16px',
          border: '2px solid #ddd',
          borderRadius: '25px',
          width: '300px',
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
      />
    </div>
  );
};

export default SearchBar;