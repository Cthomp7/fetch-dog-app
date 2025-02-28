import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.tsx";
import Search from "./pages/search/Search.tsx";
import "./global.css";

const App = () => {
  return (
    <Router basename="/fetch-dog-app/">
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
