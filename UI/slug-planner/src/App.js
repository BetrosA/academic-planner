// App.js

import React, { useState } from "react";
import SchoolLogo from "./assets/ucsc-slug-logo.png";
import "./App.css";

/* let departments = {
  "Arts": ["Art Studio BA"], 
  "Computer Science and Engineering": ["Computer Engineering B.S.", "Computer Science: B.A.", "Computer Science: B.S."],
  "Electrical and Computer Engineering": ["Electrical Engineering: B.S.", "Robotics Engineering: B.S."]
}; */

// let courses = ["Course 1", "Course 2", "Course 3", "Course 4", "Course 5"]; /* New array of courses */
let semesterTypes = ["Spring", "Fall", "Summer", "Winter"];
let semesterYears = ["2020", "2021", "2022", "2023", "2024"];

const getDepartments = (setDepartments) => {
  fetch('http://localhost:5000/departments', {
    method: 'get'
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      setDepartments(json);
    });
};

// change later to get courses for a specific devision
const getCourses = (setCourses) => {
  fetch('http://localhost:5000/courses/' + 'test', {
    method: 'get'
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      setCourses(json);
    });
};

function SemesterBox({ semester }) {
  const [newCourse, setNewCourse] = useState("");

  const handleCourseChange = (event) => {
    setNewCourse(event.target.value);
  };

  const handleAddCourseClick = () => {
    semester.courses.push(newCourse);
    setNewCourse("");
  };

  return (
    <div className="semester-box">
      <h3>{semester.type} {semester.year}</h3>
      {semester.courses.map((course, index) => (
        <div key={index}>{course}</div>
      ))}
      <input value={newCourse} onChange={handleCourseChange} />
      <button onClick={handleAddCourseClick}>Add Course</button>
    </div>
  );
}
  
function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMajor, setShowMajor] = useState(false);
  const [departments, setDepartments ] = useState(false);
  const [courses, setCourses ] = useState([]);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showStartingYear, setShowStartingYear] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedStartingYear, setSelectedStartingYear] = useState(null);
  const [semesterType, setSemesterType] = useState(null);
  const [semesterYear, setSemesterYear] = useState(null);
  const [semesters, setSemesters] = useState([]);

  React.useEffect(() => {
    getDepartments(setDepartments);
    getCourses(setCourses);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  }; 

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

  const handleSemesterTypeChange = (event) => {
    setSemesterType(event.target.value);
  };

  const handleSemesterYearChange = (event) => {
    setSemesterYear(event.target.value);
  };

  const handleAddSemesterClick = () => {
    if (semesterType && semesterYear) {
      setSemesters([
        ...semesters,
        { type: semesterType, year: semesterYear, courses: [] }
      ]);
      setSemesterType(null);
      setSemesterYear(null);
    }
  };



  const isGenerateButtonEnabled = () => {
    return selectedMajor && selectedDepartment && selectedStartingYear;
  };
  return (
    <div className="app-container">
      <header className="header">
        <img src={SchoolLogo} alt="School Logo" className="logo" />
        <h2>Slug - Planner</h2>
      </header>
  
      <nav className="nav">
        <ul className="nav-list">
          <li>
          <button className="home-button">Home</button>
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
              <a className="dropbtn">{selectedMajor ? selectedMajor : "Major"}</a>
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
          {selectedMajor && (
            <li
              className="dropdown"
              onMouseEnter={toggleStartingYear}
              onMouseLeave={toggleStartingYear}
            >
              <a className="dropbtn">{selectedStartingYear ? selectedStartingYear : "      Starting Year"}</a>
              {showStartingYear && (
                <div className="dropdown-content">
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
          {selectedDepartment && selectedMajor && (
            <li>
              <button className="generate-btn">
                Generate
              </button>
            </li>
          )}
        </ul>
      </nav>
  
      <div className="content"> {/* New container div */}
        <div className="sidebar">
          {/* <h1>Major Requirements</h1> */}
        Major Requirements
        <ul>
          {courses.map((course, index) => (
            <li key={index}>{course}</li>
          ))}
        </ul>
        </div>

        <div className="main-content">
          <button className="add-new-semester-btn" onClick={handleAddSemesterClick}>Add New Semester</button>

          {semesters.map((semester, index) => (
            <SemesterBox key={index} semester={semester} />
          ))}
          
          <select onChange={handleSemesterTypeChange}>
            <option>Select Semester Type</option>
            {semesterTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select onChange={handleSemesterYearChange}>
            <option>Select Year</option>
            {semesterYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {semesterType && semesterYear && (
            <button className="add-btn" onClick={handleAddSemesterClick}>Add</button>
          )}
        </div>
      </div>
    </div>
  );
  
  
}

export default App;
