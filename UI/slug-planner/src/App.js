// App.js

import React, { useState, useEffect } from "react";
import SchoolLogo from "./assets/Wide_Logo.png";
import "./App.css";

import { fetchDepartments, fetchCourses} from "./firebase";

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

function Sidebar({courses}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDragStart = (event, courseName, credits, genEd, originalIndex) => {
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("credits", credits);
    event.dataTransfer.setData("genEd", genEd);
    event.dataTransfer.setData("originalIndex", originalIndex.toString());
  };

  const sortCourses = (courses) => {
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

  const filterCoursesBySearch = (course) => {
    // Filter courses based on the search query
    if (searchQuery.trim() === "") {
      return true; // Return true if no search query is entered
    }
    const regex = new RegExp(searchQuery, "i"); // Case-insensitive search
    return regex.test(course.coursename);
  };

  const sortedCourses = sortCourses(courses).filter(filterCoursesBySearch);
  
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Available Courses</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      {
        sortedCourses.map((course, index) => (
          <div
            key={index}
            className="draggable-course"
            draggable
            onDragStart={(event) => handleDragStart(event, course.coursename, course.credithours, course.genEd, index)}
          >
            {course.coursename}
          </div>
        ))}
    </div>
  );
}

function BottomSidebar({courses}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDragStart = (event, courseName, credits, genEd, originalIndex) => {
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("credits", credits);
    event.dataTransfer.setData("genEd", genEd);
    event.dataTransfer.setData("originalIndex", originalIndex.toString());
  };

  const sortCourses = (courses) => {
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

  const filterCoursesBySearch = (course) => {
    // Filter courses based on the search query
    if (searchQuery.trim() === "") {
      return true; // Return true if no search query is entered
    }
    const regex = new RegExp(searchQuery, "i"); // Case-insensitive search
    return regex.test(course.coursename);
  };

  const sortedCourses = sortCourses(courses).filter(filterCoursesBySearch);
  

  return (
    <div className="bottom-sidebar">
      <h2 className="sidebar-title">Other Courses</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      {
        sortedCourses.map((course, index) => (
          <div
            key={index}
            className="draggable-course"
            draggable
            onDragStart={(event) => handleDragStart(event, course.coursename, course.credithours, course.genEd, index)}
          >
            {course.coursename}
          </div>
        ))}
    </div>
  );
}

function QuarterBox({row,  column,  selectedStartingYear,  allDroppedCourses,  setAllDroppedCourses, setCourses, GE_Check, setGE_Check}) {
  const [droppedCourses, setDroppedCourses] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    const courseName = event.dataTransfer.getData("courseName");
    const courseCredits = event.dataTransfer.getData("credits");
    const genEd = event.dataTransfer.getData("genEd");
    const originalIndex = parseInt(event.dataTransfer.getData("originalIndex"));

    console.log("HandleDrop");
    console.log("Name:", courseName);
    console.log("Credits:", courseCredits);
    console.log("GE:", genEd);

    const course = {
      coursename: courseName,
      credits: courseCredits,
      genEdCode: genEd
    };

    

    const credits = parseInt(courseCredits.split(" ")[1]);
    const genEdCode = genEd.includes("none") ? "none" : genEd.split(" ").pop();

    const isDuplicate = allDroppedCourses.some(
      (droppedCourse) => droppedCourse.coursename === courseName
    );

    if (!isDuplicate && courseName.trim() !== "") {
      setDroppedCourses((prevCourses) => [...prevCourses, course]);
      setAllDroppedCourses((prevCourses) => [...prevCourses, course]);
      setGE_Check((prevState) => ({
        ...prevState,
        Credits: prevState.Credits + credits,
      }));
      
      if (genEdCode in GE_Check) {
        setGE_Check((prevGE_Check) => ({
          ...prevGE_Check,
          [genEdCode]: prevGE_Check[genEdCode] + 1,
        }));
      }

      // Remove the dropped course from the sidebar
      setCourses((prevCourses) =>
        prevCourses.filter((_, index) => index !== originalIndex)
      );
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveCourse = (courseName, courseCredits, genEd, originalIndex) => {
    console.log("RemoveCourse:");
    console.log("Name:", courseName);
    console.log("Credits:", courseCredits);
    console.log("GenED:", genEd);

    const credits = parseInt(courseCredits.split(" ")[1]);
    const genEdCode = genEd.includes("none") ? "none" : genEd.split(" ").pop();

    setDroppedCourses((prevCourses) =>
      prevCourses.filter((droppedCourse) => droppedCourse.coursename !== courseName)
    );
    setAllDroppedCourses((prevCourses) =>
      prevCourses.filter((droppedCourse) => droppedCourse.coursename !== courseName)
    );

    setGE_Check((prevState) => ({
      ...prevState,
      Credits: prevState.Credits - credits,
    }));

    if (genEdCode in GE_Check) {
      setGE_Check((prevGE_Check) => ({
        ...prevGE_Check,
        [genEdCode]: prevGE_Check[genEdCode] - 1,
      }));
    }
  
    // Add the removed course back to the sidebar at its original index
    const removedCourse = { coursename: courseName, credithours: courseCredits, genEd: genEd };
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses];
      updatedCourses.splice(originalIndex, 0, removedCourse);
      return updatedCourses.sort(); // Sort the updated courses array
    });
  };

  const handleCourseDragStart = (event, courseName, courseCredits, genEd, originalIndex) => {
    console.log("DragCourse:");
    console.log("Name:", courseName);
    console.log("Credits:", courseCredits);
    console.log("GenED:", genEd);
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("credits", courseCredits);
    event.dataTransfer.setData("genEd", genEd);
    event.dataTransfer.setData("originalIndex", originalIndex.toString());
    setTimeout(() => {
      handleRemoveCourse(courseName, courseCredits, genEd, originalIndex);
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
          onDragStart={(event) => handleCourseDragStart(event, course.coursename, course.credits, course.genEdCode, index)}
        >
          <button
            className="remove-course-button"
            onClick={() => handleRemoveCourse(course.coursename, course.credits, course.genEdCode)}
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
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedStartingYear, setSelectedStartingYear] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [allDroppedCourses, setAllDroppedCourses] = useState([]);
  const [planner, setPlanner] = useState([]);
  const [totalYears, setTotalYears] = useState(4);
  const [GE_Check, setGE_Check] = useState({
    CC: 0,
    ER: 0,
    IM: 0,
    MF: 0,
    SI: 0,
    SR: 0,
    TA: 0,
    'PE-E': 0,
    'PE-H': 0,
    'PE-T': 0,
    'PR-E': 0,
    'PR-C': 0,
    'PR-S': 0,
    C: 0,
    'Credits': 0,
  });

  const addYear = () => {
    setTotalYears(totalYears + 1);
  };

  //Minimum should be 2 year planner 
  const removeYear = () => {
    if (totalYears > 2) {
      setTotalYears(totalYears - 1);
    }
  };

  useEffect(() => {
    fetchDepartments(setDepartments);
    fetchCourses(setCourses);
    generatePlanner("Computer Science B.S.",setPlanner)
  }, []);

  const handleCheckboxChange = (key) => {
    const updatedGE_Check = { ...GE_Check };
    updatedGE_Check[key] = updatedGE_Check[key] > 0 ? 0 : 1; // Toggle the value between 0 and 1
    setGE_Check(updatedGE_Check);
  };

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
          <div className="sidebar-container">
            <div className="top-half">
              <Sidebar courses={courses} />
              <BottomSidebar courses={courses} />
            </div>
            <div className="bottom-half">
              <div>
                <h2>Graduation requirements</h2>
                <div className="requirements-container">
                  {Object.entries(GE_Check).map(([key, value]) => (
                      <div key={key} className="checkbox-container">
                        {key === "Credits" ? ( // Check if the option is "Credits"
                          <span key={key} className="requirement-item">
                            {key}: {value}/180
                          </span>
                        ) : (
                          <div>
                            <input
                              type="checkbox"
                              id={key}
                              checked={value > 0}
                              onChange={() => handleCheckboxChange(key)}
                              disabled
                            />
                            <label htmlFor={key}>{key}</label>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        <div className="quarterbox-container-wrapper">
          <div className="quarterbox-container">
            {[...Array(totalYears)].map((_, rowIndex) => (
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
                    GE_Check={GE_Check}
                    setGE_Check={setGE_Check}
                  />
                ))}
              </div>
            ))}
            <button onClick={removeYear}>Remove Year</button>
            <button onClick={addYear}>Add Year</button>
            
          </div>
          
        </div>
        
      </div>
      )}
    </div>
  )
}

export default App;