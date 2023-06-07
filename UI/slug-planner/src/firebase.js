import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhbkR0YuuZ6wxfJorjQM9E0_Zk-Xd_07c",
  authDomain: "academicplanner-c85a5.firebaseapp.com",
  projectId: "academicplanner-c85a5",
  storageBucket: "academicplanner-c85a5.appspot.com",
  messagingSenderId: "140722490209",
  appId: "1:140722490209:web:db284cc06805b892f31320",
  measurementId: "G-FF5C5RSY0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const fetchDepartments = (setDepartments) => {
  const departmentsRef = ref(db, 'department-majors/');
  onValue(departmentsRef, (snapshot) => {
    const departments = snapshot.val();
    setDepartments(departments);
  });
};


/*export const fetchCourses = (setCourses) => {
  const departmentsRef = ref(db, 'all_Majors/CSEcourses');
  onValue(departmentsRef, (snapshot) => {
    const departments = snapshot.val();
    setCourses(departments);
  });
}; */
export const fetchCourses = (setCourses) => {
  const allMajorsRef = ref(db, 'all_Majors/');

  let combinedData = [];

  onValue(allMajorsRef, (snapshot) => {
    const allMajors = snapshot.val();
    if (allMajors) {
      const folderPromises = Object.keys(allMajors).map((folder) => {
        const coursesRef = ref(db, `all_Majors/${folder}/`);
        return new Promise((resolve, reject) => {
          onValue(coursesRef, (snapshot) => {
            const courses = snapshot.val();
            if (courses) {
              const filteredCourses = Object.values(courses).filter(course => course.quarteroffered !== "none");
              combinedData.push(...filteredCourses);
            }
            resolve();
          });
        });
      });

      Promise.all(folderPromises).then(() => {
        const uniqueCourses = Array.from(new Set(combinedData.map(course => course.coursename))).map(coursename => {
          return combinedData.find(course => course.coursename === coursename);
        });
        setCourses(uniqueCourses);
      });
    }
  });
};

export const fetchRequirements = (majorName, selectedDivision, selectedDepartment, setRequirements, setPlanner) => {

  const requirementsRef = ref(db, 'department-majors/');
  let major = null
  onValue(requirementsRef, (snapshot) => {
    // find major
    snapshot.forEach(function(childSnapshot) {
      let childData = childSnapshot.val();
      if (childData.Department === selectedDivision) {
        const foundsubDepartment = childData.subdepartment?.find(element => (element.name === selectedDepartment));
        major = foundsubDepartment.majors?.find(element => (element.majorname === majorName))
      }
    });
    const courseNumber = /[A-Z]+ [0-9]+[A-z]?/g
      
    let prev = null
    let courseRef = null
    
    // for each requirement in major
    for (let requirement in major) {
      if (requirement !== 'majorname') {
        let coursesArray = []

        // each section in major req
        for (let section in major[requirement]) {
          
          // more subsections in major req section
          if (Array.isArray(major[requirement][section])) {
            for (let courses in major[requirement][section]) {
              
              // if element is string, then replace with course object
              if (typeof major[requirement][section][courses] === 'string') {

                // do not ref again if prev is same course name
                if (!prev || prev !== major[requirement][section][courses].split(" ")[0]) {
                  courseRef = ref(db, `all_Majors/${(major[requirement][section][courses].split(" ")[0])}courses/`);
                  prev = major[requirement][section][courses].split(" ")
                }
                onValue(courseRef, (snapshot) => {
                  const coursesList = snapshot.val();
                  const found = coursesList?.find(element => (element['coursename'].match(courseNumber))[0] === major[requirement][section][courses]);

                  // replaces course with course object
                  if (found)  major[requirement][section][courses] = (found)
                })
              }
              // repeat same thing with next level
              else { 
                for (let otherCourses in major[requirement][section][courses]) {
                  if (otherCourses !== 'name' && otherCourses !== 'count' && otherCourses !== 'choose') {
                    let crses = major[requirement][section][courses][otherCourses]
                    for (let course in crses) {
                      if (typeof crses[course] === 'string') {
                        if (!prev || prev !== crses[course].split(" ")[0]) {
                          courseRef = ref(db, `all_Majors/${(crses[course].split(" ")[0])}courses/`);
                          prev = crses[course].split(" ")
                        }
                        onValue(courseRef, (snapshot) => {
                          const coursesList = snapshot.val();
                          const found = coursesList?.find(element => (element['coursename'].match(courseNumber))[0] === crses[course]);
                          if (found)  major[requirement][section][courses][otherCourses][course] = (found)
                        })
                        // repeat
                      } else {
                        for (let obj in crses[course]) {
                          if (Array.isArray(crses[course][obj])) {
                            for (let subCourses in crses[course][obj]) {
                              if (!prev || prev !== crses[course][obj][subCourses].split(" ")[0]) {
                                courseRef = ref(db, `all_Majors/${(crses[course][obj][subCourses].split(" ")[0])}courses/`);
                                prev =crses[course][obj][subCourses].split(" ")
                              }
                              onValue(courseRef, (snapshot) => {
                                const coursesList = snapshot.val();
                                const found = coursesList?.find(element => (element['coursename'].match(courseNumber))[0] === crses[course]);
                                if (found)  major[requirement][section][courses][otherCourses][course][obj][subCourses] = (found)
                              })
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (coursesArray.length) major[requirement] = coursesArray
      }
    }
    
  })
  setRequirements(major)
  setPlanner(null)
};
