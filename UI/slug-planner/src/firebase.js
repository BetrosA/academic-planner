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
  const departmentsRef = ref(db, 'departments/');
  onValue(departmentsRef, (snapshot) => {
    const departments = snapshot.val();
    setDepartments(departments);
  });
};

export const fetchCourses = (setCourses) => {
  const coursesRef = ref(db, 'courses/');
  onValue(coursesRef, (snapshot) => {
    const courses = snapshot.val();
    setCourses(courses);
  });
};
