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
const ref = database.ref('Payment');

const pay_detail = document.getElementById('pay-detail'); 
const pay_account = document.getElementById('pay-account'); 
const payDet = document.getElementById('p-1');
const payAcc = document.getElementById('v-1');

function payment(){
    pay_account.style.display="none";
    pay_detail.style.display="flex"
    payDet.style.backgroundColor="#527a63";
    payAcc.style.color="black";
    payDet.style.color="white";
    payAcc.style.backgroundColor="white";
}

function paymentaccount(){
    pay_account.style.display="flex";
    pay_detail.style.display="none"
    payAcc.style.backgroundColor="#527a63";
    payDet.style.color="black";
    payAcc.style.color="white";
    payDet.style.backgroundColor="white";
}

function retrievepayment(){
    ref.once("value", function (snapshot){
        pay_detail.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const pay = childSnapshot.val();

            const pay_con = document.createElement('div');
            pay_con.classList.add('pay_con');

            const paymentDate = document.createElement('h4');
            paymentDate.textContent = pay.paymentDate;
            paymentDate.classList.add('paymentDate');

            pay_con.appendChild(paymentDate);
            pay_detail.appendChild(pay_con);

            pay_con.addEventListener('click', () =>{
            
                const payment_container = document.getElementById('conatinerPay');
                payment_container.innerHTML="";
                payment_container.style.display="flex";

                const imagePay = document.createElement('img');
                imagePay.src = pay.imageUrl;
                imagePay.classList.add("imagePay");

                const date = document.createElement('h4')
                date.textContent = pay.paymentDate;
                date.classList.add("date");

                const referenceNumber = document.createElement('h4');
                referenceNumber.textContent = pay.referenceNumber;
                referenceNumber.classList.add('referenceNumber');

                const transactionId = document.createElement('h4');
                transactionId.textContent = pay.transactionId;
                transactionId.classList.add('transactionId');

                const totalprice = document.createElement('h4');
                totalprice.textContent = pay.totalPrice;
                totalprice.classList.add('totalprice');

                const buyername = document.createElement('h4');
                buyername.textContent = pay.userName;
                buyername.classList.add('buyername');

                const backB = document.createElement('h4');
                backB.textContent = "Back";
                backB.classList.add('backB');

                backB.addEventListener('click', () =>{
                    payment_container.style.display="none";
                });

                
                payment_container.appendChild(buyername);
                payment_container.appendChild(imagePay);
                payment_container.appendChild(referenceNumber);
                payment_container.appendChild(date);
                payment_container.appendChild(transactionId);
                payment_container.appendChild(totalprice);
                payment_container.appendChild(backB);

            });
        });
    })
}
retrievepayment();


const addpayAccount = document.getElementById('addpayAccount');
function uploadPaymentAccount(){
    addpayAccount.style.display="flex";
}



const icon1 = document.querySelector(".icon1");
const metaData1 = document.querySelector(".metaData1");
let files1; 

const getIconData1 = (e) => {

    metaData1.innerHTML = "";
    files1 = e.target.files;
    for (let index = 0; index < files1.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "iconContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files1[index]);
        imageData.appendChild(image);

        const deselectButton = document.createElement("img");
        // Corrected src attribute assignment
        deselectButton.src = "/assets/img/delete.png";
        deselectButton.className = "deselectButton";
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };
        imageData.appendChild(deselectButton);

        metaData1.appendChild(imageData);
    }
}

const selectIcon1 = () => {
    icon1.click();
}

function resetForm2() {


    metaData1.value = '';

    const gname = document.getElementById('accName');
    gname.value = '';

    const gnum = document.getElementById('accNumber');
    gnum.value = '';
}

document.getElementById('close1').addEventListener('click', function () {
    document.getElementById('addpayAccount').style.display = 'none';
    resetForm2();
});

// function PaymentAccount() {

//     const bar = document.getElementById('uploadBar');
//     bar.style.display = "inline";
    
//     const progress = document.getElementById('progress');
//     const percentage = document.getElementById('percentage');
//     var accName = document.getElementById('accName').value;
//     var accNumber = document.getElementById('accNumber').value;
//     var file = document.getElementById('icon1').files[0];

//     const storageRef = firebase.storage().ref('images/' + file.name);
//     const uploadTask = storageRef.put(file);    
//     uploadTask.on('state_changed',
//         (snapshot) => {
//             // Calculate progress percentage
//             const progressPercentage = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//             console.log('Upload is ' + progressPercentage + '% done');

