var maincontent = document.getElementById("maincontent")
var input = document.getElementById("input")
var addbtn = document.getElementById("addbtn")
var deletebtn = document.getElementById("deletebtn")
var updatebtn = document.getElementById("updatebtn")
var loading = document.getElementById("loading")
var dataShow = document.getElementById("dataShow")


var nameusser = document.getElementById("name")
var email = document.getElementById("email")
var image = document.getElementById("photo")


// var changetheme = document.getElementById("changetheme")
var selectedItem = "";

var checkbox = document.getElementById("checkbox")
var checkBoxSelected = false;
//add 
addbtn.addEventListener("click", function () {
    if (input.value) {
        var li = document.createElement("li")

        var checkBox = document.createElement("input")
        checkBox.type = "checkbox"
        checkBox.style.margin = "10px"

        var b = document.createElement("b")
        b.innerText = input.value
        b.style.display = "inline-block"
        b.style.margin = "10px"
        b.style.width = "400px"
        b.style.overflow = "hidden"

        var key = firebase.database().ref("todos").push().key;



        var editbtn = document.createElement("button")

        var editicon = document.createElement("i")
        editicon.classList.add("fa-pen")
        editicon.classList.add("fa-solid")
        editbtn.setAttribute("id",key)
        editbtn.appendChild(editicon)
        editbtn.setAttribute("onclick", 'edittext(this)')


        var deletebtn = document.createElement("button")
        var deleteicon = document.createElement("i")
        deleteicon.classList.add("fa-trash-can")
        deleteicon.classList.add("fa-solid")
        deletebtn.appendChild(deleteicon)
        deletebtn.setAttribute("onclick", 'deletetext(this)')
        deletebtn.setAttribute("id",key)


        addfirebaseItem(input.value,key)
        li.appendChild(checkBox)
        li.appendChild(b)
        li.appendChild(editbtn)
        li.appendChild(deletebtn)
        maincontent.appendChild(li)
      

        
    }
})

async function addfirebaseItem(val,key){
    var userId = localStorage.getItem("userId")
    //for generate key for store data 
    var object = {
        "todo":val,
        "todo_key":key,
    }
    await firebase.database().ref("todos").child(userId).child(key).set(object)
    input.value = ""
    // setItem()
}

async function deletetext(e) {
    console.log(e.id)

    console.log(e.parentNode)
    e.parentNode.remove()
    var usserid = localStorage.getItem("userId")
    console.log(usserid)
    await firebase.database().ref("todos").child(usserid).child(e.id).remove()
    setItem()

}
//edit 
function edittext(e) {

    input.value = e.parentNode.childNodes[1].innerText
    addbtn.style.display = "none"
    deletebtn.style.display = "none"
    updatebtn.style.display = "inline"
    input.focus()
    selectedItem = e.parentNode.childNodes[1]
    console.log(selectedItem)

    // var inputfield  = document.createElement("input")
    // e.parentNode.childNodes[1].remove()
    // e.parentNode.childNodes[1].appendChild(inputfield)



}
//update
updatebtn.addEventListener("click", async function () {
    if (input.value) {
    var key = selectedItem.parentNode.children[2].id
    var usserid = localStorage.getItem("userId")
        selectedItem.innerText = input.value
        
        addbtn.style.display = "inline"
        deletebtn.style.display = "inline"
        updatebtn.style.display = "none"
        await firebase.database().ref("todos").child(usserid).child(key).set({
            "todo":input.value,
        })
        input.value = ""
        setItem()
    }
})

//checkbopx
checkbox.addEventListener("click", function () {
    for (var item of maincontent.children) {
        console.log(item.children[0].checked)
        item.children[0].checked =!checkBoxSelected

    }
    checkBoxSelected =!checkBoxSelected
})


deletebtn.addEventListener("click", function () {
    for(var i=0;i<maincontent.children.length;i++){

        if(maincontent.children[i].children[0].checked){
            maincontent.children[i].remove()
            i = i-1

        }

    }
    checkBoxSelected = false;
    checkbox.checked = false;
    setItem()
})

