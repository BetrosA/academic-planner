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