//             // Update progress bar
//             percentage.innerHTML = progressPercentage + "%";
//             progress.style.width = progressPercentage + "%";
//         },
//         (error) => {
//             console.error('Error uploading image:', error);
//         },
//         () => {
//             uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
//                 firebase.database().ref('Admin/Account Payment').push({
//                     accNum: accNumber,
//                     accName: accName,
//                     payImage: downloadURL
//                 }).then(() => {
//                     document.getElementById('uploadBar').style.display = "none";
//                     console.log('Image and text uploaded successfully.');
//                     const addpayAccount = document.getElementById('addpayAccount');
//                     addpayAccount.style.display = 'none';
//                     const alert = document.getElementById('alert');
//                     alert.style.display = 'inline';
//                     document.getElementById('okayButton').addEventListener('click', function () {
//                         alert.style.display = 'none';
//                     });
//                     resetForm2();
//                 }).catch((error) => {
//                     console.error('Error uploading text:', error);
//                 });
//             });
//         }
//     );
// }

function PaymentAccount() {
    const bar = document.getElementById('uploadBar');
    bar.style.display = "inline";
    
    const progress = document.getElementById('progress');
    const percentage = document.getElementById('percentage');
    const accNum = document.getElementById('accNumber').value;
    const accName = document.getElementById('accName').value;
    const file = document.getElementById('icon1').files[0];

    const storageRef = firebase.storage().ref('images/' + file.name);
    const uploadTask = storageRef.put(file);    
    uploadTask.on('state_changed',
        (snapshot) => {
            // Calculate progress percentage
            const progressPercentage = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log('Upload is ' + progressPercentage + '% done');

            // Update progress bar
            percentage.innerHTML = progressPercentage + "%";
            progress.style.width = progressPercentage + "%";
        },
        (error) => {
            console.error('Error uploading image:', error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // Check if the account already exists
                firebase.database().ref('Admin/Account Payment').orderByChild('accNum').equalTo(accNum).once('value', function(snapshot) {
                    if (snapshot.exists()) {
                        // If the account exists, update its properties
                        snapshot.forEach(function(childSnapshot) {
                            var key = childSnapshot.key;
                            firebase.database().ref('Admin/Account Payment/' + key).update({
                                accName: accName,
                                accNum: accNum,
                                payImage: downloadURL
                            }).then(() => {
                                document.getElementById('uploadBar').style.display = "none";
                                console.log('Image and text updated successfully.');
                                const addpayAccount = document.getElementById('addpayAccount');
                                addpayAccount.style.display = 'none';
                                const alert = document.getElementById('alert');
                                alert.style.display = 'inline';
                                document.getElementById('okayButton').addEventListener('click', function () {
                                    alert.style.display = 'none';
                                });
                                resetForm2();
                            }).catch((error) => {
                                console.error('Error updating text:', error);
                            });
                        });
                    } else {
                        // If the account doesn't exist, show an error message
                        console.error('Account not found.');
                    }
                });
            });
        }
    );
}


const payDF = database.ref('Admin/Account Payment');
const accCon = document.getElementById('account-cointainer');

function payAccountRetrieve(){

    payDF.once("value", function (snapshot){
        accCon.innerHTML= "";
        snapshot.forEach((childSnapshot) =>{
            const Ap = childSnapshot.val();

            const APCon = document.createElement('div');
            APCon.classList.add('APCon');

            const qrPay = document.createElement('img');
            qrPay.src = Ap.payImage;
            qrPay.classList.add('qrPay');

            const namePay = document.createElement('h4');
            namePay.textContent = Ap.accName;
            namePay.classList.add('namePay');

            const numPay = document.createElement('h4');
            numPay.textContent = Ap.accNum;
            numPay.classList.add('numPay');

            APCon.appendChild(qrPay);
            APCon.appendChild(namePay);
            APCon.appendChild(numPay);
            accCon.appendChild(APCon);
        });
    })
}
payAccountRetrieve();


function retrievePaymentAccount() {
    // Reference to the Firebase database
    const dbRef = firebase.database().ref('Admin/Account Payment');

    // Retrieve data from Firebase
    dbRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            document.getElementById('accName').value = childData.accName;
            document.getElementById('accNumber').value = childData.accNum;

            // Assuming you want to display the image in an <img> element with id="accountImage"
            var accountImage = document.getElementById('accountImage');
            if (childData.payImage) {
                // Set the src attribute of the <img> element to the image URL
                accountImage.src = childData.payImage;
            } else {
                // If payImage is not available, you may want to set a default image or hide the <img> element
                accountImage.src = "/assets/img/default-image.png"; // Replace with your default image path
            }
        });
    });
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
