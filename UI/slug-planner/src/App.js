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

function SemesterBox({ semester, semesters, availableCourses, addedCourses, onCourseRemove, onSemesterRemove }) {
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
      const isDuplicateCourse = semesters.some((s) => s.courses.includes(newCourse));
      if (!isDuplicateCourse) {
        semester.courses.push(newCourse);
        setNewCourse("");
        setSelectedSubject("");
        sortClassesAlphabetically(); // Sort the courses after adding a new one
      } else {
        // Display an error message or handle the duplicate course case
        console.log("Duplicate course detected");
      }
    }
  };
  
  const sortClassesAlphabetically = () => {
    semester.courses.sort((a, b) => {
      const [subjectA, numberA] = a.split(" ");
      const [subjectB, numberB] = b.split(" ");
  
      if (subjectA === subjectB) {
        // If the subjects are the same, compare the course numbers
        return parseInt(numberA) - parseInt(numberB);
      } else {
        // If the subjects are different, compare them alphabetically
        return subjectA.localeCompare(subjectB);
      }
    });
  };

  const handleRemoveCourseClick = (index, course) => {
    semester.courses.splice(index, 1);
    onCourseRemove(course);
  };

  const handleRemoveSemesterClick = () => {
    onSemesterRemove(semester);
  };

  const filteredCourses = availableCourses
    .filter((course) => !semester.courses.includes(course))
    .filter((course) => !addedCourses.includes(course))
    .filter((course) =>
      course.toLowerCase().startsWith(selectedSubject.toLowerCase())
    )
    .filter((course) =>
      semesters.every((s) => !s.courses.includes(course))
    );

  
  return (
    <div className="semester-box">
      <h3>
        {semester.type} {semester.year}
        <button onClick={handleRemoveSemesterClick}>Remove Semester</button>
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
          .filter((subject) =>
            availableCourses.some(
              (course) =>
                course.toLowerCase().startsWith(subject.toLowerCase()) &&
                !semester.courses.includes(course)
            )
          )
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
  React.useEffect(() => {
    getDepartments(setDepartments);
    getCourses(setCourses);
  }, []);

  //Nav Bar constants 
  const [showMajor, setShowMajor] = useState(false);
  const [departments, setDepartments ] = useState(false);
  const [courses, setCourses ] = useState([]);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showStartingYear, setShowStartingYear] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedStartingYear, setSelectedStartingYear] = useState(null);

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

  //Semester Box constants 
  const [semesters, setSemesters] = useState([]);
  const [semesterType, setSemesterType] = useState("Select Semester Type");
  const [semesterYear, setSemesterYear] = useState("Select Year");
  const [semesterTypes] = useState(["Spring", "Summer", "Fall", "Winter"]);
  const [semesterYears] = useState(["2020", "2021", "2022", "2023", "2024"]);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true); // New state variable
  const [isGenerated, setIsGenerated] = useState(false); 

  //Semester Box Functions
  const updateAddButtonStatus = (semesterType, year) => {
    const isPairSelected = semesters.some(
      (semester) =>
        semester.type === semesterType &&
        semester.year === year &&
        semesterType !== "Select Semester Type" &&
        year !== "Select Year"
    );
    setIsAddButtonDisabled(
      semesterType === "Select Semester Type" ||
      year === "Select Year" ||
      isPairSelected
    );
  };
  
  const handleSemesterTypeChange = (event) => {
    setSemesterType(event.target.value);
    updateAddButtonStatus(event.target.value, semesterYear);
  };
  
  const handleSemesterYearChange = (event) => {
    setSemesterYear(event.target.value);
    updateAddButtonStatus(semesterType, event.target.value);
  };

  const handleCourseRemove = () => {
    setSemesters([...semesters]);
  };

  const handleSemesterRemove = (semester) => {
    const updatedSemesters = semesters.filter((s) => s !== semester);
    setSemesters(updatedSemesters);

    // Check if the removed semester is the same as the currently selected pair
    if (
      semester.type === semesterType &&
      semester.year === semesterYear
    ) {
      setIsAddButtonDisabled(false); // Enable the button if the removed pair matches the selected pair
    }
  };

  const handleAddSemesterClick = () => {
    if (semesterType && semesterYear) {
      setSemesters([
        ...semesters,
        { type: semesterType, year: semesterYear, courses: [] }
      ]);
      setIsAddButtonDisabled(true); // Disable the button after adding the pair
    }
  };
  
  const addedCourses = semesters.flatMap((semester) => semester.courses);

  const sortedSemesters = [...semesters].sort((a, b) => {
    // Map semester types to their corresponding numeric values for comparison
    const semesterTypeValues = {
      Spring: 0,
      Summer: 1,
      Fall: 2,
      Winter: 3,
    };
  
    if (a.year !== b.year) {
      return a.year.localeCompare(b.year); // Sort by year in ascending order
    } else {
      return semesterTypeValues[a.type] - semesterTypeValues[b.type]; // Sort by type based on the mapped values
    }
  });

  return (
    <div className="app-container">
      {/* Logo*/}
      <header className="header">
        <a href="/">
          <img src={SchoolLogo} alt="School Logo" className="logo" />
        </a>
      </header>
  
      {/* Nav Bar */}
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
  
      <div className="content">
        <div className="sidebar">
          Major Requirements
          <ul>
            {courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        </div>
  
        <div className="main-content">
         {sortedSemesters.map((semester, index) => (
          <SemesterBox
            key={index}
            semester={semester}
            semesters={sortedSemesters}
            availableCourses={courses}
            addedCourses={addedCourses}
            onCourseRemove={handleCourseRemove}
            onSemesterRemove={handleSemesterRemove}
        />
        ))}

        <div className="add-semester-row">
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

          <button
            className={`add-new-semester-btn ${
              isAddButtonDisabled ? "transparent" : ""
            }`}
            onClick={handleAddSemesterClick}
            disabled={isAddButtonDisabled} // Disable the button based on the state variable
          >
            Add New Semester
          </button>
        </div>
      </div>
      </div>
    </div>
  );
  
    
}

export default App;
