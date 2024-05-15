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
const agriAdviceDB = database.ref('plants');


const plantsContainer = document.getElementById('plants-container');
const plantsContainer2 = document.getElementById('plants-remove');

const detailDisplay = document.getElementById('detail-display');
const addButton = document.getElementById('showFormButton');
const background = document.getElementById('background');
const background2 = document.getElementById('background2');

const progress = document.getElementById('progress');
const percentage = document.getElementById('percentage');

// =================== UPLOAD TO FIREBASE ================================

function uploadData() {

    const bar = document.getElementById('uploadBar');
    bar.style.display = "inline";

    const title = document.getElementById('title').value;
    const archieve = document.getElementById('archieve').value = false;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const dept = document.getElementById('dept').value;
    const water = document.getElementById('water').value;
    const sun = document.getElementById('sun').value;
    const temp = document.getElementById('temp').value;
    const grow = document.getElementById('grow').value;
    const planting = document.getElementById('planting').value;
    const feed = document.getElementById('feed').value;
    const harv = document.getElementById('harv').value;
    const stor = document.getElementById('stor').value;
    const rangeValue = document.getElementById('rangeValue').textContent;


    // Get file objects for icon and images
    const iconFile = document.getElementById('icon').files[0];
    const imageFiles = Array.from(document.getElementById('images').files); // Convert FileList to Array

    // Create a storage reference
    const storageRef = firebase.storage().ref();

    // Upload icon
    const iconRef = storageRef.child('icons/' + iconFile.name);
    const iconUploadTask = iconRef.put(iconFile);
    let iconUrl; // Define iconUrl variable outside the upload task
    let plantIcon;

    // Set up progress bar for icon upload
    iconUploadTask.on('state_changed',
        function (snapshot) {
            // Calculate progress percentage
            const progressPercentage = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log('Upload is ' + progressPercentage + '% done');

            // Update progress bar
            percentage.innerHTML = progressPercentage + "%";
            progress.style.width = progressPercentage + "%";
        },
        function (error) {
            // Handle unsuccessful uploads
            console.error('Error uploading icon:', error);
        },
        function () {
            // Handle successful upload
            // Get download URL for the uploaded icon
            iconRef.getDownloadURL().then((url) => {
                iconUrl = url; // Store the download URL in iconUrl variable
                plantIcon = iconUrl;
            }).catch(error => {
                console.error('Error getting icon download URL:', error);
            });
        }
    );

    // Similarly, set up progress bar for image upload
    const imageUploadPromises = imageFiles.map(imageFile => {
        const imageRef = storageRef.child('images/' + imageFile.name);
        const imageUploadTask = imageRef.put(imageFile);

        return new Promise((resolve, reject) => {
            imageUploadTask.on('state_changed',
                function (snapshot) {
                    // Calculate progress percentage// Calculate progress percentage and round down to the nearest whole number
                    const progressPercentage = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

                    console.log('Upload is ' + progressPercentage + '% done');

                    // Update progress bar
                    percentage.innerHTML = progressPercentage + "%";
                    progress.style.width = progressPercentage + "%";
                },
                function (error) {
                    // Handle unsuccessful uploads
                    console.error('Error uploading image:', error);
                    reject(error);
                },
                function () {
                    // Handle successful upload
                    resolve(imageRef.getDownloadURL()); // Resolve with the download URL
                }
            );
        });
    });

    // Wait for all image uploads to complete
    Promise.all([iconUploadTask, ...imageUploadPromises])
        .then((downloadUrls) => {
            // All uploads completed successfully, proceed with adding data to database

            // Extracting plant data
            const plantTitle = title; // Store the plant title
            const plantIcon = iconUrl; // Store the plant icon URL

            // Process pests data
            const selectedPests = Array.from(document.querySelectorAll('.selectedPests'));
            const pestsData = selectedPests.map((pestDiv) => {
                const iconUrl = pestDiv.querySelector('.selectedIcon').src;
                const title = pestDiv.querySelector('.selectedTitle').textContent;
                return { iconUrl, title, plantTitle, plantIcon };
            });

            // Process diseases data
            const selectedDisease = Array.from(document.querySelectorAll('.selectedDisease'));
            const diseaseData = selectedDisease.map((diseaseDiv) => {
                const iconUrl = diseaseDiv.querySelector('.selectedIcon').src;
                const title = diseaseDiv.querySelector('.selectedTitle').textContent;
                return { iconUrl, title, plantTitle, plantIcon }; // Assign plant title and icon to each disease
            });

            // Get the array of image download URLs
            const imageUrls = downloadUrls.slice(1); // Exclude the first download URL which is for the icon

            pestsData.forEach(pest => {
                pest.plantTitle = title;
                pest.plantIcon = iconUrl;
            });

            diseaseData.forEach(disease => {
                disease.plantTitle = title;
                disease.plantIcon = iconUrl;
            });

            const database = firebase.database();
            const pestRef = database.ref('Pest');
            const diseaseRef = database.ref('Disease');

            // // Update Pest node
            // pestRef.once('value', snapshot => {
            //     console.log("Debug: Processing Pest node");
            //     snapshot.forEach(childSnapshot => {
            //         const childData = childSnapshot.val();
            //         if (childData.title === title) {
            //             console.log("Debug: Found matching title in Pest node");
            //             childSnapshot.ref.update({
            //                 plantTitle: plantTitle,
            //                 plantIcon: plantIcon
            //             }).then(() => {
            //                 console.log("Debug: Updated Pest node successfully");
            //             }).catch(error => {
            //                 console.error("Error updating Pest node:", error);
            //             });
            //         }
            //     });
            // });

            // // Update Disease node
            // diseaseRef.once('value', snapshot => {
            //     console.log("Debug: Processing Disease node");
            //     snapshot.forEach(childSnapshot => {
            //         const childData = childSnapshot.val();
            //         if (childData.title === title) {
            //             console.log("Debug: Found matching title in Disease node");
            //             childSnapshot.ref.update({
            //                 plantTitle: plantTitle,
            //                 plantIcon: plantIcon
            //             }).then(() => {
            //                 console.log("Debug: Updated Disease node successfully");
            //             }).catch(error => {
            //                 console.error("Error updating Disease node:", error);
            //             });
            //         }
            //     });
            // });


            agriAdviceDB.push({
                title: title,
                category: category,
                description: description,
                depth: dept,
                water: water,
                sun: sun,
                temperature: temp,
                grow: grow,
                planting: planting,
                feed: feed,
                harvest: harv,
                storage: stor,
                rangeValue: rangeValue,
                icon: iconUrl,
                images: imageUrls,
                pests: pestsData,
                disease: diseaseData,
                archieve: archieve,
            }).then(() => {

                document.getElementById('uploadBar').style.display = "none";


                console.log('Data uploaded successfully');
                const addPlantForm2 = document.getElementById('add_plant');
                const alert = document.getElementById('alert');
                document.getElementById('sidebar').style.filter = "none";
                document.getElementById('sidebar1').style.filter = "none";
                document.getElementById('sidebar').style.filter = "blur(5px)";
                document.getElementById('sidebar1').style.filter = "blur(5px)";
                addPlantForm2.style.display = 'none';
                alert.style.display = 'inline';
                document.getElementById('okayButton').addEventListener('click', function () {
                    alert.style.display = 'none';
                    document.getElementById('sidebar').style.filter = "none";
                    document.getElementById('sidebar1').style.filter = "none";
                });
            }).catch(error => {
                console.error('Error uploading data:', error);
            });
        })
        .catch(error => {
            console.error('Error uploading images:', error);
        });
}


