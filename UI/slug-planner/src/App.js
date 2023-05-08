// App.js

import React, { useState } from "react";
import SchoolLogo from "./assets/ucsc-slug-logo.png";
import "./App.css";

let departments = {
  "Arts": ["Art Studio BA"],
  "Computer Science and Engineering": ["Computer Engineering B.S.", "Computer Science: B.A.", "Computer Science: B.S."],
  "Electrical and Computer Engineering": ["Electrical Engineering: B.S.", "Robotics Engineering: B.S."]}

  
  
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
    setSelectedStartingYear(null);
    setShowMajor(false);
  };

  const handleDepartmentClick = (name) => {
    setSelectedDepartment(name);
    setSelectedMajor(null); // reset selectedMajor when department changes
    setSelectedStartingYear(null); // reset selectedStartingYear when department changes
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
            <a className="dropbtn">{selectedDepartment ? selectedDepartment : "Departments"}</a>
            {showDepartment && (
              <div className="dropdown-content" style={{ width: "150px" }}>
                {Object.keys(departments).map((name) => (
                  <button
                    key={name}
                    className="dropdown-button"
                    onClick={() => handleDepartmentClick(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </li>
          {selectedDepartment && (
            <li
              className="dropdown"
              onMouseEnter={toggleMajor}
              onMouseLeave={toggleMajor}
            >
              <a className="dropbtn" style={{ width: "150px" }}> {selectedMajor ? selectedMajor : "Major"} </a>
              {showMajor && (
                <div className="dropdown-content fixed-width" >
                  {departments[selectedDepartment].map((name) => (
                    <button
                      key={name}
                      className="dropdown-button"
                      onClick={() => handleMajorClick(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </li>
          )}
          {selectedMajor && (
            <li
              className="dropdown"
              onMouseEnter={toggleStartingYear}
              onMouseLeave={toggleStartingYear}
            >
              <a className="dropbtn" style={{ width: "150px" }}>{selectedStartingYear ? selectedStartingYear : "Starting Year"}</a>
              {showStartingYear && (
                <div className="dropdown-content fixed-width" >
                  <button
                    className="dropdown-button"
                    onClick={() => handleStartingYearClick("2022")}
                  >
                    2022
                  </button>
                  <button
                    className="dropdown-button"
                    onClick={() => handleStartingYearClick("2023")}
                  >
                    2023
                  </button>
                  <button
                    className="dropdown-button"
                    onClick={() => handleStartingYearClick("2024")}
                  >
                    2024
                  </button>
                </div>
              )}
            </li>
          )}

        </ul>
        <div>
          <button className="generate-btn" disabled={!isGenerateButtonEnabled()}>
            Generate
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;