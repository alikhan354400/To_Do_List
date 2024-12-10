console.log(firebase)
var email = document.getElementById("email")
var password = document.getElementById("password")
var nameuser = document.getElementById("name")
var age = document.getElementById("age")
var gsignin = document.getElementById("gsignin")
var imageUpload = document.getElementById("imageUpload")

var signup = document.getElementById("signup")
var signIn = document.getElementById("signIn")



signup.addEventListener("click", async function () {
   var file = imageUpload.files[0]
   if (!file) {
      alert("please select image")

   }
  
   else if (email.value == "") {
      alert("please enter email")
   }
   else if(password.value == ""){
      alert("Please Enter Password")

   }
   else if(nameuser.value == ""){
      alert("Please Enter Name")

   }
   
   else {
      var check = false;
      await firebase.database().ref("users").get().then((snap) => {

         var users = Object.values(snap.val())
         console.log(users)
         for (var i = 0; i < users.length; i++) {
            console.log(users[i].email)
            if (users[i].email == email.value) {
               check = true;
               break;

            }

         }

      })
      if (check == true) {
         alert("already register with this email")

      }
   
      else {
         console.log(file)
         const CLOUDNAME = "dsu0uj6em";
         const UNSIGNEDUPOLOAD = "server";
         const URL = 'https://api.cloudinary.com/v1_1/' + CLOUDNAME + "/upload"
         const formData = new FormData()
         formData.append("upload_preset", UNSIGNEDUPOLOAD)
         formData.append("file", file)

         try {
            fetch(URL, {
               method: "POST",
               body: formData,

            })
               .then((resp) => resp.json())
               .then(async (data) => {
                  console.log(data.secure_url)
                  await firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
                     .then(async (user) => {
                        console.log(user.user.uid)

                        var object = {
                           email: email.value,
                           "name": nameuser.value,
                           "photo": data.secure_url,
                           "userId": user.user.uid
                        }
                        await firebase.database().ref("users").child(user.user.uid).set(object)
                        localStorage.setItem("userId", user.user.uid)
                        window.location.replace("loginpage.html")
                     })
                     .catch((error) => {
                        alert(error.message)
                     })

               })
         }
         catch (e) {

         }
         
      }
   }
})
async function Googlesignin() {
   try {
       console.log("Starting Google Sign-In...");

       var provider = new firebase.auth.GoogleAuthProvider();
       provider.setCustomParameters({ prompt: 'select_account' });

       console.log("Opening Sign-In Popup...");
       const result = await firebase.auth().signInWithPopup(provider);

       console.log("Sign-In Successful: ", result);

       const user = result.user;
       if (user) {
           const obj = {
               email: user.email,
               name: user.displayName,
               photo: user.photoURL,
               userId: user.uid
           };

           console.log("User Data: ", obj);

           // Save user data to Realtime Database
           await firebase.database().ref("users").child(user.uid).set(obj);

           console.log("User data saved in database.");

           // Store userId in localStorage and redirect
           localStorage.setItem("userId", user.uid);
           window.location.replace("index.html");
       }
   } catch (e) {
       console.error("Google Sign-In Error: ", e.message);
   }
}



