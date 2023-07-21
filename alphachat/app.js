import {
  auth,
  app,
  db,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getAuth,
  createUserWithEmailAndPassword,
  query,
  where,
  getDocs,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  Timestamp,
} from "./firebaseConfig.js";

// connect to firebase
//signup
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const date = document.getElementById("date");

signupBtn.addEventListener("click", signupHandler);
function signupHandler() {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      addData(user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}
async function addData(uid) {
  try {
    await setDoc(doc(db, "users", uid), {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      id: uid,
      date: date.value,
      time: Timestamp.fromDate(new Date().getTime()),
    });
    console.log("data added");
  } catch (error) {
    console.log(error, "data not added");
  }
}
//signin

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const signinBtn = document.getElementById("signinbtn");
// console.log(signinBtn);

// form layout handler
const gotoLoginPage = document.getElementById("gotoLoginPage");
const gotoSignupPage = document.getElementById("gotoSignupPage");
// console.log(gotoLoginPage);
const loginArea = document.querySelector(".login");
const signArea = document.querySelector(".signup");

gotoLoginPage.addEventListener("click", hiddenHandler);

function hiddenHandler() {
  // console.log("function work")
  signArea.classList.add("hidden");
}

gotoSignupPage.addEventListener("click", showHandler);

function showHandler() {
  console.log("function work");
  signArea.classList.remove("hidden");
} //compelete

// Signed in
signinBtn.addEventListener("click", signinHandler);
function signinHandler() {
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user) {
        window.location.href = "./dashboard/index.html";
      }
      console.log(user, "user logged in");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}