//local storage data store 
function setItem(){
    var todoItem =[]

    for(var item of maincontent.children){

        todoItem.push(item.children[1].innerText)
    }
    console.log(todoItem)
    localStorage.setItem("TODO",JSON.stringify(todoItem))

}

function SetFirstTime(value){
    var li = document.createElement("li")

    var checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    checkBox.style.margin = "10px"

    var b = document.createElement("b")
    b.innerText = value.todo
    b.style.display = "inline-block"
    b.style.margin = "10px"
    b.style.width = "400px"
    b.style.overflow = "hidden"



    var editbtn = document.createElement("button")

    var editicon = document.createElement("i")
    editicon.classList.add("fa-pen")
    editicon.classList.add("fa-solid")
    editbtn.setAttribute("id",value.todo_key)

    editbtn.appendChild(editicon)
    editbtn.setAttribute("onclick", 'edittext(this)')


    var deletebtn = document.createElement("button")
    var deleteicon = document.createElement("i")
    deleteicon.classList.add("fa-trash-can")
    deleteicon.classList.add("fa-solid")
    deletebtn.appendChild(deleteicon)
    deletebtn.setAttribute("onclick", 'deletetext(this)')
    deletebtn.setAttribute("id",value.todo_key)


    li.appendChild(checkBox)
    li.appendChild(b)
    li.appendChild(editbtn)
    li.appendChild(deletebtn)
    maincontent.appendChild(li)

}

async function getItem(){
   
    var usserid = localStorage.getItem("userId")
    await firebase.database().ref("todos").child(usserid).get()
    .then((snap)=>{
        console.log(snap.val())
        var values = Object.values(snap.val())
        console.log(values)
         for(var item of values){
        SetFirstTime(item)

    }
    })
    .catch((e)=>{
        console.log(e)
    })
    loading.style.display="none"
    dataShow.style.display="block"
}

window.onload = function () {
    var usserid = localStorage.getItem("userId")
    if (usserid) {
       getUserData()
       getItem()
    }
    else{
        window.location.href="index.html"
    }
}
console.log(firebase)

async function getUserData(){
    var userId = localStorage.getItem("userId")
    await firebase.database().ref("users").child(userId).get()
    .then((snap)=>{
        console.log(snap.val())
        console.log(snap.val().name)
        email.innerText = snap.val().email
        nameusser.innerText = snap.val().name
        image.src=snap.val().photo
        image.style.width=100+"px"
         image.style.height=100+"px"
          image.style.borderRadius=100+"%"
        

    })
    .catch((e)=>{
        console.log(e)
    })
}


async function signoutfun() {
    try {
       await firebase.auth().signOut();
       console.log("Successfully logged out");
       localStorage.clear()
       window.location.replace("index.html")
 
    } catch (error) {
       console.error("Error during logout:", error);
    }
 }




























//----------------------previous work to-do-app ---------------------------------

// var maincontent = document.getElementById("maincontent")
// var input = document.getElementById("input")
// var addbtn = document.getElementById("addbtn")
// var deletebtn = document.getElementById("deletebtn")
// var updatebtn = document.getElementById("updatebtn")
// var currentTask = null; // Store the task being edited



// // Add new task
// addbtn.addEventListener("click", function () {
//     if (input.value) {
//         var li = document.createElement("li");

//         var checkBox = document.createElement("input");
//         checkBox.type = "checkbox";
//         checkBox.style.margin = "10px";

//         var b = document.createElement("b");
//         b.innerText = input.value;
//         b.style.display = "inline-block";
//         b.style.margin = "10px";
//         b.style.width = "400px";
//         b.style.overflow = "hidden";

//         var editbtn = document.createElement("button");
//         var editicon = document.createElement("i");
//         editicon.classList.add("fa-pen");
//         editicon.classList.add("fa-solid");
//         editbtn.appendChild(editicon);
//         editbtn.setAttribute("onclick", 'edittext(this)');

//         var deletebtn = document.createElement("button");
//         var deleteicon = document.createElement("i");
//         deleteicon.classList.add("fa-trash-can");
//         deleteicon.classList.add("fa-solid");
//         deletebtn.appendChild(deleteicon);
//         deletebtn.setAttribute("onclick", 'deletetext(this)');

