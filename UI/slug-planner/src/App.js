// App.js

import React, { useState, useEffect } from "react";
import SchoolLogo from "./assets/Wide_Logo.png";
import "./App.css";

import { fetchDepartments, fetchCourses, fetchRequirements} from "./firebase";

const PlannerContext = React.createContext();

const generatePlanner = async (major, setPlanner, setRequirements) => {
  //major = major.replace(':', '')
  await fetch('http://localhost:5000/planner/'+ encodeURI(major), {
    method: 'get'
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      setPlanner(json);
      setRequirements(null)
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
  const {setPlanner, setRequirements} = React.useContext(PlannerContext)

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
  
    // Check if department selection has changed
    if (prevSelectedDivision !== name) {
      setSelectedDivision(name);
      setSelectedDepartment(null);
      setSelectedMajor(null); // Reset major when department changes
      setSelectedStartingYear(null); // Reset starting year when department changes
      setIsGenerated(false); // Set isGenerated to false if department changes
      setPrevSelectedDivision(name);
    }
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
    console.log(selectedMajor)
    selectedMajor === 'Computer Science B.S.' ? generatePlanner(selectedMajor, setPlanner, setRequirements) : 
      fetchRequirements(selectedMajor, selectedDivision, selectedDepartment, setRequirements, setPlanner)
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

function BottomSidebar({courses}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDragStart = (event, courseName, credits, genEd) => {
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("credits", credits);
    event.dataTransfer.setData("genEd", genEd);
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
        sortedCourses.map((course) => (
          <div
            key={course.coursename}
            className="draggable-course"
            draggable
            onDragStart={(event) => handleDragStart(event, course.coursename, course.credithours, course.genEd)}
          >
            {course.coursename}
          </div>
        ))}
    </div>
  );
}

function RequirementSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const {planner, requirements} = React.useContext(PlannerContext)
  const quarters = ['Fall', 'Winter', 'Spring']
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDragStart = (event, courseName, credits, genEd) => {
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("credits", credits);
    event.dataTransfer.setData("genEd", genEd);
  };

  if (requirements) {
    console.log(requirements)
    return (
      <div className="sidebar">
        <h2 className="sidebar-title">Required Courses</h2>
        {
          Object.keys(requirements).map((req) => (
            <div>
            <h3
              key={`title ${req}`}
              className="sidebar-font"
            >
              {req}
            </h3>
            {
              typeof requirements[req] == 'string'? <></> :
              Object.keys(requirements[req]).map((subReq) => (
                <div>
                <h4
                  key={`title ${subReq}`}
                  className="sidebarsub-font"
                >
                  {subReq}
                </h4>
                <div>
                {
                  Object.keys(requirements[req][subReq]).map((course) => (
                    <div>
                    {
                    requirements[req][subReq][course]['coursename'] ? 
                      <div
                        key={`title ${course}`}
                        className="draggable-course"
                        draggable
                        onDragStart={(event) => handleDragStart(event, 
                        requirements[req][subReq][course]['coursename'],
                        requirements[req][subReq][course]['credithours'], 
                        requirements[req][subReq][course]['genEd'])}
                      >
                        {
                          requirements[req][subReq][course]['coursename']
                        }
                      </div>
                    :
                     <>
                     <h4>
                     {requirements[req][subReq][course]['name']}
                     </h4>
                      {
                        requirements[req][subReq][course]['coursename'] ? requirements[req][subReq][course]['coursename'] : 
                        Object.keys(requirements[req][subReq][course]).map((subCourses) => ( 
                          <div>
                            {subCourses === 'choose' ? `Select ${requirements[req][subReq][course][subCourses]}` :
                            <div>
                              {
                                subCourses === 'courses' ? 
                                Object.keys(requirements[req][subReq][course][subCourses]).map((subCourse) => (
                                  <div>
                                    {requirements[req][subReq][course][subCourses][subCourse]['coursename'] ? 
                                    <div
                                      key={`title ${requirements[req][subReq][course][subCourses][subCourse]['coursename']} ${Math.random()}`}
                                      className="draggable-course"
                                      draggable
                                      onDragStart={(event) => handleDragStart(event, 
                                        requirements[req][subReq][course][subCourses][subCourse]['coursename'],
                                        requirements[req][subReq][course][subCourses][subCourse]['credithours'], 
                                        requirements[req][subReq][course][subCourses][subCourse]['genEd'])}
                                    >
                                    {
                                      requirements[req][subReq][course][subCourses][subCourse]['coursename']
                                    }
                                    </div>
                                    : <></>}                
                                  </div>
                                ))
                                : 
                                <div>{subCourses === 'name' ? subCourses: ''}</div>
                              }
                            </div>  
                            }
                          </div>
                        ))
                        }
                     </>
                    }
                    </div>
                  ))
                }
                </div>
                </div>
              ))
            }
            </div>
          ))}
      </div>
    )
  }
  else {
    return (
      <div className="bottom-sidebar">
        <h2 className="sidebar-title">Recommended Planner</h2>
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
          planner?.map((_, year) => (
            <div key={year}>
            <div
              key={`title ${year}`}
              className="sidebar-title"
              draggable
            >
              {`Year ${year + 1}`}
            </div>
            {
              quarters?.map((name) => (
              <div key={`title ${name}`}>
              <div
                key={`Year ${year} Quarter ${name}`}
                className="sidebar-title"
                draggable
              >
                {name}
              </div>
              {
                planner[year][name]?.map((course) => (
                <div
                  key={course.coursename}
                  className="draggable-course"
                  draggable
                  onDragStart={(event) => handleDragStart(event, course.coursename, course.credithours, course.genEd)}
                >
                  {course.coursename}
                  </div>
              ))}
              </div>
            ))}
            </div>
          ))}
      </div>
    );
  }
}

