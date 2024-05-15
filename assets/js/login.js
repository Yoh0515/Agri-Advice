const firebaseConfig = {
    apiKey: "AIzaSyAxiXl5E5pDxFkgJFLo59relkrRkBdRv_U",
    authDomain: "final-database-9493d.firebaseapp.com",
    databaseURL: "https://final-database-9493d-default-rtdb.firebaseio.com",
    projectId: "final-database-9493d",
    storageBucket: "final-database-9493d.appspot.com",
    messagingSenderId: "798360016853",
    appId: "1:798360016853:web:b39e41d841cbc3ba4acf5c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function loginUser(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      user.reload().then(() => {
        if (user.emailVerified) {
          redirectToPlantPage();
        } else {
          showEmailNotVerifiedAlert();
        }
      });
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
}

function showVerificationAlert() {
  document.querySelector('.alert').style.display = 'flex';
  document.querySelector('.main').style.filter = "blur(2px)";
  const alertButton = document.querySelector('.button');
  alertButton.addEventListener("click", function() {
    document.querySelector('.alert').style.display = 'none';
    document.querySelector('.main').style.filter = "none";
  });
}

function redirectToPlantPage() {
  window.location.href = "index.html";
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();
  var email = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  loginUser(email, password);
});

// document.title = "Agri-Advice";
// var pageTitle = document.title;

// location.href = "login.html";
// var currentURL = location.href;


// window.onload = function() {
//   history.pushState(null, pageTitle, currentURL);
//   window.addEventListener('popstate', function () {
//     history.pushState(null, pageTitle, currentURL);
//   });
// };