// App.js

import React, { useState, useEffect } from "react";
import SchoolLogo from "./assets/Wide_Logo.png";
import "./App.css";

import { fetchDepartments, fetchCourses, fetchQuartersOffered } from "./firebase";

const generatePlanner = (major, setPlanner) => {
  fetch('http://localhost:5000/planner/'+ encodeURI(major), {
    method: 'get'
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      setPlanner(json);
    });
};

function NavBar({selectedDepartment,  selectedMajor,  selectedStartingYear,  setSelectedDepartment,  setSelectedMajor,  setSelectedStartingYear,  setIsGenerated,  departments}) {
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
    setSelectedMajor(selectedMajor);
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
         <button className="dropdown_hover_button">
            {selectedDepartment ? selectedDepartment : "Departments"}
          </button>
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
            <button className="dropdown_hover_button">
              {selectedMajor ? selectedMajor : "Major"}
            </button>
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
            <button className="dropdown_hover_button">
              {selectedStartingYear ? selectedStartingYear : "Starting Year"}
            </button>
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
  )
}

function Sidebar({ courses, selectedMajor }) {

  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDragStart = (event, courseName, originalIndex) => {
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("originalIndex", originalIndex.toString());
  };
  
  const filterCoursesByMajor = (course) => {
    if (selectedMajor === "Robotics Engineering: B.S.") {
      return course.coursename.startsWith("ECE") || course.coursename.startsWith("CSE");
    } else if (selectedMajor === "Electrical Engineering: B.S.") {
      return course.coursename.startsWith("ECE") || course.coursename.startsWith("CSE") || course.coursename.startsWith("MATH") || course.coursename.startsWith("STAT 131");
    } else if (selectedMajor === "Computer Engineering B.S.") {
      return course.coursename.startsWith("CSE") || course.coursename.startsWith("ECE") ;
    } else if (selectedMajor === "Computer Science: B.S.") {
      return course.coursename.startsWith("CSE") || course.coursename.startsWith("MATH") ;
    } else if (selectedMajor === "Computer Science: B.A.") {
      return course.coursename.startsWith("CSE") || course.coursename.startsWith("MATH") ;
    } else if (selectedMajor === "Art Studio BA") {
      return course.coursename.startsWith("ART");
    }

    // Add more conditions for other majors if needed
    return true; // Return true by default if no major is selected or condition matches
  };

  const filterCoursesBySearch = (course) => {
    // Filter courses based on the search query
    if (searchQuery.trim() === "") {
      return true; // Return true if no search query is entered
    }
    const regex = new RegExp(searchQuery, "i"); // Case-insensitive search
    return regex.test(course.coursename);
  };

  const filteredCourses = courses.filter(filterCoursesByMajor).filter(filterCoursesBySearch);

  return (
    <div className="sidebar">
      <h2>Available Classes</h2>
      <input
        type="text"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />
      {
        filteredCourses.map((course, index) => (
          <div
            key={index}
            className="draggable-course"
            draggable
            onDragStart={(event) => handleDragStart(event, course.coursename, index)}
          >
            {course.coursename}
          </div>
        ))}
    </div>
  );
}

function QuarterBox({
  row,
  column,
  selectedStartingYear,
  allDroppedCourses,
  setAllDroppedCourses,
  courses,
  setCourses,
}) {
  const [droppedCourses, setDroppedCourses] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    const courseName = event.dataTransfer.getData("courseName");
    const originalIndex = parseInt(event.dataTransfer.getData("originalIndex"));
    const course = { coursename: courseName };

    const isDuplicate = allDroppedCourses.some(
      (droppedCourse) => droppedCourse.coursename === courseName
    );

    if (!isDuplicate && courseName.trim() !== "") {
      setDroppedCourses((prevCourses) => [...prevCourses, course]);
      setAllDroppedCourses((prevCourses) => [...prevCourses, course]);

      // Remove the dropped course from the sidebar
      setCourses((prevCourses) =>
        prevCourses.filter((_, index) => index !== originalIndex)
      );
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveCourse = (courseName, originalIndex) => {
    setDroppedCourses((prevCourses) =>
      prevCourses.filter((droppedCourse) => droppedCourse.coursename !== courseName)
    );
    setAllDroppedCourses((prevCourses) =>
      prevCourses.filter((droppedCourse) => droppedCourse.coursename !== courseName)
    );
  
    // Add the removed course back to the sidebar at its original index
    const removedCourse = { coursename: courseName };
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses];
      updatedCourses.splice(originalIndex, 0, removedCourse);
      return updatedCourses.sort(); // Sort the updated courses array
    });
  };

  const handleCourseDragStart = (event, courseName, originalIndex) => {
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("originalIndex", originalIndex.toString());
    setTimeout(() => {
      handleRemoveCourse(courseName, originalIndex);
    }, 0);
  };

  const sortDroppedCourses = (courses) => {
    return courses.sort((a, b) => {
      const [prefixA, codeA] = a.coursename.split(" ");
      const [prefixB, codeB] = b.coursename.split(" ");

      if (prefixA !== prefixB) {
        return prefixA.localeCompare(prefixB);
      } else {
        return parseInt(codeA) - parseInt(codeB);
      }
    });
  };

  const sortedDroppedCourses = sortDroppedCourses(droppedCourses);

  const getBoxTitle = () => {
    let year = parseInt(selectedStartingYear) + row - 1;
    if (column === 1) {
      return `Fall ${year}`;
    } else if (column === 2) {
      return `Winter ${year}`;
    } else if (column === 3) {
      return `Spring ${year}`;
    } else {
      return `Summer ${year}`;
    }
  };

  return (
    <div className="quarter-box" onDrop={handleDrop} onDragOver={handleDragOver}>
      <h2 className="quarter-title">{getBoxTitle()}</h2>
      {sortedDroppedCourses.map((course, index) => (
        <div
          key={index}
          className="draggable-course"
          draggable
          onDragStart={(event) => handleCourseDragStart(event, course.coursename, index)}
        >
          <button
            className="remove-course-button"
            onClick={() => handleRemoveCourse(course.coursename)}
          >
            x
          </button>
          <span>{course.coursename}</span>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [quartersOffered, setQuartersOffered] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedStartingYear, setSelectedStartingYear] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [allDroppedCourses, setAllDroppedCourses] = useState([]);
  const [planner, setPlanner] = useState([]);

  useEffect(() => {
    fetchDepartments(setDepartments);
    fetchCourses(setCourses);
    fetchQuartersOffered(setQuartersOffered);
    generatePlanner("Computer Science B.S.",setPlanner)
  }, []);

  return (
    <div>
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
      <Sidebar courses={courses} selectedMajor={selectedMajor} />
      <div className="quarterbox-container-wrapper">
        <div className="quarterbox-container">
          {[...Array(4)].map((_, rowIndex) => (
            <div className="quarterbox-row" key={rowIndex}>
              {[...Array(4)].map((_, colIndex) => (
                <QuarterBox
                  key={colIndex}
                  row={rowIndex + 1}
                  column={colIndex + 1}
                  selectedStartingYear={selectedStartingYear}
                  allDroppedCourses={allDroppedCourses}
                  setAllDroppedCourses={setAllDroppedCourses}
                  courses={courses}
                  setCourses={setCourses}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default App;