function QuarterBox({row,  column, selectedStartingYear,  allDroppedCourses,  setAllDroppedCourses, setCourses, GE_Check, setGE_Check, collapseState}) {
  const [droppedCourses, setDroppedCourses] = useState([]);
  const [quarterCredits, setQuarterCredits] = useState(0);

  const handleDrop = (event) => {
    event.preventDefault();
    const courseName = event.dataTransfer.getData("courseName");
    const courseCredits = event.dataTransfer.getData("credits");
    const genEd = event.dataTransfer.getData("genEd");

    /*console.log("HandleDrop");
    console.log("Name:", courseName);
    console.log("Credits:", courseCredits);
    console.log("GE:", genEd);*/

    const course = {
      coursename: courseName,
      credits: courseCredits,
      genEd: genEd
    };

    const credits = parseInt(courseCredits.split(" ")[1]);
    const genEdCode = genEd.includes("none") ? "none" : genEd.split(" ").pop();

    const isDuplicate = allDroppedCourses.some(
      (droppedCourse) => droppedCourse.coursename === courseName
    );

    if (!isDuplicate && courseName.trim() !== "") {
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
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveCourse = (courseName, courseCredits, genEd) => {
    /*console.log("RemoveCourse:");
    console.log("Name:", courseName);
    console.log("Credits:", courseCredits);
    console.log("GenED:", genEd);*/
    
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
    const removedCourse = { coursename: courseName, credithours: courseCredits, genEd: genEd };
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses];
      updatedCourses.push(removedCourse);
      return updatedCourses.sort(); // Sort the updated courses array
    });
  };

  const handleCourseDragStart = (event, courseName, courseCredits, genEd) => {
    /*console.log("DragCourse:");
    console.log("Name:", courseName);
    console.log("Credits:", courseCredits);
    console.log("GenED:", genEd);*/
    event.dataTransfer.setData("courseName", courseName);
    event.dataTransfer.setData("credits", courseCredits);
    event.dataTransfer.setData("genEd", genEd);
    setTimeout(() => {
      handleRemoveCourse(courseName, courseCredits, genEd);
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
                  handleCourseDragStart(event, course.coursename, course.credits, course.genEd)
                }
              >
                <button
                  className="remove-course-button"
                  onClick={() => handleRemoveCourse(course.coursename, course.credits, course.genEd)}
                >
                  x
                </button>
                <span>{course.coursename}</span>
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
  //const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedStartingYear, setSelectedStartingYear] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [allDroppedCourses, setAllDroppedCourses] = useState([]);
  const [planner, setPlanner] = useState(null);
  const [totalYears, setTotalYears] = useState(4);
  const [requirements, setRequirements] = useState(null);
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
    <PlannerContext.Provider value={{planner, setPlanner, setRequirements, requirements}} >
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
              <RequirementSidebar />
              <BottomSidebar courses={courses} />
            </div>
            <div className="bottom-half">
              <div>
                <h2>GE requirements</h2>
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