// ===================== Category =================================

document.addEventListener('DOMContentLoaded', function () {
    const categoryContainer = document.getElementById('categoryContainer');
    const input = document.getElementById('category');

    input.addEventListener('click', function () {
        if (categoryContainer.style.display === 'block') {
            categoryContainer.style.display = 'none';
        } else {
            categoryContainer.style.display = 'block';
        }
    });

    function allCategory() {
        agriAdviceDB.once('value').then(snapshot => {
            const plants = snapshot.val(); 
            const categories = Object.values(plants).map(plant => plant.category);

            const uniqueCategories = Array.from(new Set(categories));

            categoryContainer.innerHTML = '';

            uniqueCategories.forEach(category => {
                const categoryElement = document.createElement('li');
                categoryElement.textContent = category;
                categoryElement.classList.add('categoryElement');
                categoryContainer.appendChild(categoryElement);

                categoryElement.addEventListener('contextmenu', function (event) {
                    event.preventDefault(); 

                    const removeOption = document.createElement('div');
                    removeOption.textContent = 'Remove';
                    removeOption.classList.add('removeOption');

                    removeOption.style.position = 'absolute';
                    removeOption.style.left = `${event.pageX}px`;
                    removeOption.style.top = `${event.pageY}px`;

                    // Remove the category on click
                    removeOption.addEventListener('click', function () {
                        // Code to remove the category here
                        categoryContainer.removeChild(categoryElement);
                        // Additional code to handle removal from database if needed
                    });

                    // Append the remove option to the body
                    document.body.appendChild(removeOption);

                    // Remove the remove option when clicked outside
                    document.addEventListener('click', function () {
                        document.body.removeChild(removeOption);
                    }, { once: true });
                });

                // Add event listener to each category element for left-click
                categoryElement.addEventListener('click', function () {
                    // Set input value to the clicked category
                    input.value = category;
                    categoryContainer.style.display = "none";
                });
            });
        }).catch(error => {
            console.error('Error retrieving data:', error);
        });
    }

    // Call the function to populate categories
    allCategory();
});

document.addEventListener('DOMContentLoaded', function () {
    const categoryDepth = document.getElementById('categorydepth');
    const input = document.getElementById('dept1');

    input.addEventListener('click', function () {
        if (categoryDepth.style.display === 'block') {
            categoryDepth.style.display = 'none';
        } else {
            categoryDepth.style.display = 'block';
        }
    });
});


// ================= Search Plants ====================================

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value;

    if (searchText === '') {
        clearSearchResults();
    } else {
        const searchResults = searchDatabase(searchText); // Perform case-insensitive search
        //displaySearchResults(searchResults);
    }
});

