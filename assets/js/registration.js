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


  function registerUser(username, email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        user.sendEmailVerification().then(() => {
          firebase.database().ref('Admin/' + user.uid).set({
            username: username,
            email: email,
            password: password
          }).then(() => {
            document.querySelector('.alert').style.display = 'flex';
            document.querySelector('.main').style.filter = "blur(2px)";
            //alert("Registration successful! A verification email has been sent to your email address. Please verify your email before logging in.");
          }).catch((error) => {
            alert("Registration successful, but failed to upload username: " + error.message);
          });
        }).catch((error) => {
          alert("Failed to send verification email: " + error.message);
        });
      })
      .catch((error) => {
        var errorMessage = error.message;
        alert("Registration failed: " + errorMessage);
      });
  }

  document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault(); 

    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    registerUser(username, email, password);
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.reload().then(() => {
        if (user.emailVerified) {
          const alert2 = document.querySelector('.button');
          alert2.addEventListener("click", function(){
            document.querySelector('.alert').style.display = 'none';
            document.querySelector('.main').style.filter = "none";
            window.location.href = "index.html";
          });
        }
      });
      
    }
  });


  // function registerUser(username, email, password) {
  //   firebase.auth().createUserWithEmailAndPassword(email, password)
  //     .then((userCredential) => {
  //       var user = userCredential.user;
  //       user.sendEmailVerification().then(() => {
  //         firebase.database().ref('Admin/' + user.uid).set({
  //           username: username,
  //           email: email,
  //           password: password
  //         }).then(() => {
  //           alert("Registration successful! A verification email has been sent to your email address. Please verify your email before logging in.");
  //           // document.querySelector('.alert').style.display = 'flex';
  //           // document.querySelector('.main').style.filter = "blur(2px)";
  //           // window.location.href = "plant.html"; 
  //         }).catch((error) => {
  //           alert("Registration successful, but failed to upload username: " + error.message);
  //         });
  //       }).catch((error) => {
  //         alert("Failed to send verification email: " + error.message);
  //       });
  //     })
  //     .catch((error) => {
  //       var errorMessage = error.message;
  //       alert("Registration failed: " + errorMessage);
  //     });
  // }

  // const alert2 = document.querySelector('.button');
  // alert2.addEventListener("click", function(){
  //   window.location.href = "plant.html";
  // });

  // document.getElementById("registrationForm").addEventListener("submit", function (event) {
  //   event.preventDefault(); 

  //   var username = document.getElementById("username").value;
  //   var email = document.getElementById("email").value;
  //   var password = document.getElementById("password").value;

  //   registerUser(username, email, password);
  // });