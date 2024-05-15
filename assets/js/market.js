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

const db = firebase.firestore();
const database1 = firebase.database();
const storage = firebase.storage();

var agriAdviceDB = firebase.database().ref("Marketplace");
var agriAdviceDB1 = firebase.database().ref("Category");

function get() {
    var dataDisplay = document.getElementById('market');
    console.log("Before fetching data from Firebase");
    agriAdviceDB.on('value', (snapshot) => {
        const products = snapshot.val();
        console.log("Data fetched from Firebase");

        dataDisplay.innerHTML = ""; // Clear previous content

        for (const key in products) {
            const product = products[key];

            if (product.mTitle == 1) {

                console.log("mProduct:", product.mProduct);
                // Create a div for each product
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                productDiv.style.border = "1px solid";

                // Create and set content for the elements within the product div
                const mImage = document.createElement('img');
                mImage.src = product.unit;

                const mTitle = document.createElement('h3');
                mTitle.textContent = product.mPrice; // Assumes product.mPrice is a number

                // mTitle.style.marginLeft = "50px";
                // mTitle.style.marginRight = "50px";

                const mPrice = document.createElement('p');
                mPrice.textContent = "₱" + product.mCategory + ".00" + " / " + product.approve;

                // Create approve and decline buttons
                const approveButton = document.createElement('button');
                approveButton.textContent = 'Approve';
                approveButton.addEventListener('click', () => {
                    const productRef = agriAdviceDB.child(key);

                    // Update the 'isApproved' field to true
                    productRef.update({
                        mTitle: "2"
                    }).then(() => {
                        console.log(`Product ${key} approved`);
                    }).catch((error) => {
                        console.error("Error updating product:", error);
                    });

                });

                approveButton.style.background = '#008000';

                const declineButton = document.createElement('button');
                declineButton.textContent = 'Decline';
                declineButton.addEventListener('click', () => {
                    const productRef = agriAdviceDB.child(key);

                    // Update the 'isApproved' field to true
                    productRef.update({
                        mTitle: "3"
                    }).then(() => {
                        console.log(`Product ${key} approved`);
                    }).catch((error) => {
                        console.error("Error updating product:", error);
                    });

                });
                declineButton.style.background = '#ff0000';

                // Append elements to the product div
                productDiv.appendChild(mImage);
                productDiv.appendChild(mTitle);
                productDiv.appendChild(mPrice);
                productDiv.appendChild(approveButton);
                productDiv.appendChild(declineButton);

                // Append the product div to the market container
                dataDisplay.appendChild(productDiv);
            }
        }
    });
}
get();


function approve() {
    const Approved = document.getElementById('approved');
    console.log("Before fetching data from Firebase");
    agriAdviceDB.on('value', (snapshot) => {
        const products = snapshot.val();
        console.log("Data fetched from Firebase");

        Approved.innerHTML = "";

        for (const key in products) {
            const approveData = products[key];

            // Check if the product is approved before displaying
            if (approveData.mTitle == "2") {
                // Create a div for each product
                const approveDiv = document.createElement('div');
                approveDiv.classList.add('approveData');
                // Create and set content for the elements within the product div
                const mImage = document.createElement('img');
                mImage.src = approveData.unit;


                const mTitle = document.createElement('h3');
                mTitle.textContent = approveData.mPrice; // Assumes product.mPrice is a number


                const mPrice = document.createElement('p');
                mPrice.textContent = "₱" + approveData.mCategory + ".00" + " / " + approveData.approve;


                const mApproved = document.createElement('p');
                mApproved.textContent = " Approved ";

                mApproved.style.backgroundColor = "green";
                mApproved.style.color = "white";
                mApproved.style.paddingRight = "15px";
                mApproved.style.paddingLeft = "15px";
                mApproved.style.marginRight = "20px";


                // Append elements to the product div
                approveDiv.appendChild(mImage);
                approveDiv.appendChild(mTitle);
                approveDiv.appendChild(mPrice);
                approveDiv.appendChild(mApproved);

                // Append the product div to the market container
                Approved.appendChild(approveDiv);
            }
        }
    });
}

approve();

