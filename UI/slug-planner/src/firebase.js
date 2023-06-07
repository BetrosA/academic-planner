import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue,set  } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


// Your web app's Firebase configuration
// export const firebaseConfig
export const firebaseConfig = {
  apiKey: "AIzaSyAhbkR0YuuZ6wxfJorjQM9E0_Zk-Xd_07c",
  authDomain: "academicplanner-c85a5.firebaseapp.com",
  projectId: "academicplanner-c85a5",
  storageBucket: "academicplanner-c85a5.appspot.com",
  messagingSenderId: "140722490209",
  appId: "1:140722490209:web:db284cc06805b892f31320",
  measurementId: "G-FF5C5RSY0G"
};


export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info.
    const user = result.user;
    return user;
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorCode, errorMessage, email, credential);
    return null;
  }
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const saveUserData = (userData) => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  set(ref(db, `users/${userId}`), userData);
};

export const getUserData = () => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const userRef = ref(db, `users/${userId}`);
  let userData = null;
  onValue(userRef, (snapshot) => {
    userData = snapshot.val();
  });
  return userData;
};

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
    const filteredCourses = Object.values(courses).filter(course => course.quarteroffered !== "none");
    setCourses(filteredCourses);
  });
};

export const fetchQuartersOffered = (setQuartersOffered) => {
  const quartersOfferedRef = ref(db, 'quarteroffered/');
  onValue(quartersOfferedRef, (snapshot) => {
    const quartersOffered = snapshot.val();
    setQuartersOffered(quartersOffered);
  });
};