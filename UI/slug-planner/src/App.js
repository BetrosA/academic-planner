// App.js

import React, { useState } from "react";
import SchoolLogo from "./assets/ucsc-slug-logo.png";
import "./App.css";

let departments = {
  "Arts": ["Art Studio BA"],
  "Computer Science and Engineering": ["Electrical Engineering: B.S.", "Robotics Engineering: B.S."],
  "Electrical and Computer Engineering": ["Computer Engineering B.S.", "Computer Science: B.S.", "Computer Science: B.A."]}

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
            <a className="dropbtn">
              Departments
            </a>
            {showDepartment && (
              <div className="dropdown-content">
                {Object.keys(departments).map(function(name) {
                  return <button key={name} className="dropdown-button"
                      onClick={() => handleDepartmentClick(name)}
                      >
                      {name}
                  </button>
                })}
              </div>
            )}
          </li>
          <li
            className="dropdown"
            onMouseEnter={toggleMajor}
            onMouseLeave={toggleMajor}
          >
            <a className="dropbtn">
              Major
            </a>
            {showMajor && selectedDepartment && (
              <div className="dropdown-content">
                {departments[selectedDepartment].map(function(name) {
                  return <button key={name} className="dropdown-button"
                      onClick={() => handleMajorClick(name)}
                      >
                      {name}
                  </button>
                })}
              </div>
            )}
          </li>
          <li
            className="dropdown"
            onMouseEnter={toggleStartingYear}
            onMouseLeave={toggleStartingYear}
          >
            <a className="dropbtn">
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
