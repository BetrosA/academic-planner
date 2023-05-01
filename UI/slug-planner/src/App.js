// App.js

import React, { useState } from "react";
import SchoolLogo from "./assets/Slug_Planners_Logo_Transparent.png";
import "./App.css";

function App() {
  const [showMajor, setShowMajor] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showStartingYear, setShowStartingYear] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedStartingYear, setSelectedStartingYear] = useState(null);

  const toggleMajor = () => {
    setShowMajor(!showMajor);
  };

  const toggleDepartment = () => {
    setShowDepartment(!showDepartment);
  };

  const toggleStartingYear = () => {
    setShowStartingYear(!showStartingYear);
  };

  const handleMajorClick = (major) => {
    setSelectedMajor(major);
    setShowMajor(false);
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setShowDepartment(false);
  };

  const handleStartingYearClick = (year) => {
    setSelectedStartingYear(year);
    setShowStartingYear(false);
  };

  const isGenerateButtonEnabled = () => {
    return selectedMajor && selectedDepartment && selectedStartingYear;
  };

  return (
    <div>
      <header className="header">
        <img src={SchoolLogo} alt="School Logo" className="logo" />
        <h2>Slug - Planner</h2>
      </header>
      <nav className="nav">
        <ul className="nav-list">
          <li>
            <a href="/">Home</a>
          </li>
          <li
            className="dropdown"
            onMouseEnter={toggleDepartment}
            onMouseLeave={toggleDepartment}
          >
            <a href="/" className="dropbtn">
              Department
            </a>
            {showDepartment && (
              <div className="dropdown-content">
                <a
                  href="/"
                  onClick={() => handleDepartmentClick("Department 1")}
                >
                  Department-1
                </a>
                <a
                  href="/"
                  onClick={() => handleDepartmentClick("Department 2")}
                >
                  Department-2
                </a>
                <a
                  href="/"
                  onClick={() => handleDepartmentClick("Department 3")}
                >
                  Department-3
                </a>
              </div>
            )}
          </li>
          <li
            className="dropdown"
            onMouseEnter={toggleMajor}
            onMouseLeave={toggleMajor}
          >
            <a href="/" className="dropbtn">
              Major
            </a>
            {showMajor && (
              <div className="dropdown-content">
                <a href="/" onClick={() => handleMajorClick("Major 1")}>
                  Major-1
                </a>
                <a href="/" onClick={() => handleMajorClick("Major 2")}>
                  Major-2
                </a>
                <a href="/" onClick={() => handleMajorClick("Major 3")}>
                  Major-3
                </a>
              </div>
            )}
          </li>
          <li
            className="dropdown"
            onMouseEnter={toggleStartingYear}
            onMouseLeave={toggleStartingYear}
          >
            <a href="/" className="dropbtn">
              Starting Year
            </a>
            {showStartingYear && (
              <div className="dropdown-content">
                <a href="/" onClick={() => handleStartingYearClick("2022")}>
                  2022
                </a>
                <a href="/" onClick={() => handleStartingYearClick("2023")}>
                  2023
                </a>
                <a href="/" onClick={() => handleStartingYearClick("2024")}>
                  2024
                </a>
              </div>
            )}
          </li>
          <li>
            <a href="/">About</a>
          </li>
        </ul>
        <div>
          <button
            className="generate-btn"
            disabled={!isGenerateButtonEnabled()}
          >
            Generate
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
