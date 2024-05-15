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
const storage = firebase.storage();
const database = firebase.database();

// ================ Add News ===========================


const image = document.querySelector(".images");
const metaData2 = document.querySelector(".metaData2");
const imageDa = document.querySelector(".imageDa");
let files;


const getImageData = (e) => {
    files = e.target.files;
    for (let index = 0; index < files.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "imageContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files[index]);
        imageData.appendChild(image);

        const deselectButton = document.createElement("img");
        deselectButton.className = "deselectButton";
        deselectButton.src = '/assets/img/delete1.png';
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };
        imageData.appendChild(deselectButton);

        imageDa.appendChild(imageData);
    }
}

const selectImage = () => {
    image.click();
}

// ========================= Reset ============================

function resetForm() {
    // Reset the values of input fields in the form
    addPlantForm.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });

    // Reset the displayed image data for the additional images
    const imageDataSpan = document.querySelector('.imageDa');
    imageDataSpan.textContent = "";

}

const addPlantForm = document.getElementById('addNews');
document.getElementById('showFormButton').addEventListener('click', function () {
    addPlantForm.style.display = 'inline';
    document.getElementById('sidebar').style.filter = "blur(5px)";
    document.getElementById('sidebar1').style.filter = "blur(5px)";
});
document.getElementById('close').addEventListener('click', function () {
    addPlantForm.style.display = 'none';
    document.getElementById('sidebar').style.filter = "none";
    document.getElementById('sidebar1').style.filter = "none";
    resetForm();
});

// ======================= Upload to Firebase ================================

// Function to upload data to Firebase
function uploadData() {
    // Get the title
    var title = document.getElementById('identification').value;
    // Get the file input element
    var input = document.getElementById('images');
    var imageFiles = input.files;

    // Get the current date
    var currentDate = new Date();
    var currentDateNumber = currentDate.getDate(); // Day of the month (1-31)
    var currentMonth = currentDate.getMonth() + 1; // Month (0-11)
    var currentYear = currentDate.getFullYear(); // Full year (YYYY)

    // Format the date
    var formattedDate = `${currentMonth}/${currentDateNumber}/${currentYear}`;

    // Get the current time
    var currentHours = currentDate.getHours(); // Hour (0-23)
    var amOrPm = currentHours >= 12 ? 'PM' : 'AM';
    var currentHour12 = currentHours % 12 || 12; // Convert to 12-hour format
    var currentMinutes = currentDate.getMinutes(); // Minutes (0-59)
    var currentSeconds = currentDate.getSeconds(); // Seconds (0-59)

    // Format the time
    var formattedTime = `${currentHour12}:${currentMinutes}:${currentSeconds} ${amOrPm}`;

    // Array to store promises for image uploads
    var uploadPromises = [];

    // Upload each image file to Firebase Storage
    for (var i = 0; i < imageFiles.length; i++) {
        var imageFile = imageFiles[i];
        var imageName = imageFile.name;
        var storageRef = firebase.storage().ref('images/' + imageName);
        var uploadTask = storageRef.put(imageFile);

        // Push the promise for this upload to the array
        uploadPromises.push(uploadTask);
    }

    // Resolve all promises once all uploads are complete
    Promise.all(uploadPromises).then(function (snapshot) {
        // Array to store image download URLs
        var imageUrls = [];

        // Get the download URL for each uploaded image
        snapshot.forEach(function (childSnapshot) {
            childSnapshot.ref.getDownloadURL().then(function (downloadURL) {
                // Push the download URL to the array
                imageUrls.push(downloadURL);

                // Check if all image URLs are obtained
                if (imageUrls.length === imageFiles.length) {
                    // Create the data object to be stored in the database
                    var postData = {
                        title: title,
                        imageUrls: imageUrls,
                        uploadDate: formattedDate, // Adding formatted date
                        uploadTime: formattedTime // Adding formatted time
                    };

                    var postId = database.ref().child('News').push().key;
                    database.ref('News/' + postId).set(postData).then(function () {
                        console.log('Data uploaded successfully!');
                    }).catch(function (error) {
                        console.error('Error uploading data: ', error);
                    });
                }
            });
        });
    }).catch(function (error) {
        console.error('Error uploading images: ', error);
    });
}



//   ====================== Display News ============================

function retrieveAndDisplayData() {
    var postsRef = database.ref('News');

    var postsContainer = document.getElementById('postsContainer');

    postsRef.on('value', function (snapshot) {
        postsContainer.innerHTML = '';

        snapshot.forEach(function (childSnapshot) {
            var postData = childSnapshot.val();
            var title = postData.title;
            var imageUrls = postData.imageUrls;

            var postDiv = document.createElement('div');
            postDiv.classList.add('post');

            var postDiv2 = document.createElement('div');
            postDiv.classList.add('post2');

            var imagesDiv = document.createElement('div');
            postDiv.classList.add('imagesDiv');

            var titleElement = document.createElement('h3');
            titleElement.textContent = title;
            titleElement.classList.add('titleElement');

            var titleElement2 = document.createElement('h3');
            titleElement2.textContent = "sdasd";
            titleElement2.classList.add('t2');

            var titleElement3 = document.createElement('h3');
            titleElement3.textContent = "sdasd";
            titleElement3.classList.add('t2');
            
            postDiv.appendChild(titleElement);

            imageUrls.forEach(function (imageUrl) {
                var imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.classList.add('post-image');

                imagesDiv.appendChild(imgElement);
            });

            postDiv2.appendChild(titleElement);
            postDiv2.appendChild(imagesDiv);
            postDiv.appendChild(postDiv2);
            postsContainer.appendChild(titleElement3);
            postsContainer.appendChild(postDiv);
            postsContainer.appendChild(titleElement2);
        });
    });
}

retrieveAndDisplayData();

function logoutUser() {
    firebase.auth().signOut().then(() => {
        alert("Logout successful!");
        window.location.href = "login.html"; 
    }).catch((error) => {
        alert("Logout failed: " + error.message);
    });
}

document.getElementById("logoutButton").addEventListener("click", function () {
    logoutUser();
});

function preventBack() {
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function () {
      history.pushState(null, document.title, location.href);
    });
  }
  
  window.onload = function() {
    preventBack();
  }
