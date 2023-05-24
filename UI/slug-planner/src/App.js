// App.js


import React, { useState, useEffect } from "react";
import SchoolLogo from "./assets/Wide_Logo.png";
import "./App.css";

import { fetchDepartments, fetchCourses } from "./firebase";

function NavBar({  selectedDepartment,  selectedMajor,  selectedStartingYear,  setSelectedDepartment,  setSelectedMajor,  setSelectedStartingYear,  setIsGenerated,  departments}) {
  const [showMajor, setShowMajor] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showStartingYear, setShowStartingYear] = useState(false);
  const [prevSelectedDepartment, setPrevSelectedDepartment] = useState(null);
  const [prevSelectedMajor, setPrevSelectedMajor] = useState(null);
  const [prevSelectedStartingYear, setPrevSelectedStartingYear] = useState(null);

  const [ChooseYears] = useState(["2020", "2021", "2022", "2023", "2024"]);

  const toggleMajor = () => {
    setShowMajor(!showMajor);
  };

  const toggleDepartment = () => {
    setShowDepartment(!showDepartment);
  };

  const toggleStartingYear = () => {
    setShowStartingYear(!showStartingYear);
  };

  const handleDepartmentClick = (name) => {
    setShowDepartment(false);
  
    // Check if department selection has changed
    if (prevSelectedDepartment !== name) {
      setSelectedDepartment(name);
      setSelectedMajor(null); // Reset major when department changes
      setSelectedStartingYear(null); // Reset starting year when department changes
      setIsGenerated(false); // Set isGenerated to false if department changes
      setPrevSelectedDepartment(name);
    }
  };
  
  const handleMajorClick = (major) => {
    setShowMajor(false);
  
    // Check if major selection has changed
    if (prevSelectedMajor !== major) {
      setSelectedMajor(major);
      setSelectedStartingYear(null); // Reset starting year when major changes
      setIsGenerated(false); // Set isGenerated to false if major changes
      setPrevSelectedMajor(major);
    }
  };
  
  const handleStartingYearClick = (year) => {
    setSelectedStartingYear(year);
    setShowStartingYear(false);
  
    // Check if starting year selection has changed
    if (prevSelectedStartingYear !== year) {
      setIsGenerated(false); // Set isGenerated to false if starting year changes
      setPrevSelectedStartingYear(year);
    }
  };
  
  const handleGenerateClick = () => {
    setIsGenerated(true);
  };

  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <a href="/">
            <button className="home-button">Home</button>
          </a>
        </li>

        {/* Dept. Dropdown */}
        <li
          className="dropdown"
          onMouseEnter={toggleDepartment}
          onMouseLeave={toggleDepartment}
        >
          <a className="dropbtn">
            {selectedDepartment ? selectedDepartment : "Departments"}
          </a>
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

        {/* Major Dropdown */}
        {selectedDepartment && (
          <li
            className="dropdown"
            onMouseEnter={toggleMajor}
            onMouseLeave={toggleMajor}
          >
            <a className="dropbtn">
              {selectedMajor ? selectedMajor : "Major"}
            </a>
            {showMajor && (
              <div className="dropdown-content">
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

        {/* Year Dropdown */}
        {selectedMajor && (
          <li
            className="dropdown"
            onMouseEnter={toggleStartingYear}
            onMouseLeave={toggleStartingYear}
          >
            <a className="dropbtn">
              {selectedStartingYear ? selectedStartingYear : "Starting Year"}
            </a>
            {showStartingYear && (
              <div className="dropdown-content">
                {ChooseYears.map((year) => (
                  <button
                    key={year}
                    className="dropdown-button"
                    onClick={() => handleStartingYearClick(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </li>
        )}

        {/* Generate Button */}
        {selectedDepartment && selectedMajor && selectedStartingYear && (
          <li>
            <button className="generate-btn" onClick={handleGenerateClick}>
              Generate Schedule
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

function Sidebar({ courses, handleDragStart }) {
  return (
    <div className="sidebar">
      <h2>Sidebar</h2>
      {courses.map((course, index) => (
        <div
          key={index}
          className="draggable-course"
          draggable="true"
          onDragStart={(event) => handleDragStart(event, course.id, course.coursename)}
        >
          {course.coursename}
        </div>
      ))}
    </div>
  );
}

function QuarterBox() {
  const [droppedCourses, setDroppedCourses] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    const courseId = event.dataTransfer.getData("courseId");
    const courseName = event.dataTransfer.getData("courseName");
    const course = { id: courseId, coursename: courseName };
    setDroppedCourses((prevCourses) => [...prevCourses, course]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="quarter-box" onDrop={handleDrop} onDragOver={handleDragOver}>
      <h2>Quarter Box</h2>
      {droppedCourses.map((course, index) => (
        <div key={index} className="dropped-course">
          {course.coursename}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedStartingYear, setSelectedStartingYear] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [droppedCourses, setDroppedCourses] = useState([]);

  const handleDragStart = (event, courseId, courseName) => {
    event.dataTransfer.setData("courseId", courseId);
    event.dataTransfer.setData("courseName", courseName);
  };

  useEffect(() => {
    fetchDepartments(setDepartments);
    fetchCourses(setCourses);
  }, []);

  return (
    <div className="app-container">
      {/* Logo*/}
      <header className="header">
        <a href="/">
          <img src={SchoolLogo} alt="School Logo" className="logo" />
        </a>
      </header>

      {/* Nav Bar */}
      <NavBar
      selectedDepartment={selectedDepartment}
      selectedMajor={selectedMajor}
      selectedStartingYear={selectedStartingYear}
      setSelectedDepartment={setSelectedDepartment}
      setSelectedMajor={setSelectedMajor}
      setSelectedStartingYear={setSelectedStartingYear}
      setIsGenerated={setIsGenerated}
      departments={departments}
      />
      
    {isGenerated && (
      <div className="content">
        <Sidebar courses={courses} handleDragStart={handleDragStart} />
        <div className="quarterbox-container">
            <div className="quarterbox-row">
              {[...Array(4)].map((_, colIndex) => (
                <QuarterBox
                  key={colIndex}
                  row={1}
                  column={colIndex + 1}
                />
              ))}
            </div>
            <div className="quarterbox-row">
              {[...Array(4)].map((_, colIndex) => (
                <QuarterBox
                  key={colIndex}
                  row={2}
                  column={colIndex + 1}
                />
              ))}
            </div>
            <div className="quarterbox-row">
              {[...Array(4)].map((_, colIndex) => (
                <QuarterBox
                  key={colIndex}
                  row={3}
                  column={colIndex + 1}
                />
              ))}
            </div>
            <div className="quarterbox-row">
              {[...Array(4)].map((_, colIndex) => (
                <QuarterBox
                  key={colIndex}
                  row={4}
                  column={colIndex + 1}
                />
              ))}
            </div>
          </div>
      </div>
      )};
    </div>
  );
}

export default App;
