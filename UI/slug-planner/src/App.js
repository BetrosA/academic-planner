// App.js

import React, { useState, useEffect } from "react";
import SchoolLogo from "./assets/Wide_Logo.png";
import "./App.css";

import { fetchDepartments, fetchCourses} from "./firebase";

const PlannerContext = React.createContext();

const generatePlanner = async (major, setPlanner) => {
  major = major.replace(':', '')
  await fetch('http://localhost:5000/planner/'+ encodeURI(major), {
    method: 'get'
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      setPlanner(json);
    });
};

function NavBar({selectedDivision, setSelectedDivision, selectedDepartment,  selectedMajor,  selectedStartingYear,  setSelectedDepartment,  setSelectedMajor,  setSelectedStartingYear,  setIsGenerated,  divisions}) {
  const [showDivision, setShowDivision] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showMajor, setShowMajor] = useState(false);
  const [showStartingYear, setShowStartingYear] = useState(false);

  const [prevSelectedDivision, setPrevSelectedDivision] = useState(null);
  const [prevSelectedDepartment, setPrevSelectedDepartment] = useState(null);
  const [prevSelectedMajor, setPrevSelectedMajor] = useState(null);
  const [prevSelectedStartingYear, setPrevSelectedStartingYear] = useState(null);

  const [ChooseYears] = useState(["2020", "2021", "2022", "2023", "2024"]);
  const {setPlanner} = React.useContext(PlannerContext)

  const toggleDivision = () => {
    setShowDivision(!showDivision);
  };

  const toggleDepartment = () => {
    setShowDepartment(!showDepartment);
  };

  const toggleMajor = () => {
    setShowMajor(!showMajor);
  };

  const toggleStartingYear = () => {
    setShowStartingYear(!showStartingYear);
  };

  const handleDivisionClick = (name) => {
    setShowDivision(false);
  
    // Check if division selection has changed
    if (prevSelectedDivision !== name) {
      setSelectedDivision(name);
      setSelectedDepartment(null);
      setSelectedMajor(null);
      setSelectedStartingYear(null);
      setIsGenerated(false);
      setPrevSelectedDivision(name);
    }
  };
  

  const handleDepartmentClick = (name) => {
    setShowDepartment(false);
  
    // Check if department selection has changed
    if (prevSelectedDepartment !== name) {
      setSelectedDepartment(name);
      setSelectedMajor(null);
      setSelectedStartingYear(null);
      setIsGenerated(false);
      setPrevSelectedDepartment(name);
    }
  };
  
  const handleMajorClick = (major) => {
    setShowMajor(false);
  
    // Check if major selection has changed
    if (prevSelectedMajor !== major) {
      setSelectedMajor(major);
      setSelectedStartingYear(null); 
      setIsGenerated(false);
      setPrevSelectedMajor(major);
    }
  };
  
  const handleStartingYearClick = (year) => {
    
    setShowStartingYear(false);
  
    // Check if starting year selection has changed
    if (prevSelectedStartingYear !== year) {
      
      setIsGenerated(false);
      
    }
    setSelectedStartingYear(year);
    setPrevSelectedStartingYear(year);
  };
  
  const handleGenerateClick = () => {
    setSelectedMajor(selectedMajor);
    generatePlanner(selectedMajor, setPlanner)
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

        {/* Division Dropdown */}
        <li
          className="dropdown"
          onMouseEnter={toggleDivision}
          onMouseLeave={toggleDivision}
        >
          <button className="dropdown_hover_button">
            {selectedDivision ? selectedDivision : "Divisions"}
          </button>
          {showDivision && (
            <div className="dropdown-content" style={{ width: "150px" }}>
              {divisions
                .map((division) => division.Department)
                .sort()
                .map((divisionName, index) => (
                  <button
                    key={index}
                    className="dropdown-button"
                    onClick={() => handleDivisionClick(divisionName)}
                  >
                    {divisionName}
                  </button>
                ))}
            </div>
          )}
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
          {selectedDivision && showDepartment && (
            <div className="dropdown-content" style={{ width: "150px" }}>
              {divisions
                .find((division) => division.Department === selectedDivision)
                ?.subdepartment
                .map((subdepartment) => subdepartment.name)
                .sort()
                .map((departmentName) => (
                  <button
                    key={departmentName}
                    className="dropdown-button"
                    onClick={() => handleDepartmentClick(departmentName)}
                  >
                    {departmentName}
                  </button>
                ))}
            </div>
          )}
        </li>

        {/* Major Dropdown */}
        <li
          className="dropdown"
          onMouseEnter={toggleMajor}
          onMouseLeave={toggleMajor}
        >
          <button className="dropdown_hover_button">
            {selectedMajor ? selectedMajor : "Major"}
          </button>
          {selectedDepartment && showMajor && (
            <div className="dropdown-content">
              {divisions
                .find((division) => division.Department === selectedDivision)
                ?.subdepartment.find((subdepartment) => subdepartment.name === selectedDepartment)
                ?.majors
                .map((major) => major.majorname)
                .sort()
                .map((majorName) => (
                  <button
                    key={majorName}
                    className="dropdown-button"
                    onClick={() => handleMajorClick(majorName)}
                  >
                    {majorName}
                  </button>
                ))}
            </div>
          )}
        </li>

        {/* Year Dropdown */}
        <li
          className="dropdown"
          onMouseEnter={toggleStartingYear}
          onMouseLeave={toggleStartingYear}
        >
          <button className="dropdown_hover_button">
            {selectedStartingYear ? selectedStartingYear : "Starting Year"}
          </button>
          {selectedMajor && showStartingYear && (
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

        {/* Generate Button */}
        {selectedDivision && selectedDepartment && selectedMajor && selectedStartingYear && (
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

function MajorReqSidebar({courses}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDragStart = (event, courseName, credits, genEd, quarters) => {
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("credits", credits);
    event.dataTransfer.setData("genEd", genEd);
    event.dataTransfer.setData("quarters", quarters);
  };

  const sortCourses = (courses) => {
    return courses.sort((a, b) => {
      const [prefixA, codeA] = a.coursename.split(" ");
      const [prefixB, codeB] = b.coursename.split(" ");
  
      if (prefixA !== prefixB) {
        return prefixA.localeCompare(prefixB);
      } else {
        // Extract the numeric part of the course code
        const numericCodeA = parseInt(codeA);
        const numericCodeB = parseInt(codeB);
  
        // Check if the course codes are equal (e.g., "11A" and "11B")
        if (numericCodeA === numericCodeB) {
          // Compare the alphabetic part to sort "A" before "B"
          return codeA.localeCompare(codeB);
        } else {
          // Sort numerically based on the course codes
          return numericCodeA - numericCodeB;
        }
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
        sortedCourses.map((course) => (
          <div
            key={course.coursename}
            className="draggable-course"
            draggable
            onDragStart={(event) => handleDragStart(event, course.coursename, course.credithours, course.genEd, course.quarteroffered)}
          >
            <div><strong>{course.coursename}</strong></div>
            <br />
            <div>Credits: {course.credithours.replace("Credits ", "")}</div>
            <div>
              Quarter(s) Offered: {course.quarteroffered.replace("Quarter Offered ", "")}
            </div>
          </div>
        ))}
    </div>
  );
}

function AllCoursesSidebar({ courses }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDragStart = (event, courseName, credits, genEd, quarters) => {
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("credits", credits);
    event.dataTransfer.setData("genEd", genEd);
    event.dataTransfer.setData("quarters", quarters);
  };

  const sortCourses = (courses) => {
    return courses.sort((a, b) => {
      const [prefixA, codeA] = a.coursename.split(" ");
      const [prefixB, codeB] = b.coursename.split(" ");

      if (prefixA !== prefixB) {
        return prefixA.localeCompare(prefixB);
      } else {
        const numericCodeA = parseInt(codeA);
        const numericCodeB = parseInt(codeB);

        if (numericCodeA === numericCodeB) {
          return codeA.localeCompare(codeB);
        } else {
          return numericCodeA - numericCodeB;
        }
      }
    });
  };

  const filterCoursesBySearch = (course) => {
    if (searchQuery.trim() === "") {
      return true;
    }
    const regex = new RegExp(searchQuery, "i");
    return regex.test(course.coursename);
  };

  const filterCoursesBySelectedFilter = (course) => {
    if (selectedFilter === "All") {
      return true;
    } else if (selectedFilter === "CC") {
      return course.genEd.endsWith("CC");
    } else if (selectedFilter === "ER") {
      return course.genEd.endsWith("ER");
    } else if (selectedFilter === "IM") {
      return course.genEd.endsWith("IM");
    } else if (selectedFilter === "MF") {
      return course.genEd.endsWith("MF");
    } else if (selectedFilter === "SI") {
      return course.genEd.endsWith("SI");
    } else if (selectedFilter === "SR") {
      return course.genEd.endsWith("SR");
    } else if (selectedFilter === "TA") {
      return course.genEd.endsWith("TA");
    } else if (selectedFilter === "PE-E") {
      return course.genEd.endsWith("PE-E");
    } else if (selectedFilter === "PE-H") {
      return course.genEd.endsWith("PE-H");
    } else if (selectedFilter === "PE-T") {
      return course.genEd.endsWith("PE-T");
    } else if (selectedFilter === "PR-E") {
      return course.genEd.endsWith("PR-E");
    } else if (selectedFilter === "PE-C") {
      return course.genEd.endsWith("PE-C");
    } else if (selectedFilter === "PR-S") {
      return course.genEd.endsWith("PR-S");
    } else if (selectedFilter === "C") {
      return course.genEd.endsWith("C") && !course.genEd.endsWith("CC") && !course.genEd.endsWith("PR-C");
    }
  };
  
  const sortedCourses = sortCourses(courses)
    .filter(filterCoursesBySearch)
    .filter(filterCoursesBySelectedFilter);

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "CC", value: "CC" },
    { label: "ER", value: "ER" },
    { label: "IM", value: "IM" },
    { label: "MF", value: "MF" },
    { label: "SI", value: "SI" },
    { label: "SR", value: "SR" },
    { label: "TA", value: "TA" },
    { label: "PE-E", value: "PE-E" },
    { label: "PE-H", value: "PE-H" },
    { label: "PE-T", value: "PE-T" },
    { label: "PR-E", value: "PR-E" },
    { label: "PR-C", value: "PE-C" },
    { label: "PR-S", value: "PR-S" },
    { label: "C", value: "C" },
  ];

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

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
      <div className="dropdown-container">
        <label htmlFor="filter-dropdown" className="dropdown-label">
          Filter by:
        </label>
        <select
          id="filter-dropdown"
          value={selectedFilter}
          onChange={handleFilterChange}
          className="filter-dropdown"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {sortedCourses.map((course) => (
        <div
          key={course.coursename}
          className="draggable-course"
          draggable
          onDragStart={(event) =>
            handleDragStart(
              event,
              course.coursename,
              course.credithours,
              course.genEd,
              course.quarteroffered
            )
          }
        >
          <div>
            <strong>{course.coursename}</strong>
          </div>
          <br />
          <div>Credits: {course.credithours.replace("Credits ", "")}</div>
          <div>
            Quarter(s) Offered:{" "}
            {course.quarteroffered.replace("Quarter Offered ", "")}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuarterBox({row,  column, selectedStartingYear,  allDroppedCourses,  setAllDroppedCourses, setCourses, GE_Check, setGE_Check, collapseState}) {
  const [droppedCourses, setDroppedCourses] = useState([]);
  const [quarterCredits, setQuarterCredits] = useState(0);

  const handleDrop = (event) => {
    event.preventDefault();
    const courseName = event.dataTransfer.getData("courseName");
    const courseCredits = event.dataTransfer.getData("credits");
    const genEd = event.dataTransfer.getData("genEd");
    const quarteroffered = event.dataTransfer.getData("quarters");

    const course = {
      coursename: courseName,
      credits: courseCredits,
      genEd: genEd,
      quarteroffered: quarteroffered
    };

    const credits = parseInt(courseCredits.split(" ")[1]);
    const genEdCode = genEd.includes("none") ? "none" : genEd.split(" ").pop();
    const quartersOffered = course.quarteroffered.split("Offered")[1].trim();
    const offeredSeasons = quartersOffered.split(",").map((season) => season.trim());

    const boxTitle = getBoxTitle();
    const boxSeason = boxTitle.split(" ")[0];



    const isDuplicate = allDroppedCourses.some(
      (droppedCourse) => droppedCourse.coursename === courseName
    );

    if (!isDuplicate && courseName.trim() !== "") {
      if (offeredSeasons.includes(boxSeason)) {
        setDroppedCourses((prevCourses) => [...prevCourses, course]);
        setAllDroppedCourses((prevCourses) => [...prevCourses, course]);
        setQuarterCredits(quarterCredits + credits);
        
        //Update GE box 
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
          prevCourses.filter((course) => course.coursename !== courseName)
        );
      }
      else{
        window.alert(`${courseName} is not available for the ${boxSeason} quarter.`);
      }  
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveCourse = (courseName, courseCredits, genEd, quarters) => {  
    //Isolate int for credits and string for GE's
    const credits = parseInt(courseCredits.split(" ")[1]);
    const genEdCode = genEd.includes("none") ? "none" : genEd.split(" ").pop();

    setDroppedCourses((prevCourses) =>
      prevCourses.filter((droppedCourse) => droppedCourse.coursename !== courseName)
    );
    setAllDroppedCourses((prevCourses) =>
      prevCourses.filter((droppedCourse) => droppedCourse.coursename !== courseName)
    );
    setQuarterCredits(quarterCredits - credits);

    //Update GE box 
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
  
    // Add the removed course back to the sidebar
    const removedCourse = { coursename: courseName, credithours: courseCredits, genEd: genEd, quarteroffered: quarters};
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses];
      updatedCourses.push(removedCourse);
      return updatedCourses.sort(); // Sort the updated courses array
    });
  };

  const handleCourseDragStart = (event, courseName, courseCredits, genEd, quarters) => {
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("credits", courseCredits);
    event.dataTransfer.setData("genEd", genEd);
    event.dataTransfer.setData("quarters", quarters);
    setTimeout(() => {
      handleRemoveCourse(courseName, courseCredits, genEd, quarters);
    }, 0);
  };

  const sortDroppedCourses = (courses) => {
    return courses.sort((a, b) => {
      const [prefixA, codeA] = a.coursename.split(" ");
      const [prefixB, codeB] = b.coursename.split(" ");
  
      if (prefixA !== prefixB) {
        return prefixA.localeCompare(prefixB);
      } else {
        // Extract the numeric part of the course code
        const numericCodeA = parseInt(codeA);
        const numericCodeB = parseInt(codeB);
  
        // Check if the course codes are equal (e.g., "11A" and "11B")
        if (numericCodeA === numericCodeB) {
          // Compare the alphabetic part to sort "A" before "B"
          return codeA.localeCompare(codeB);
        } else {
          // Sort numerically based on the course codes
          return numericCodeA - numericCodeB;
        }
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
    <div className={`quarter-box ${collapseState ? 'collapsed' : ''}`} onDrop={handleDrop} onDragOver={handleDragOver}>
      <h2 className="quarter-title">{getBoxTitle()}</h2>
      <div className={`course-list-container ${collapseState ? 'collapsed' : ''}`}>
        <div className="course-list-wrapper">
          <div className="course-list">
            {sortedDroppedCourses.map((course) => (
              <div
                key={course.coursename}
                className="quarterbox-draggable-course"
                draggable
                onDragStart={(event) =>
                  handleCourseDragStart(event, course.coursename, course.credits, course.genEd, course.quarteroffered)
                }
              >
                <button
                  className="remove-course-button"
                  onClick={() => handleRemoveCourse(course.coursename, course.credits, course.genEd, course.quarteroffered)}
                >
                  x
                </button>
                <div><strong>{course.coursename}</strong></div>
                <br />
                <div>Credits: {course.credits.replace("Credits ", "")}</div>
                <div>
                  Quarter(s) Offered: {course.quarteroffered.replace("Quarter Offered ", "")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="quarter-credits-container">
        <div className="quarter-credits-box">
          <p>Quarter Credits: {quarterCredits}</p>
        </div>
      </div>
    </div>
  );
}
  
function App() {
  const [divisions, setDivisions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedStartingYear, setSelectedStartingYear] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [allDroppedCourses, setAllDroppedCourses] = useState([]);
  const [planner, setPlanner] = useState(null);
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
  const [collapseStates, setCollapseStates] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });
  
  
  const addYear = () => {
    setTotalYears(totalYears + 1);
    setCollapseStates((prevState) => ({ ...prevState, [totalYears]: false }));
  };
  
  const removeYear = () => {
    if (totalYears > 2) {
      setTotalYears(totalYears - 1);
      setCollapseStates((prevState) => {
        const { [totalYears - 1]: removedItem, ...rest } = prevState;
        return rest;
      });
    }
  }

  const handleCollapse = (row) => {
    setCollapseStates((prevState) => ({
      ...prevState,
      [row]: !prevState[row],
    }));
  };

  useEffect(() => {
    fetchDepartments(setDivisions);
    fetchCourses(setCourses);
  }, []);

  const handleCheckboxChange = (key) => {
    const updatedGE_Check = { ...GE_Check };
    updatedGE_Check[key] = updatedGE_Check[key] > 0 ? 0 : 1; // Toggle the value between 0 and 1
    setGE_Check(updatedGE_Check);
  };
  console.log(courses)

  return (
    <PlannerContext.Provider value={{planner, setPlanner}} >
    <div>
      {/* Logo*/}
      <header className="header">
        <a href="/">
          <img src={SchoolLogo} alt="School Logo" className="logo" />
        </a>
      </header>

      {/* Nav Bar */}
      <NavBar
      selectedDivision = {selectedDivision}
      selectedDepartment={selectedDepartment}
      selectedMajor={selectedMajor}
      selectedStartingYear={selectedStartingYear}
      setSelectedDivision = {setSelectedDivision}
      setSelectedDepartment={setSelectedDepartment}
      setSelectedMajor={setSelectedMajor}
      setSelectedStartingYear={setSelectedStartingYear}
      setIsGenerated={setIsGenerated}
      divisions={divisions}
      />
    
      {isGenerated && (
        <div className="content">
          <div className="sidebar-container">
            <div className="top-half">
              <MajorReqSidebar courses={courses} />
              <AllCoursesSidebar courses={courses} />
            </div>
            <div className="bottom-half">
              <div>
                <h2>GE requirements</h2>
                <div className="requirements-container">
                  {Object.entries(GE_Check).map(([key, value]) => (
                      <div key={key} className="checkbox-container">
                        {key === "Credits" ? (
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
                <div className={`quarterbox-row ${collapseStates[rowIndex] ? 'collapsed' : ''}`} key={rowIndex}>
                  <button
                    className="collapse-button"
                    onClick={() => handleCollapse(rowIndex)}
                  >
                    {collapseStates[rowIndex] ? "Expand Row" : "Collapse Row"}
                  </button>

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
                      collapseStates = {collapseStates[rowIndex]}
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
    </PlannerContext.Provider>
  )
}

export default App;