function searchDatabase(searchText) {
    // Clear previous search results
    searchResults.innerHTML = "";

    database.ref('plants')
        .orderByChild('title')
        .startAt(searchText)
        .endAt(searchText + '\uf8ff')
        .once('value')
        .then(snapshot => {
            snapshot.forEach(childSnapshot => {

                const data = childSnapshot.val();

                document.getElementById('plants-container').style.display = 'none'
                document.getElementById('searchResults').style.display = 'flex'
                document.getElementById('showFormButton').style.display = 'none'


                const plantDiv = document.createElement('div');
                plantDiv.classList.add('divPlants');

                const plantDiv2 = document.createElement('div');
                plantDiv2.classList.add('divPlant2');

                const plantImg = document.createElement('div');
                plantImg.classList.add('divImg');

                const plantImg2 = document.createElement('div');
                plantImg2.classList.add('divImg2');

                const icon = document.createElement('img');
                icon.src = data.icon;
                icon.classList.add('icons4');

                const title = document.createElement('h2');
                title.textContent = data.title;
                title.classList.add('titles');

                plantDiv.addEventListener('click', () => {
                    plantsContainer.style.display = "none";
                    background2.style.display = "flex"
                    detailDisplay.style.display = "inline";
                    addButton.style.display = "none";
                    background.style.display = "none";
                    detailDisplay.innerHTML = "";

                    // Create and append details to detailDisplay
                    const detailDiv = document.createElement('div');
                    detailDiv.classList.add('detailDiv');

                    const detailDiv1 = document.createElement('div');
                    detailDiv1.classList.add('detailDiv1');

                    const detailDiv2 = document.createElement('div');
                    detailDiv2.classList.add('detailDiv2');

                    const detailDiv3 = document.createElement('div');
                    detailDiv3.classList.add('detailDiv3');

                    const pestsDiv4 = document.createElement('div');
                    pestsDiv4.classList.add('pestsDiv4');

                    const diseaseDiv4 = document.createElement('div');
                    diseaseDiv4.classList.add('diseaseDiv4');

                    const c1 = document.createElement('div');
                    c1.classList.add('c1');

                    const c2 = document.createElement('div');
                    c2.classList.add('c2');

                    const c3 = document.createElement('div');
                    c3.classList.add('c3');

                    const c4 = document.createElement('div');
                    c4.classList.add('c4');

                    const detailTitle = document.createElement('h2');
                    detailTitle.textContent = data.title;
                    detailTitle.classList.add('dTitle');

                    const detailCategory = document.createElement('h6');
                    detailCategory.textContent = "Category: " + data.category;
                    detailCategory.classList.add('dCateg');

                    const descrip = document.createElement('h3');
                    descrip.textContent = data.description;
                    descrip.classList.add('dDescrip');

                    const rangeSlider = document.createElement('h3');
                    rangeSlider.textContent = data.rangeValue;
                    rangeSlider.classList.add('dSlider');

                    const depth = document.createElement('h3');
                    depth.textContent = data.depth;
                    depth.classList.add('dDepth');

                    const water = document.createElement('h3');
                    water.textContent = data.water;
                    water.classList.add('dWater');

                    const sun = document.createElement('h3');
                    sun.textContent = data.sun;
                    sun.classList.add('dSun');

                    const temp = document.createElement('h3');
                    temp.textContent = data.temperature;
                    temp.classList.add('dTemp');



                    const rangeSlider1 = document.createElement('h3');
                    rangeSlider1.textContent = "Spacing: ";
                    rangeSlider1.classList.add('dSlider1');

                    const depth1 = document.createElement('h3');
                    depth1.textContent = "Planting Depth: ";
                    depth1.classList.add('dDepth1');

                    const water1 = document.createElement('h3');
                    water1.textContent = "Water per week: ";
                    water1.classList.add('dWater1');

                    const sun1 = document.createElement('h3');
                    sun1.textContent = "Sun: ";
                    sun1.classList.add('dSun1');

                    const temp1 = document.createElement('h3');
                    temp1.textContent = "Growing Season: ";
                    temp1.classList.add('dTemp1');




                    const grow = document.createElement('p');
                    grow.textContent = data.grow;
                    grow.classList.add('dGrow');

                    const plant1 = document.createElement('p');
                    plant1.textContent = data.planting;
                    plant1.classList.add('dPlant');

                    const feed = document.createElement('p');
                    feed.textContent = data.feed;
                    feed.classList.add('dFeed');

                    const harv = document.createElement('p');
                    harv.textContent = data.harvest;
                    harv.classList.add('dHarv');

                    const stor = document.createElement('p');
                    stor.textContent = data.storage;
                    stor.classList.add('dStore');

                    const qi = document.createElement('h3');
                    qi.textContent = "Quick Info";
                    qi.classList.add('dQuick');

                    const qi1 = document.createElement('h3');
                    qi1.textContent = "Detailed Information";
                    qi1.classList.add('dQuick');

                    const qPest = document.createElement('h3');
                    qPest.textContent = "Pests";
                    qPest.classList.add('qPest');

                    const qDisease = document.createElement('h3');
                    qDisease.textContent = "Disease";
                    qDisease.classList.add('qDisease');

                    const grow1 = document.createElement('h3');
                    grow1.textContent = "Growing from Seed: ";
                    grow1.classList.add('dGrow1');

                    const plant2 = document.createElement('h3');
                    plant2.textContent = "Planting Considerations: ";
                    plant2.classList.add('dPlant1');

                    const feed1 = document.createElement('h3');
                    feed1.textContent = "Feeding: ";
                    feed1.classList.add('dFeed1');

                    const harv1 = document.createElement('h3');
                    harv1.textContent = "Harvesting: ";
                    harv1.classList.add('dHarv1');

                    const stor1 = document.createElement('h3');
                    stor1.textContent = "Storage: ";
                    stor1.classList.add('dStore1');

                    const back = document.getElementById('backB');
                    back.addEventListener('click', () => {
                        detailDisplay.style.display = "none";
                        background2.style.display = "none";
                        background.style.display = "inline";
                        addButton.style.display = "none";
                        plantsContainer.style.display = "none";
                    });


                    data.images.forEach(imageUrl => {
                        const image = document.createElement('img');
                        image.classList.add('dImage2');
                        image.src = imageUrl;
                        plantImg2.appendChild(image);
                    });

                    // Inside your event listener function
                    data.images.forEach(imageUrl => {
                        var i = 0;
                        var images = data.images; // Assuming plant.images is an array
                        var time = 3000;

                        function changeImg() {
                            const image = document.createElement('img');
                            image.classList.add('dImage');
                            image.src = images[i]; // Use 'images[i]' instead of 'imageUrl'

                            // Replace the existing image with the new one
                            plantImg.innerHTML = ''; // Clear previous image
                            plantImg.appendChild(image); // Append the new image

                            i = (i + 1) % images.length; // Increment index and wrap around if necessary

                            setTimeout(changeImg, time); // Use 'changeImg' instead of "changeImg()"
                        }

                        window.onload = changeImg(); // Change to window.onload = changeImg;
                    });

                    // detailDiv.appendChild(back);
                    detailDiv.appendChild(detailTitle);
                    detailDiv.appendChild(plantImg);
                    detailDiv.appendChild(plantImg2);
                    detailDiv.appendChild(descrip);
                    detailDiv.appendChild(detailCategory);

                    c3.appendChild(grow1);
                    c3.appendChild(grow);
                    c3.appendChild(plant2);
                    c3.appendChild(plant1);
                    c3.appendChild(feed1);
                    c3.appendChild(feed);
                    c3.appendChild(harv1);
                    c3.appendChild(harv);
                    c3.appendChild(stor1);
                    c3.appendChild(stor);

                    c1.appendChild(rangeSlider);
                    c1.appendChild(depth);
                    c1.appendChild(water);
                    c1.appendChild(sun);
                    c1.appendChild(temp);
                    c2.appendChild(rangeSlider1);
                    c2.appendChild(depth1);
                    c2.appendChild(water1);
                    c2.appendChild(sun1);
                    c2.appendChild(temp1);

                    if (data.pests && data.pests.length > 0) {
                        const pestsList = document.createElement('div');
                        pestsList.classList.add('pests-list');

                        data.pests.forEach(pest => {
                            const pestItem = document.createElement('div');
                            pestItem.classList.add('pestItem');

                            const pestIcon = document.createElement('img');
                            pestIcon.src = pest.iconUrl;
                            pestIcon.classList.add('pestIcon');

                            const pestTitle = document.createElement('p');
                            pestTitle.textContent = pest.title;
                            pestTitle.classList.add('pestTitle');

                            pestItem.appendChild(pestIcon);
                            pestItem.appendChild(pestTitle);
                            pestsList.appendChild(pestItem);
                        });

                        pestsDiv4.appendChild(pestsList);
                    }

                    if (data.disease && data.disease.length > 0) {
                        const diseaseList = document.createElement('div');
                        diseaseList.classList.add('disease-list');

                        data.disease.forEach(pest => {
                            const diseaseItem = document.createElement('div');
                            diseaseItem.classList.add('diseaseItem');

                            const diseaseIcon = document.createElement('img');
                            diseaseIcon.src = pest.iconUrl;
                            diseaseIcon.classList.add('diseaseIcon');

                            const diseaseTitle = document.createElement('p');
                            diseaseTitle.textContent = pest.title;
                            diseaseTitle.classList.add('diseaseTitle');

                            diseaseItem.appendChild(diseaseIcon);
                            diseaseItem.appendChild(diseaseTitle);
                            diseaseList.appendChild(diseaseItem);
                        });

                        diseaseDiv4.appendChild(diseaseList);
                    }

                    detailDiv1.appendChild(c2);
                    detailDiv1.appendChild(c1);
                    detailDiv2.appendChild(c3);

                    detailDisplay.appendChild(detailDiv);
                    detailDisplay.appendChild(qPest);
                    detailDisplay.appendChild(pestsDiv4);
                    detailDisplay.appendChild(qDisease);
                    detailDisplay.appendChild(diseaseDiv4);
                    detailDisplay.appendChild(qi);
                    detailDisplay.appendChild(detailDiv1);
                    detailDisplay.appendChild(qi1);
                    detailDisplay.appendChild(detailDiv2);
                });

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
    document.getElementById('plants-container').style.display = 'flex'
    document.getElementById('searchResults').style.display = 'none'
    document.getElementById('showFormButton').style.display = 'inline'

}



// ========================= Retirieve Data =============================

function retrieveData() {
    agriAdviceDB.on('value', (snapshot) => {
        // Get the plants data
        const plantsData = snapshot.val();

        // Clear previous data
        plantsContainer.innerHTML = "";
        detailDisplay.innerHTML = "";


        // Group plants by category
        const plantsByCategory = {};

        for (const key in plantsData) {
            if (plantsData.hasOwnProperty(key)) {
                const plant = plantsData[key];
                const category = plant.category;

                if (!plantsByCategory[category]) {
                    plantsByCategory[category] = [];
                }

                plantsByCategory[category].push(plant);
            }
        }

        const sortedCategories = Object.keys(plantsByCategory).sort();

        // Iterate over categories and create HTML elements
        for (const category in plantsByCategory) {
            if (plantsByCategory.hasOwnProperty(category)) {
                const plantsInCategory = plantsByCategory[category];


                // Create a header for the category
                const categoryHeader = document.createElement('h1');
                categoryHeader.classList.add('h1Categ');
                categoryHeader.textContent = category;
                plantsContainer.appendChild(categoryHeader);

                // Create a div to contain plants in this category
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('category-div');


                // Iterate over plants in this category and create HTML elements
                plantsInCategory.forEach(plant => {
                    const plantDiv = document.createElement('div');
                    plantDiv.classList.add('divPlant');

                    const plantImg = document.createElement('div');
                    plantImg.classList.add('divImg');


                    const plantImg2 = document.createElement('div');
                    plantImg2.classList.add('divImg2');

                    const icon = document.createElement('img');
                    icon.src = plant.icon;
                    icon.classList.add('icons');

                    const title = document.createElement('h2');
                    title.textContent = plant.title;
                    title.classList.add('titles');

                    const edimove = document.createElement('div');
                    edimove.classList.add("edimove");

                    const editIcon = document.createElement('img');
                    editIcon.src = '/assets/img/edit1.png';
                    editIcon.classList.add('editIcon');
                    editIcon.alt = 'Edit';

                    const deleteIcon = document.createElement('img');
                    deleteIcon.src = '/assets/img/delete1.png';
                    deleteIcon.classList.add('deleteIcon');
                    deleteIcon.alt = 'Delete';

                    edimove.appendChild(editIcon);
                    edimove.appendChild(deleteIcon);

                    deleteIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        edimove.style.display = "none";
                        detailDisplay.style.display = "none";
                        
                        const plantTitle = plant.title;
                        const plantsRef = firebase.database().ref('plants');
                        
                        plantsRef.orderByChild('title').equalTo(plantTitle).once('value')
                            .then(snapshot => {
                                snapshot.forEach(childSnapshot => {
                                    const plantKey = childSnapshot.key;
                                    const plantRef = firebase.database().ref('plants/' + plantKey);
                                    
                                    // Move plant to 'archive'
                                    const archiveRef = firebase.database().ref('archive').push();
                                    archiveRef.set(childSnapshot.val()) // move the data to archive
                                    
                                    // Remove the plant from 'plants'
                                    plantRef.remove()
                                        .then(() => {
                                            // Plant removed successfully from 'plants'
                                            console.log('Plant removed successfully from plants');
                                            // Now, let's remove the plantDiv from the UI
                                            // You can add UI manipulation code here if needed
                                        })
                                        .catch(error => {
                                            // Error occurred while removing the plant from plants
                                            console.error('Error removing plant from plants:', error.message);
                                            // Optionally, you can handle the error here
                                        });
                                });
                            })
                            .catch(error => {
                                // Error occurred while querying the plants database
                                console.error('Error querying plants database:', error.message);
                                // Optionally, you can handle the error here
                            });
                    });
                    
                    
                    editIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        document.getElementById('edit_plant').style.display = "inline";

                        icon.innerHTML = '';

                        document.getElementById('title2').value = plant.title;
                        document.getElementById('category2').value = plant.category;
                        document.getElementById('description2').value = plant.description;
                        document.getElementById('dept2').value = plant.depth;
                        document.getElementById('water2').value = plant.water;
                        document.getElementById('sun2').value = plant.sun;
                        document.getElementById('temp2').value = plant.temperature;
                        document.getElementById('grow2').value = plant.grow;
                        document.getElementById('planting2').value = plant.planting;
                        document.getElementById('feed2').value = plant.feed;
                        document.getElementById('harv2').value = plant.harvest;
                        document.getElementById('stor2').value = plant.storage;
                        document.getElementById('rangeValue2').textContent = plant.rangeValue;
                        document.querySelector(".metaData2");
                        retrieveIcon();
                        retrieveImages();
                        retrievePest();


                    });

                    plantDiv.addEventListener('click', () => {
                        plantsContainer.style.display = "none";
                        background2.style.display = "flex"
                        detailDisplay.style.display = "inline";
                        addButton.style.display = "none";
                        background.style.display = "none";
                        detailDisplay.innerHTML = "";

                        // Create and append details to detailDisplay
                        const detailDiv = document.createElement('div');
                        detailDiv.classList.add('detailDiv');

                        const detailDiv1 = document.createElement('div');
                        detailDiv1.classList.add('detailDiv1');

                        const detailDiv2 = document.createElement('div');
                        detailDiv2.classList.add('detailDiv2');

                        const detailDiv3 = document.createElement('div');
                        detailDiv3.classList.add('detailDiv3');

                        const pestsDiv4 = document.createElement('div');
                        pestsDiv4.classList.add('pestsDiv4');

                        const diseaseDiv4 = document.createElement('div');
                        diseaseDiv4.classList.add('diseaseDiv4');

                        const c1 = document.createElement('div');
                        c1.classList.add('c1');

                        const c2 = document.createElement('div');
                        c2.classList.add('c2');

                        const c3 = document.createElement('div');
                        c3.classList.add('c3');

                        const c4 = document.createElement('div');
                        c4.classList.add('c4');

                        const detailTitle = document.createElement('h2');
                        detailTitle.textContent = plant.title;
                        detailTitle.classList.add('dTitle');

                        const detailCategory = document.createElement('h6');
                        detailCategory.textContent = "Category: " + plant.category;
                        detailCategory.classList.add('dCateg');

                        const descrip = document.createElement('h3');
                        descrip.textContent = plant.description;
                        descrip.classList.add('dDescrip');

                        const rangeSlider = document.createElement('h3');
                        rangeSlider.textContent = plant.rangeValue;
                        rangeSlider.classList.add('dSlider');

                        const depth = document.createElement('h3');
                        depth.textContent = plant.depth;
                        depth.classList.add('dDepth');

                        const water = document.createElement('h3');
                        water.textContent = plant.water;
                        water.classList.add('dWater');

                        const sun = document.createElement('h3');
                        sun.textContent = plant.sun;
                        sun.classList.add('dSun');

                        const temp = document.createElement('h3');
                        temp.textContent = plant.temperature;
                        temp.classList.add('dTemp');



                        const rangeSlider1 = document.createElement('h3');
                        rangeSlider1.textContent = "Spacing: ";
                        rangeSlider1.classList.add('dSlider1');

                        const depth1 = document.createElement('h3');
                        depth1.textContent = "Planting Depth: ";
                        depth1.classList.add('dDepth1');

                        const water1 = document.createElement('h3');
                        water1.textContent = "Water per week: ";
                        water1.classList.add('dWater1');

                        const sun1 = document.createElement('h3');
                        sun1.textContent = "Sun: ";
                        sun1.classList.add('dSun1');

                        const temp1 = document.createElement('h3');
                        temp1.textContent = "Growing Season: ";
                        temp1.classList.add('dTemp1');




                        const grow = document.createElement('p');
                        grow.textContent = plant.grow;
                        grow.classList.add('dGrow');

                        const plant1 = document.createElement('p');
                        plant1.textContent = plant.planting;
                        plant1.classList.add('dPlant');

                        const feed = document.createElement('p');
                        feed.textContent = plant.feed;
                        feed.classList.add('dFeed');

                        const harv = document.createElement('p');
                        harv.textContent = plant.harvest;
                        harv.classList.add('dHarv');

                        const stor = document.createElement('p');
                        stor.textContent = plant.storage;
                        stor.classList.add('dStore');

                        const qi = document.createElement('h3');
                        qi.textContent = "Quick Info";
                        qi.classList.add('dQuick');

                        const qi1 = document.createElement('h3');
                        qi1.textContent = "Detailed Information";
                        qi1.classList.add('dQuick');

                        const qPest = document.createElement('h3');
                        qPest.textContent = "Pests";
                        qPest.classList.add('qPest');

                        const qDisease = document.createElement('h3');
                        qDisease.textContent = "Disease";
                        qDisease.classList.add('qDisease');

                        const grow1 = document.createElement('h3');
                        grow1.textContent = "Growing from Seed: ";
                        grow1.classList.add('dGrow1');

                        const plant2 = document.createElement('h3');
                        plant2.textContent = "Planting Considerations: ";
                        plant2.classList.add('dPlant1');

                        const feed1 = document.createElement('h3');
                        feed1.textContent = "Feeding: ";
                        feed1.classList.add('dFeed1');

                        const harv1 = document.createElement('h3');
                        harv1.textContent = "Harvesting: ";
                        harv1.classList.add('dHarv1');

                        const stor1 = document.createElement('h3');
                        stor1.textContent = "Storage: ";
                        stor1.classList.add('dStore1');

                        const back = document.getElementById('backB');
                        back.addEventListener('click', () => {
                            detailDisplay.style.display = "none";
                            background2.style.display = "none";
                            background.style.display = "inline";
                            addButton.style.display = "inline";
                            plantsContainer.style.display = "flex";
                        });


                        plant.images.forEach(imageUrl => {
                            const image = document.createElement('img');
                            image.classList.add('dImage2');
                            image.src = imageUrl;
                            plantImg2.appendChild(image);
                        });

                        // Inside your event listener function
                        plant.images.forEach(imageUrl => {
                            var i = 0;
                            var images = plant.images; // Assuming plant.images is an array
                            var time = 3000;

                            function changeImg() {
                                const image = document.createElement('img');
                                image.classList.add('dImage');
                                image.src = images[i]; // Use 'images[i]' instead of 'imageUrl'

                                // Replace the existing image with the new one
                                plantImg.innerHTML = ''; // Clear previous image
                                plantImg.appendChild(image); // Append the new image

                                i = (i + 1) % images.length; // Increment index and wrap around if necessary

                                setTimeout(changeImg, time); // Use 'changeImg' instead of "changeImg()"
                            }

                            window.onload = changeImg(); // Change to window.onload = changeImg;
                        });

                        // detailDiv.appendChild(back);
                        detailDiv.appendChild(detailTitle);
                        detailDiv.appendChild(plantImg);
                        detailDiv.appendChild(plantImg2);
                        detailDiv.appendChild(descrip);
                        detailDiv.appendChild(detailCategory);

                        c3.appendChild(grow1);
                        c3.appendChild(grow);
                        c3.appendChild(plant2);
                        c3.appendChild(plant1);
                        c3.appendChild(feed1);
                        c3.appendChild(feed);
                        c3.appendChild(harv1);
                        c3.appendChild(harv);
                        c3.appendChild(stor1);
                        c3.appendChild(stor);

                        c1.appendChild(rangeSlider);
                        c1.appendChild(depth);
                        c1.appendChild(water);
                        c1.appendChild(sun);
                        c1.appendChild(temp);
                        c2.appendChild(rangeSlider1);
                        c2.appendChild(depth1);
                        c2.appendChild(water1);
                        c2.appendChild(sun1);
                        c2.appendChild(temp1);

                        if (plant.pests && plant.pests.length > 0) {
                            const pestsList = document.createElement('div');
                            pestsList.classList.add('pests-list');

                            plant.pests.forEach(pest => {
                                const pestItem = document.createElement('div');
                                pestItem.classList.add('pestItem');

                                const pestIcon = document.createElement('img');
                                pestIcon.src = pest.iconUrl;
                                pestIcon.classList.add('pestIcon');

                                const pestTitle = document.createElement('p');
                                pestTitle.textContent = pest.title;
                                pestTitle.classList.add('pestTitle');

                                pestItem.appendChild(pestIcon);
                                pestItem.appendChild(pestTitle);
                                pestsList.appendChild(pestItem);


                                pestItem.addEventListener('click', () => {
                                    const detailPestDisplay = document.getElementById('Pestdisplay');
                                    detailPestDisplay.style.display = "inline";
                                    document.getElementById('xButton').style.display = "inline";

                                    const divP = document.createElement('div');
                                    divP.classList.add('divP');

                                    const pestImage = document.createElement('img');
                                    pestImage.classList.add('pestimage');
                                    pestImage.src = pest.iconUrl;

                                    const titlePest = document.createElement('h3');
                                    titlePest.classList.add('Titlepest');
                                    titlePest.textContent = pest.title;


                                    const uploadsRef = firebase.database().ref('Pests');




                                    uploadsRef.on('value', (snapshot) => {
                                        detailPestDisplay.innerHTML = '';
                                        snapshot.forEach((childSnapshot) => {
                                            const pests = childSnapshot.val();
                                            if (pests.title === titlePest.textContent) {
                                                const detailDiv = document.createElement('div');
                                                detailDiv.classList.add('detailPestDiv');

                                                const detailDiv2 = document.createElement('div');
                                                detailDiv2.classList.add('detailPestDiv2');

                                                const identify1 = document.createElement('h3');
                                                identify1.textContent = "Identification: ";
                                                identify1.classList.add('dIdentify1');

                                                const identify = document.createElement('p');
                                                identify.textContent = pests.identify;
                                                identify.classList.add('dIdentify');

                                                const ddamage1 = document.createElement('h3');
                                                ddamage1.textContent = "Damage Prevention: ";
                                                ddamage1.classList.add('ddamage1');

                                                const ddamage = document.createElement('p');
                                                ddamage.textContent = pests.damage;
                                                ddamage.classList.add('ddamage');

                                                const dPhysical1 = document.createElement('h3');
                                                dPhysical1.textContent = "Physical Control: ";
                                                dPhysical1.classList.add('dPhysical1');

                                                const dPhysical = document.createElement('p');
                                                dPhysical.textContent = pests.physical;
                                                dPhysical.classList.add('dPhysical');

                                                const dChemical1 = document.createElement('h3');
                                                dChemical1.textContent = "Chemical Control: ";
                                                dChemical1.classList.add('dChemical1');

                                                const dChemical11 = document.createElement('h3');
                                                dChemical11.textContent = "Chemical Control: ";
                                                dChemical11.classList.add('dChemical11');


                                                const instruc = document.createElement('h3');
                                                instruc.textContent = "Plants Affected";
                                                instruc.classList.add('instruc');

                                                const dChemical = document.createElement('p');
                                                dChemical.textContent = pests.chemical;
                                                dChemical.classList.add('dChemical');

                                                

                                                const xButton = document.getElementById('xButton');

                                                xButton.addEventListener('click', () => {
                                                    detailPestDisplay.style.display = "none";
                                                    xButton.style.display = "none";
                                                })

                                                agriAdviceDB.on('value', (snapshot) => {
                                                    detailPestDisplay.innerHTML = '';
                                                    console.log("Snapshot received:", snapshot.val()); // Log the snapshot received
                                                    snapshot.forEach((childSnapshot) => {
                                                        const plant = childSnapshot.val();
                                                        console.log("Plant data:", plant); // Log the plant data
                                                
                                                        plant.pests.forEach(pest => {
                                                            if(pest.title === pests.title){
                                                                const div_ = document.createElement('div');
                                                                div_.classList.add('div_');

                                                                const icon2 = document.createElement('img');
                                                                icon2.src = plant.icon;
                                                                icon2.classList.add('icons2');

                                                                const title2 = document.createElement('h2');
                                                                title2.textContent = plant.title;
                                                                title2.classList.add('titles2');

                                                                div_.appendChild(icon2);
                                                                div_.appendChild(title2);
                                                                detailDiv2.appendChild(div_);
                                                            }
                                                        })
                                                    });
                                                });
                                                
                                               
                                                
                                                detailDiv.appendChild(detailDiv2);
                                                detailDiv.appendChild(identify1);
                                                detailDiv.appendChild(identify);
                                                detailDiv.appendChild(ddamage1);
                                                detailDiv.appendChild(ddamage);
                                                detailDiv.appendChild(dPhysical1);
                                                detailDiv.appendChild(dPhysical);
                                                detailDiv.appendChild(dChemical1);
                                                detailDiv.appendChild(dChemical);
                                                detailDiv.appendChild(dChemical11);

                                                detailPestDisplay.appendChild(titlePest);
                                                detailPestDisplay.appendChild(pestImage);
                                                detailPestDisplay.appendChild(instruc);
                                                detailPestDisplay.appendChild(detailDiv);
                                            }
                                        })
                                    })

                                    console.log("Appending elements to detailPestDisplay...");
                                });



                            });

                            pestsDiv4.appendChild(pestsList);
                        }

                        if (plant.disease && plant.disease.length > 0) {
                            const diseaseList = document.createElement('div');
                            diseaseList.classList.add('disease-list');

                            plant.disease.forEach(pest => {
                                const diseaseItem = document.createElement('div');
                                diseaseItem.classList.add('diseaseItem');

                                const diseaseIcon = document.createElement('img');
                                diseaseIcon.src = pest.iconUrl;
                                diseaseIcon.classList.add('diseaseIcon');

                                const diseaseTitle = document.createElement('p');
                                diseaseTitle.textContent = pest.title;
                                diseaseTitle.classList.add('diseaseTitle');

                                diseaseItem.appendChild(diseaseIcon);
                                diseaseItem.appendChild(diseaseTitle);
                                diseaseList.appendChild(diseaseItem);

                                diseaseItem.addEventListener('click', () => {
                                    const detailPestDisplay = document.getElementById('Pestdisplay');
                                    detailPestDisplay.style.display = "inline";
                                    document.getElementById('xButton').style.display = "inline";

                                    const divP = document.createElement('div');
                                    divP.classList.add('divP');

                                    const pestImage = document.createElement('img');
                                    pestImage.classList.add('pestimage');
                                    pestImage.src = pest.iconUrl;

                                    const titlePest = document.createElement('h3');
                                    titlePest.classList.add('Titlepest');
                                    titlePest.textContent = pest.title;


                                    const uploadsRef = firebase.database().ref('Disease');




                                    uploadsRef.on('value', (snapshot) => {
                                        detailPestDisplay.innerHTML = '';
                                        snapshot.forEach((childSnapshot) => {
                                            const disease = childSnapshot.val();
                                            if (disease.title === titlePest.textContent) {
                                                const detailDiv = document.createElement('div');
                                                detailDiv.classList.add('detailPestDiv');

                                                const detailDiv2 = document.createElement('div');
                                                detailDiv2.classList.add('detailPestDiv2');

                                                const identify1 = document.createElement('h3');
                                                identify1.textContent = "Identification: ";
                                                identify1.classList.add('dIdentify1');

                                                const identify = document.createElement('p');
                                                identify.textContent = disease.identify;
                                                identify.classList.add('dIdentify');

                                                const ddamage1 = document.createElement('h3');
                                                ddamage1.textContent = "Damage Prevention: ";
                                                ddamage1.classList.add('ddamage1');

                                                const ddamage = document.createElement('p');
                                                ddamage.textContent = disease.damage;
                                                ddamage.classList.add('ddamage');

                                                const dPhysical1 = document.createElement('h3');
                                                dPhysical1.textContent = "Physical Control: ";
                                                dPhysical1.classList.add('dPhysical1');

                                                const dPhysical = document.createElement('p');
                                                dPhysical.textContent = disease.physical;
                                                dPhysical.classList.add('dPhysical');

                                                const dChemical1 = document.createElement('h3');
                                                dChemical1.textContent = "Chemical Control: ";
                                                dChemical1.classList.add('dChemical1');

                                                const dChemical11 = document.createElement('h3');
                                                dChemical11.textContent = "Chemical Control: ";
                                                dChemical11.classList.add('dChemical11');


                                                const instruc = document.createElement('h3');
                                                instruc.textContent = "Plants Affected";
                                                instruc.classList.add('instruc');

                                                const dChemical = document.createElement('p');
                                                dChemical.textContent = disease.chemical;
                                                dChemical.classList.add('dChemical');

                                                

                                                const xButton = document.getElementById('xButton');

                                                xButton.addEventListener('click', () => {
                                                    detailPestDisplay.style.display = "none";
                                                    xButton.style.display = "none";
                                                })

                                                agriAdviceDB.on('value', (snapshot) => {
                                                    detailPestDisplay.innerHTML = '';
                                                    console.log("Snapshot received:", snapshot.val()); // Log the snapshot received
                                                    snapshot.forEach((childSnapshot) => {
                                                        const plant = childSnapshot.val();
                                                        console.log("Plant data:", plant); // Log the plant data
                                                
                                                        plant.disease.forEach(pest => {
                                                            if(pest.title === disease.title){
                                                                const div_ = document.createElement('div');
                                                                div_.classList.add('div_');

                                                                const icon2 = document.createElement('img');
                                                                icon2.src = plant.icon;
                                                                icon2.classList.add('icons2');

                                                                const title2 = document.createElement('h2');
                                                                title2.textContent = plant.title;
                                                                title2.classList.add('titles2');

                                                                div_.appendChild(icon2);
                                                                div_.appendChild(title2);
                                                                detailDiv2.appendChild(div_);
                                                            }
                                                        })
                                                    });
                                                });
                                                
                                               
                                                
                                                detailDiv.appendChild(detailDiv2);
                                                detailDiv.appendChild(identify1);
                                                detailDiv.appendChild(identify);
                                                detailDiv.appendChild(ddamage1);
                                                detailDiv.appendChild(ddamage);
                                                detailDiv.appendChild(dPhysical1);
                                                detailDiv.appendChild(dPhysical);
                                                detailDiv.appendChild(dChemical1);
                                                detailDiv.appendChild(dChemical);
                                                detailDiv.appendChild(dChemical11);


                                                detailPestDisplay.appendChild(titlePest);
                                                detailPestDisplay.appendChild(pestImage);
                                                detailPestDisplay.appendChild(instruc);
                                                detailPestDisplay.appendChild(detailDiv);
                                            }
                                        })
                                    })

                                    console.log("Appending elements to detailPestDisplay...");
                                });
                            });

                            diseaseDiv4.appendChild(diseaseList);
                        }

                        detailDiv1.appendChild(c2);
                        detailDiv1.appendChild(c1);
                        detailDiv2.appendChild(c3);

                        detailDisplay.appendChild(detailDiv);
                        detailDisplay.appendChild(qPest);
                        detailDisplay.appendChild(pestsDiv4);
                        detailDisplay.appendChild(qDisease);
                        detailDisplay.appendChild(diseaseDiv4);
                        detailDisplay.appendChild(qi);
                        detailDisplay.appendChild(detailDiv1);
                        detailDisplay.appendChild(qi1);
                        detailDisplay.appendChild(detailDiv2);
                    });

                    plantDiv.appendChild(icon);
                    plantDiv.appendChild(title);
                    plantDiv.appendChild(edimove);
                    categoryDiv.appendChild(plantDiv);
                });

                plantsContainer.appendChild(categoryDiv);
            }


        }
    });
}
retrieveData();


