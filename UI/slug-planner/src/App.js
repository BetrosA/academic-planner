// App.js

import React, { useState } from "react";
import SchoolLogo from "./assets/Wide_Logo.png";
import "./App.css";

/* let departments = {
  "Arts": ["Art Studio BA"], 
  "Computer Science and Engineering": ["Computer Engineering B.S.", "Computer Science: B.A.", "Computer Science: B.S."],
  "Electrical and Computer Engineering": ["Electrical Engineering: B.S.", "Robotics Engineering: B.S."]
}; */

// let courses = ["Course 1", "Course 2", "Course 3", "Course 4", "Course 5"]; /* New array of courses */

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

function SemesterBox({ semester, availableCourses, onCourseRemove }) {
  const [newCourse, setNewCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleCourseChange = (event) => {
    setNewCourse(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setNewCourse("");
  };

  const handleAddCourseClick = () => {
    if (newCourse && !semester.courses.includes(newCourse)) {
      semester.courses.push(newCourse);
      setNewCourse("");
      setSelectedSubject("");
    }
  };

  const handleRemoveCourseClick = (index, course) => {
    semester.courses.splice(index, 1);
    onCourseRemove(course);
  };

  const filteredCourses = availableCourses.filter((course) =>
    course.toLowerCase().startsWith(selectedSubject.toLowerCase())
  );

  return (
    <div className="semester-box">
      <h3>
        {semester.type} {semester.year}
      </h3>
      {semester.courses.map((course, index) => (
        <div key={index}>
          {course}
          <button onClick={() => handleRemoveCourseClick(index, course)}>
            Remove
          </button>
        </div>
      ))}
      <select value={selectedSubject} onChange={handleSubjectChange}>
        <option value="">Select Subject</option>
        {availableCourses
          .map((course) => course.split(" ")[0])
          .filter((value, index, self) => self.indexOf(value) === index)
          .map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
      </select>
      <select
        value={newCourse}
        onChange={handleCourseChange}
        disabled={!selectedSubject}
      >
        <option>Select Course</option>
        {filteredCourses.map((course, index) => (
          <option key={index} value={course}>
            {course}
          </option>
        ))}
      </select>
      <button onClick={handleAddCourseClick} disabled={!newCourse}>
        Add Course
      </button>
    </div>
  );
}

  
function App() {
  //Nav Bar constants 
  const [showMajor, setShowMajor] = useState(false);
  const [departments, setDepartments ] = useState(false);
  const [courses, setCourses ] = useState([]);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showStartingYear, setShowStartingYear] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedStartingYear, setSelectedStartingYear] = useState(null);

  //Semester Box constants 
  const [semesters, setSemesters] = useState([]);
  const [semesterType, setSemesterType] = useState("");
  const [semesterYear, setSemesterYear] = useState("");
  const [semesterTypes] = useState(["Spring", "Summer", "Fall", "Winter"]);
  const [semesterYears] = useState(["2020", "2021", "2022", "2023", "2024"]);
  const [isGenerated, setIsGenerated] = useState(false);

  React.useEffect(() => {
    getDepartments(setDepartments);
    getCourses(setCourses);
  }, []);

  //Nav Functions 
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

  const handleGenerateClick = () => {
    setIsGenerated(true);
  };

  //Semester Box Functions
  const handleSemesterTypeChange = (event) => {
    setSemesterType(event.target.value);
  };

  const handleSemesterYearChange = (event) => {
    setSemesterYear(event.target.value);
  };

  const handleCourseRemove = () => {
    setSemesters([...semesters]);
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

  return (
    <div className="app-container">
      {/* Logo*/}
      <header className="header">
        <a href="/"><img src={SchoolLogo} alt="School Logo" className="logo" /></a>
      </header>

      {/*Nav Bar*/}
      <nav className="nav">
        <ul className="nav-list">
          <li>
          <a href="/"><button className="home-button">Home</button></a>
          </li>

          {/*Dept. Dropdown*/}
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

          {/*Major Dropdown*/}
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

          {/*Year Dropdown*/}
          {selectedMajor && (
            <li
              className="dropdown"
              onMouseEnter={toggleStartingYear}
              onMouseLeave={toggleStartingYear}
            >
              <a className="dropbtn">{selectedStartingYear ? selectedStartingYear : "Starting Year"}</a>
              {showStartingYear && (
                <div className="dropdown-content">
                  {semesterYears.map((year) => (
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

          {/*Generate Button*/}
          {selectedDepartment && selectedMajor && selectedStartingYear &&(
            <li>
              <button className="generate-btn" onClick={handleGenerateClick}>
                Generate Schedule
              </button>
            </li>
          )}
        </ul>
      </nav>
  
      {/*{isGenerated && (*/}
      <div className="content"> {/* New container div */}
        <div className="sidebar">
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
            <SemesterBox
            key={index}
            semester={semester}
            availableCourses={courses}
            onCourseRemove={handleCourseRemove}
          />

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
      {/* )} */}
      
    </div>
  );
  
  
}

export default App;