function decline() {
    var Declined = document.getElementById('declined');
    console.log("Before fetching data from Firebase");
    agriAdviceDB.on('value', (snapshot) => {
        const products = snapshot.val();
        console.log("Data fetched from Firebase");

        Declined.innerHTML = "";

        for (const key in products) {
            const declineData = products[key];

            // Check if the product is approved before displaying
            if (declineData.mTitle == 3) {
                // Create a div for each product
                const approveDiv = document.createElement('div');
                approveDiv.classList.add('declineData');



                // Create and set content for the elements within the product div
                const mImage = document.createElement('img');
                mImage.src = declineData.unit;


                const mTitle = document.createElement('h3');
                mTitle.textContent = declineData.mPrice; // Assumes product.mPrice is a number


                const mPrice = document.createElement('p');
                mPrice.textContent = "₱" + declineData.mCategory + ".00" + " / " + declineData.approve;


                const mApproved = document.createElement('p');
                mApproved.textContent = " Declined ";

                mApproved.style.backgroundColor = "red";
                mApproved.style.color = "white";
                mApproved.style.paddingRight = "15px";
                mApproved.style.paddingLeft = "15px";
                mApproved.style.marginRight = "20px";


                // Append elements to the product div
                approveDiv.appendChild(mImage);
                approveDiv.appendChild(mTitle);
                approveDiv.appendChild(mPrice);
                approveDiv.appendChild(mApproved);

                // Append the product div to the market container
                Declined.appendChild(approveDiv);
            }
        }
    });
}
decline();


const database = firebase.database();
function uploadText() {
    const textData = document.getElementById('textData').value;

    // Check if textData is provided
    if (textData) {
        // Push the text data to a new node in the Realtime Database
        const newRef = database.ref('Category').push();
        newRef.set({
            mCategory: textData
        })
            .then(() => {
                console.log('Text uploaded successfully');
                // Optionally, you can reset the form or perform other actions
                document.getElementById('textData').value = '';
            })
            .catch((error) => {
                console.error('Error uploading text: ', error);
            });
    } else {
        alert('Please enter text data.');
    }
}

function displayAllProducts() {
    var allProductsContainer = document.getElementById('allProducts');
    console.log("Before fetching data from Firebase");
    // Assuming agriAdviceDB is defined elsewhere
    agriAdviceDB.on('value', (snapshot) => {
        const products = snapshot.val();
        console.log("Data fetched from Firebase");

        allProductsContainer.innerHTML = "";

        for (const key in products) {
            const productData = products[key];

            // Create a div for each product
            const productDiv = document.createElement('div');
            productDiv.classList.add('productData');

            // Create and set content for the elements within the product div
            const mImage = document.createElement('img');
            mImage.classList.add('mImage');
            mImage.src = productData.unit;

            const mTitle = document.createElement('h3');
            mTitle.textContent = productData.mPrice; // Assumes product.mPrice is a number
            mTitle.style.fontSize = "12px"

            const mPrice = document.createElement('h3');
            mPrice.textContent = "₱" + productData.mCategory + ".00" + " / " + productData.approve;
            mPrice.style.fontSize = "12px"

            const mCateg = document.createElement('h3');
            mCateg.textContent = productData.vendor;
            mCateg.style.fontSize = "12px"

            const mName = document.createElement('h3');
            mName.textContent = productData.mProduct;
            mName.style.fontSize = "12px"

            const mApprovalStatus = document.createElement('h6');
            mApprovalStatus.textContent = productData.mTitle == 3 ? " Declined " : (productData.mTitle == 1 && productData.approve === "For Approval") ? " For Approval " : " Approved ";

            // Set the background color based on the conditions
            if (productData.mTitle == 3) {
                mApprovalStatus.style.backgroundColor = "red";
            } else if (productData.mTitle == 2) {
                mApprovalStatus.style.backgroundColor = "green";
            } else {
                mApprovalStatus.textContent = " For Approval ";
                mApprovalStatus.style.backgroundColor = "orange";
                mApprovalStatus.style.fontStyle = "bold";
            }

            mApprovalStatus.style.color = "white";
            mApprovalStatus.style.paddingRight = "15px";
            mApprovalStatus.style.paddingLeft = "15px";
            mApprovalStatus.style.paddingTop = "2px";
            mApprovalStatus.style.paddingBottom = "2px";
            mApprovalStatus.style.marginRight = "20px";
            mApprovalStatus.style.borderRadius = "3px";

            // Append elements to the product div
            productDiv.appendChild(mImage);
            productDiv.appendChild(mTitle);
            productDiv.appendChild(mPrice);
            productDiv.appendChild(mCateg);
            productDiv.appendChild(mName);
            productDiv.appendChild(mApprovalStatus);

            // Append the product div to the container
            allProductsContainer.appendChild(productDiv);
        }
    });
}