// ========================= Add Plant ==============================

function resetForm() {
    // Reset the values of input fields in the form
    addPlantForm.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });

    editPlantForm.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });

    // Reset the icon image display
    const selectIcon = document.getElementById('icon_image').querySelector('.metaData');
    selectIcon.textContent = "";

    // Reset the file input for the icon image
    const iconInput = document.getElementById('icon');
    iconInput.value = '';

    // Reset the displayed image data for the additional images
    const imageDataSpan = document.getElementById('images_plants').querySelector('.imageDa');
    imageDataSpan.textContent = "";

    const pestsSelected = document.getElementById('pestsSelected');
    pestsSelected.innerHTML = '';
    pestsSelected.style.display = "none";

    const diseaseSelected = document.getElementById('diseaseSelected');
    diseaseSelected.innerHTML = '';
    diseaseSelected.style.display = "none";


    // Reset the icon image display
    const selectIcon2 = document.getElementById('icon_image').querySelector('.metaData2');
    selectIcon2.textContent = "";

    // Reset the file input for the icon image
    const iconInput2 = document.getElementById('icon2');
    iconInput2.value = '';

    // Reset the displayed image data for the additional images
    const imageDataSpan2 = document.getElementById('images_plants').querySelector('.imageDa2');
    imageDataSpan2.textContent = "";

    const pestsSelected2 = document.getElementById('pestsSelected2');
    pestsSelected2.innerHTML = '';
    pestsSelected2.style.display = "none";

    const diseaseSelected2 = document.getElementById('diseaseSelected2');
    diseaseSelected2.innerHTML = '';
    diseaseSelected2.style.display = "none";

    const diseaseCheckboxes = document.querySelectorAll('.divDisease input[type="checkbox"]');
    diseaseCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    const pestsCheckboxes = document.querySelectorAll('.divPests input[type="checkbox"]');
    pestsCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