//         li.appendChild(checkBox);
//         li.appendChild(b);
//         li.appendChild(editbtn);
//         li.appendChild(deletebtn);
//         maincontent.appendChild(li);
//         input.value = "";
//     }
// });

// // Delete single task
// function deletetext(e) {
//     e.parentNode.remove();
// }

// // Edit task
// function edittext(e) {
//     currentTask = e.parentNode; // Store the current task element
//     input.value = currentTask.childNodes[1].innerText; // Fill the input with the current task's text
//     addbtn.style.display = "none";
//     deletebtn.style.display = "none";
//     updatebtn.style.display = "inline";
//     input.focus();
// }

// // Update task
// updatebtn.addEventListener("click", function () {
//     if (currentTask && input.value) {
//         currentTask.childNodes[1].innerText = input.value; // Update the task's text
//         input.value = ""; // Clear input field
//         addbtn.style.display = "inline";
//         deletebtn.style.display = "inline";
//         updatebtn.style.display = "none";
//         currentTask = null; // Reset the current task
//     }
// });

// // Select all tasks
// function selectAllTasks() {
//     const checkboxes = document.querySelectorAll('#maincontent input[type="checkbox"]');
//     const selectAllCheckbox = document.getElementById("selectAll");

//     checkboxes.forEach(checkbox => {
//         checkbox.checked = selectAllCheckbox.checked;
//     });
// }

// // Delete all selected tasks
// deletebtn.addEventListener("click", function () {
//     const checkboxes = document.querySelectorAll('#maincontent input[type="checkbox"]');
//     checkboxes.forEach(checkbox => {
//         if (checkbox.checked) {
//             checkbox.parentNode.remove(); // Remove the task if the checkbox is checked
//         }
//     });
// });











//----------------------previous work to-do-app ---------------------------------

// var maincontent = document.getElementById("maincontent")
// var input = document.getElementById("input")
// var addbtn = document.getElementById("addbtn")
// var deletebtn = document.getElementById("deletebtn")
// var updatebtn = document.getElementById("updatebtn")
// // var changetheme = document.getElementById("changetheme")

// addbtn.addEventListener("click",function(){
//     if(input.value){
//     var li = document.createElement("li")

//     var checkBox = document.createElement("input")
//     checkBox.type = "checkbox"
//     checkBox.style.margin="10px"

//     var b = document.createElement("b")
//     b.innerText = input.value
//     b.style.display="inline-block"
//     b.style.margin= "10px"
//     b.style.width="400px"
//     b.style.overflow="hidden"

    
  
//     var editbtn = document.createElement("button")

//     var editicon = document.createElement("i")
//     editicon.classList.add("fa-pen")
//     editicon.classList.add("fa-solid")

//     editbtn.appendChild(editicon)
//     editbtn.setAttribute("onclick",'edittext(this)')


//     var deletebtn = document.createElement("button")
//     var deleteicon = document.createElement("i")
//     deleteicon.classList.add("fa-trash-can")
//     deleteicon.classList.add("fa-solid")
//     deletebtn.appendChild(deleteicon)
//     deletebtn.setAttribute("onclick",'deletetext(this)')
  


//     li.appendChild(checkBox)
//     li.appendChild(b)
//     li.appendChild(editbtn)
//     li.appendChild(deletebtn)
//     maincontent .appendChild(li)
//     input.value=""


   




//     }
// })

// function deletetext(e){
//     console.log(e.parentNode)
//     e.parentNode.remove()

// }

// function edittext(e){
//     console.log(e.parentNode.childNodes[1])
//     input.value = e.parentNode.childNodes[1].innerText
//     addbtn.style.display="none"
//     deletebtn.style.display="none"
//     updatebtn.style.display="inline"
//     input.focus()

//     // var inputfield  = document.createElement("input")
//     // e.parentNode.childNodes[1].remove()
//     // e.parentNode.childNodes[1].appendChild(inputfield)



// }
// // changetheme.addEventListener("click",function(){
// //     document.body.classList.toggle("showdark")
// // })