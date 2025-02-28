import React, { useEffect, useState } from "react";
import styles from "./Pagination.module.css";

interface Props {
  keycount: number;
  page: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ keycount, page, itemsPerPage, onPageChange }: Props) => {
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(page);
  const [showMiddle, setShowMiddle] = useState(false);
  const [hovered, setHovered] = useState<boolean>(false);
  const [middleStart, setMiddleStart] = useState(0); // Keeps track of the middle 5 items

  // Calculate pages state
  useEffect(() => {
    const totalPages = Math.ceil(keycount / itemsPerPage);
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    setPages(pageArray);
  }, [keycount, itemsPerPage]);

  // If page prop state has changed, update Pagination currentPage state
  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  // Handle a page option being selected
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  // Change page to next option (by 1)
  const handleNext = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  // Change page to previous option (by 1)
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  // Don't show middle options if at the start or end
  useEffect(() => {
    if (currentPage > 4 && currentPage < pages.length - 3) {
      setShowMiddle(true);
      setMiddleStart(currentPage - 2);
    } else {
      setShowMiddle(false);
    }
  }, [currentPage, pages]);

  // Handling the next 5 middle page options
  const handleMiddleNext = () => {
    const totalPages = pages.length;
    const newMiddleStart = middleStart + 5;

    if (newMiddleStart + 4 >= totalPages) {
      // Reset to default if middle exceeds the last page
      setShowMiddle(false);
      setMiddleStart(0);
    } else {
      setMiddleStart(newMiddleStart);
    }
  };

  // Handling the previous 5 middle page options
  const handleMiddlePrevious = () => {
    const newMiddleStart = middleStart - 5;

    if (newMiddleStart < 1) {
      // Reset to default if middle exceeds the first page
      setShowMiddle(false);
      setMiddleStart(0);
    } else {
      setMiddleStart(newMiddleStart);
    }
  };

  // Conditionally display middle page options
  const handleShowMiddle = () => {
    setShowMiddle(true);
    setMiddleStart(Math.floor(pages.length / 2) - 2); // Start the middle pages in the center
    setHovered(false);
  };

  // Rendering initial page options
  const renderInitialPages = (totalPages: number) => {
    return Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1).map(
      (i) => (
        <button
          key={i}
          className={`${styles.pageButton} ${
            currentPage === i ? styles.activePage : ""
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      )
    );
  };

  // Rendering last 4 page options
  const renderLastPages = (totalPages: number) => {
    return Array.from({ length: 4 }, (_, i) => Math.max(totalPages - 3, 5) + i)
      .filter((i) => i <= totalPages)
      .map((i) => (
        <button
          key={i}
          className={`${styles.pageButton} ${
            currentPage === i ? styles.activePage : ""
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      ));
  };

  // For rendering middle page options
  const renderMiddleSection = (totalPages: number) => {
    const elements = Array.from(
      { length: Math.min(5, totalPages - middleStart + 1) },
      (_, i) => middleStart + i
    ).map((i) => (
      <button
        key={i}
        className={`${styles.pageButton} ${
          currentPage === i ? styles.activePage : ""
        }`}
        onClick={() => handlePageClick(i)}
      >
        {i}
      </button>
    ));

    if (middleStart > 1) {
      elements.unshift(
        <button
          key="leftArrow"
          className={styles.dots}
          onClick={handleMiddlePrevious}
        >
          {"<<"}
        </button>,
        <button
          key={1}
          className={`${styles.pageButton} ${
            currentPage === 1 ? styles.activePage : ""
          }`}
          onClick={() => handlePageClick(1)}
        >
          1
        </button>
      );
    }

    if (middleStart + 4 < totalPages) {
      elements.push(
        <button
          key="rightArrow"
          className={styles.dots}
          onClick={handleMiddleNext}
        >
          {">>"}
        </button>,
        <button
          key={totalPages}
          className={`${styles.pageButton} ${
            currentPage === totalPages ? styles.activePage : ""
          }`}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return elements;
  };

  // Function for rendering page options in appropriate format
  const renderPages = () => {
    const totalPages = pages.length;

    if (showMiddle) {
      return renderMiddleSection(totalPages);
    }

    const pageElements = renderInitialPages(totalPages);

    if (totalPages > 8) {
      pageElements.push(
        <button
          key="dots"
          className={styles.dots}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleShowMiddle}
        >
          {hovered ? ">>" : "..."}
        </button>
      );
      pageElements.push(...renderLastPages(totalPages));
    } else {
      for (let i = 5; i <= totalPages; i++) {
        pageElements.push(
          <button
            key={i}
            className={`${styles.pageButton} ${
              currentPage === i ? styles.activePage : ""
            }`}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </button>
        );
      }
    }

    return pageElements;
  };

  return (
    <div className={styles.container}>
      {/* Previous Button */}
      <button
        className={styles.arrowButton}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* Page Buttons */}
      {renderPages()}

      {/* Next Button */}
      <button
        className={styles.arrowButton}
        onClick={handleNext}
        disabled={currentPage === pages.length}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