const addPlantForm = document.getElementById('add_plant');
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

const editPlantForm = document.getElementById('edit_plant');
document.getElementById('close2').addEventListener('click', function () {
    editPlantForm.style.display = 'none';
    document.getElementById('sidebar').style.filter = "none";
    document.getElementById('sidebar1').style.filter = "none";
    resetForm();
});



// ================= Display Pests =============================
function displayPests() {
    const uploadsRef = firebase.database().ref('Pests');
    const pestsContainer = document.getElementById('pests');
    const pestsSelected = document.getElementById('pestsSelected');
    const pestDone = document.getElementById('done');

    uploadsRef.on('value', (snapshot) => {
        pestsContainer.innerHTML = ''; // Clear container before adding new data
        snapshot.forEach((childSnapshot) => {
            const pests = childSnapshot.val();
            const imageUrl = pests.imageUrl;
            const title = pests.title;

            if (imageUrl && title) {
                const pestsDiv = document.createElement('div');
                pestsDiv.classList.add('divPests');

                const check = document.createElement('input');
                check.type = 'checkbox';
                check.classList.add('checkBox');

                const iconElement = document.createElement('img');
                iconElement.src = imageUrl;
                iconElement.classList.add('icons1');

                const titleElement = document.createElement('h2');
                titleElement.textContent = title;
                titleElement.classList.add('titles1');

                pestsDiv.appendChild(check);
                pestsDiv.appendChild(iconElement);
                pestsDiv.appendChild(titleElement);
                pestsContainer.appendChild(pestsDiv);



                // Event listener for selecting pests
                pestsDiv.addEventListener('click', function () {
                    check.checked = !check.checked;
                });

                pestDone.addEventListener('click', function () {
                    updateSelectedPests();
                    const addPests = document.getElementById('pestBack');
                    addPests.style.display = 'none';
                });

            } else {
                console.error('Incomplete data for pest:', pests);
            }
        });
    }, (error) => {
        console.error('Error retrieving uploaded data:', error);
    });

    function updateSelectedPests() {
        pestsSelected.innerHTML = ''; // Clear selected pests container
        const selectedPests = Array.from(pestsContainer.querySelectorAll('.divPests input:checked')).map((checkbox) => {
            const pestDiv = checkbox.parentNode;
            const icon = pestDiv.querySelector('img').cloneNode(true);
            const title = pestDiv.querySelector('h2').textContent;
            return { icon, title };
        });

        selectedPests.forEach((pest) => {
            const selectedPestDiv = document.createElement('div');
            selectedPestDiv.classList.add('selectedPests');

            const iconElement = pest.icon;
            iconElement.classList.add('selectedIcon');
            const titleElement = document.createElement('h2');
            titleElement.textContent = pest.title;
            titleElement.classList.add('selectedTitle')

            document.getElementById('pestsSelected').style.display = "flex";

            selectedPestDiv.appendChild(iconElement);
            selectedPestDiv.appendChild(titleElement);
            pestsSelected.appendChild(selectedPestDiv);
        });
    }
}