function filterProducts() {
    var input, filter, products, product, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    products = document.getElementById("allProducts");
    product = products.getElementsByClassName('productData');

    for (i = 0; i < product.length; i++) {
        txtValue = product[i].textContent || product[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            product[i].style.display = "";
        } else {
            product[i].style.display = "none";
        }
    }
}

displayAllProducts(); // Call the function to display all products initially
document.getElementById('searchInput').addEventListener('keyup', filterProducts);



// ======================== Display categories ==========================

function displayAllCategories() {
    var allAllCategories = document.getElementById('categResult');
    console.log("Before fetching data from Firebase");
    agriAdviceDB1.on('value', (snapshot) => {
        const categ = snapshot.val();
        console.log("Data fetched from Firebase");

        allAllCategories.innerHTML = "";

        for (const key in categ) {
            const categData = categ[key];

            // Create a div for each product
            const categDiv = document.createElement('div');
            categDiv.classList.add('categRe');

            const category = document.createElement('p');
            category.textContent = categData.mCategory; // Assumes product.mPrice is a number
            category.style.fontSize = "20px"

            // Append elements to the product div
            categDiv.appendChild(category);

            // Append the product div to the container
            allAllCategories.appendChild(categDiv);
        }
    });
}
displayAllCategories();




// ================= Search Products ====================================

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('searchProducts');

searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value;
    
    if (searchText === '') {
      clearSearchResults();
    } else {
      const searchResults = searchDatabase(searchText); // Perform case-insensitive search
    //   displaySearchResults(searchResults);
    }
  });

function searchDatabase(searchText) {
  // Clear previous search results
  searchResults.innerHTML = "";

  database1.ref('Marketplace')
    .orderByChild('mProduct')
    .startAt(searchText)
    .endAt(searchText + '\uf8ff')
    .once('value')
    .then(snapshot => {
      snapshot.forEach(childSnapshot => {

        const data = childSnapshot.val();
        
        document.getElementById('allProducts').style.display = 'none'
        // document.getElementById('searchResults').style.display = 'flex'
        // document.getElementById('showFormButton').style.display = 'none'

        const plantDiv = document.createElement('div');
        plantDiv.classList.add('divPlants'); 
        
        const plantDiv2 = document.createElement('div');
        plantDiv.classList.add('divPlant2');


        const icon = document.createElement('img');
        icon.src = data.unit;
        icon.classList.add('icons');

        const title = document.createElement('h2');
        title.textContent = data.mPrice;
        title.classList.add('titles');

        plantDiv.appendChild(icon);
        plantDiv.appendChild(title);
        plantDiv2.appendChild(plantDiv);

        searchResults.appendChild(plantDiv2);

        
      });
    })
    .catch(error => {
      console.error("Error searching database: ", error);
    });
}

function clearSearchResults() {
  searchResults.innerHTML = "";
}

// ============================ Menu =================================

function categ() {
    document.getElementById('productList').style.display="none";
    document.getElementById('categ').style.display="inline";
    document.getElementById('c-1').style.backgroundColor="#527a63";
    document.getElementById('c-1').style.color="white";
    document.getElementById('p-1').style.backgroundColor="#f0ffff";
    document.getElementById('p-1').style.color="black";
    document.getElementById('v-1').style.backgroundColor="#f0ffff";
    document.getElementById('v-1').style.color="black";
}
categ();

function product() {
    document.getElementById('categ').style.display="none";
    document.getElementById('productList').style.display="inline";
    document.getElementById('p-1').style.backgroundColor="#527a63";
    document.getElementById('p-1').style.color="white";
    document.getElementById('c-1').style.backgroundColor="#f0ffff";
    document.getElementById('c-1').style.color="black";
    document.getElementById('v-1').style.backgroundColor="#f0ffff";
    document.getElementById('v-1').style.color="black";
}
product();

function vendor() {
    document.getElementById('productList').style.display="none";
    document.getElementById('categ').style.display="none";
    document.getElementById('v-1').style.backgroundColor="#527a63";
    document.getElementById('v-1').style.color="white";
    document.getElementById('p-1').style.backgroundColor="#f0ffff";
    document.getElementById('p-1').style.color="black";
    document.getElementById('c-1').style.backgroundColor="#f0ffff";
    document.getElementById('c-1').style.color="black";
}
vendor();

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