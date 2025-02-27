import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.tsx";
// import Search from "./pages/Search/Search.tsx";
import './global.css';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/search" element={<Search />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