displayPests();


// ================= Display Pests =============================

function displayDisease() {
    const uploadsRef = firebase.database().ref('Disease');
    const diseaseContainer = document.getElementById('disease');
    const diseasesSelected = document.getElementById('diseaseSelected');
    const diseaseDone = document.getElementById('doned');

    uploadsRef.on('value', (snapshot) => {
        diseaseContainer.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const disease = childSnapshot.val();
            const imageUrl = disease.imageUrl;
            const title = disease.title;

            if (imageUrl && title) {
                const diseaseDiv = document.createElement('div');
                diseaseDiv.classList.add('divDisease');

                const check = document.createElement('input');
                check.type = 'checkbox';
                check.classList.add('checkBox');

                const iconElement = document.createElement('img');
                iconElement.src = imageUrl;
                iconElement.classList.add('icons2');

                const titleElement = document.createElement('h2');
                titleElement.textContent = title;
                titleElement.classList.add('titles2');

                diseaseDiv.appendChild(check);
                diseaseDiv.appendChild(iconElement);
                diseaseDiv.appendChild(titleElement);
                diseaseContainer.appendChild(diseaseDiv);

                // Event listener for selecting diseases
                diseaseDiv.addEventListener('click', function () {
                    check.checked = !check.checked;
                });

                diseaseDone.addEventListener('click', function () {
                    updateSelectedDiseases();
                    const addDisease = document.getElementById('diseaseBack');
                    addDisease.style.display = 'none';

                });

            } else {
                console.error('Incomplete data for disease:', disease);
            }
        });
    }, (error) => {
        console.error('Error retrieving uploaded data:', error);
    });

    function updateSelectedDiseases() {
        diseasesSelected.innerHTML = ''; // Clear selected diseases container
        const selectedDiseases = Array.from(diseaseContainer.querySelectorAll('.divDisease input:checked')).map((checkbox) => {
            const diseaseDiv = checkbox.parentNode;
            const icon = diseaseDiv.querySelector('img').cloneNode(true);
            const title = diseaseDiv.querySelector('h2').textContent;
            return { icon, title };
        });

        selectedDiseases.forEach((disease) => {
            const selectedDiseaseDiv = document.createElement('div');
            selectedDiseaseDiv.classList.add('selectedDisease');

            const iconElement = disease.icon;
            iconElement.classList.add('selectedIcon');
            const titleElement = document.createElement('h2');
            titleElement.textContent = disease.title;
            titleElement.classList.add('selectedTitle')

            document.getElementById('diseaseSelected').style.display = "flex";

            selectedDiseaseDiv.appendChild(iconElement);
            selectedDiseaseDiv.appendChild(titleElement);
            diseasesSelected.appendChild(selectedDiseaseDiv);
        });
    }
}

