  import { initializeApp } from "firebase/app";
  import { getAuth, RecaptchaVerifier } from "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyCas9eW65qKZw809Vm5WvTCuVnUD_7um44",
    authDomain: "doxbox-4b5ab.firebaseapp.com",
    projectId: "doxbox-4b5ab",
    storageBucket: "doxbox-4b5ab.appspot.com", 
    messagingSenderId: "325542267645",
    appId: "1:325542267645:web:68856aa620ae8061ebcc94",
    measurementId: "G-Y8JPRLCF6J"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  export { auth, RecaptchaVerifier };
  export default app;