displayDisease();





const addPests = document.getElementById('pestBack');
document.getElementById('showPests').addEventListener('click', function () {
    addPests.style.display = 'inline';
});
document.getElementById('backPests').addEventListener('click', function () {
    addPests.style.display = 'none';
});


const addDisease = document.getElementById('diseaseBack');
document.getElementById('showDisease').addEventListener('click', function () {
    addDisease.style.display = 'inline';
});
document.getElementById('backDisease').addEventListener('click', function () {
    addDisease.style.display = 'none';
});





// ========================= para naman sa delete ==============================
function deleteItemFromFirebase(key) {
    if (confirm('Are you sure you want to delete this item?')) {

        agriAdviceDB.child(key).remove()
            .then(function () {
                alert('Item deleted successfully!');

                var elementToRemove = document.getElementById(`plantimg${key}`).parentNode;
                elementToRemove.parentNode.removeChild(elementToRemove);
                displayFirebaseData();
            })
            .catch(function (error) {
                console.error("Error deleting item from Firebase:", error);
            });
    }
}



// ====================== Range Slider ================================

function rangeSlide(value) {
    const result = value;
    if (value == 0) {
        document.getElementById('rangeValue').innerHTML = (result + 16) + "/Square";
    } else if (value == 1) {
        document.getElementById('rangeValue').innerHTML = (result + 8) + "/Square";
    } else if (value == 2) {
        document.getElementById('rangeValue').innerHTML = (result + 6) + "/Square";
    } else if (value == 3) {
        document.getElementById('rangeValue').innerHTML = (result + 1) + "/Square";
    } else if (value == 4) {
        document.getElementById('rangeValue').innerHTML = (result - 2) + "/Square";
    } else if (value == 5) {
        document.getElementById('rangeValue').innerHTML = (result - 4) + "/Square";
    } else if (value == 6) {
        document.getElementById('rangeValue').innerHTML = (result - 4) + " Square";
    } else if (value == 7) {
        document.getElementById('rangeValue').innerHTML = (result - 4) + "x3 Square";
    } else if (value == 8) {
        document.getElementById('rangeValue').innerHTML = (result - 4) + "x4 Square";
    } else if (value == 9) {
        document.getElementById('rangeValue').innerHTML = (result - 4) + "x5 Square";
    } else if (value == 10) {
        document.getElementById('rangeValue').innerHTML = (result - 2) + "x8 Square";
    } else if (value == 11) {
        document.getElementById('rangeValue').innerHTML = (result - 1) + "x10 Square";
    }
    //document.getElementById('rangeValue').innerHTML = result + "/Square";
}


// ================ Icon =========================

const icon = document.querySelector(".icon");
const image = document.querySelector(".images");
const icon2 = document.querySelector(".icon2");
const image2 = document.querySelector(".images2");
const metaData = document.querySelector(".metaData");
const metaData2 = document.querySelector(".metaData2");
const imageDa = document.querySelector(".imageDa");
const imageDa2 = document.querySelector(".imageDa2");
let files;

const getIconData = (e) => {
    files = e.target.files;
    for (let index = 0; index < files.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "iconContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files[index]);

        const deselectButton = document.createElement("img");
        deselectButton.className = "deselectButton";
        deselectButton.src = "/assets/img/delete1.png";
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };

        imageData.appendChild(image);
        imageData.appendChild(deselectButton);
        metaData.appendChild(imageData);
    }
}
const selectIcon = () => {
    icon.click();
}

const getIconData2 = (e) => {
    files = e.target.files;
    for (let index = 0; index < files.length; index++) {

        const imageData2 = document.createElement("div");
        imageData2.className = "iconContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files[index]);

        const deselectButton = document.createElement("img");
        deselectButton.className = "deselectButton";
        deselectButton.src = "/assets/img/delete1.png";
        deselectButton.onclick = function () {
            imageData2.remove();
            URL.revokeObjectURL(image.src);
        };

        imageData2.appendChild(image);
        imageData2.appendChild(deselectButton);
        metaData2.appendChild(imageData2);
    }
}
const selectIcon2 = () => {
    icon.click();
}


// ======================== Images ===============================

const getImageData = (e) => {
    files = e.target.files;
    for (let index = 0; index < files.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "imageContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files[index]);

        const deselectButton = document.createElement("img");
        deselectButton.className = "deselectButton";
        deselectButton.src = "/assets/img/delete1.png";
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };

        imageData.appendChild(image);
        imageData.appendChild(deselectButton);
        imageDa.appendChild(imageData);
    }
}

const selectImage = () => {
    image.click();
}

const getImageData2 = (e) => {
    files = e.target.files;
    for (let index = 0; index < files.length; index++) {
        const imageData2 = document.createElement("div");
        imageData2.className = "imageContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files[index]);

        const deselectButton = document.createElement("img");
        deselectButton.className = "deselectButton";
        deselectButton.src = "/assets/img/delete1.png";
        deselectButton.onclick = function () {
            imageData2.remove();
            URL.revokeObjectURL(image.src);
        };

        imageData2.appendChild(image);
        imageData2.appendChild(deselectButton);
        imageDa2.appendChild(imageData2);
    }
}

const selectImage2 = () => {
    image.click();
}

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