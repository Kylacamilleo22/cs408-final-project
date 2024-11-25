// window.onload = loaded;

/**
 * Simple Function that will be run when the browser is finished loading.
 */
// function loaded() {
//     // Assign to a variable so we can set a breakpoint in the debugger!
//     const hello = sayHello();
//     console.log(hello);
// }

function addRow() {
    let rows = document.getElementById("myTable");

    var r = rows.insertRow();
    var c = r.insertCell(0); 
    var t = r.insertCell(1); 
    var d = r.insertCell(2); 
    var p = r.insertCell(3); 
    var a = r.insertCell(4); 

    // Course selection
    let course = document.createElement("input");
    course.setAttribute("type", "text");
    course.setAttribute("id", "course");
    c.appendChild(course);

    /**
     * If decided to use drop down option for course select
     */
    // let select_course = document.createElement("select");
    
    // var option1 = document.createElement("option"); 
    // option1.value = "value1"; 
    // option1.text = "Option 1"; 
    // select_course.appendChild(option1); 

    // var option2 = document.createElement("option"); 
    // option2.value = "value2"; 
    // option2.text = "Option 2"; 
    // select_course.appendChild(option2); 


    // var option1 = document.createElement("option"); 
    // option1.value = "value1"; 
    // option1.text = "Option 1"; 
    // select_course.appendChild(option1); 
    
    // c.appendChild(select_course);

    // Task input
    let task = document.createElement("input");
    task.setAttribute("type", "text");
    task.setAttribute("id", "task");
    t.appendChild(task);


    // Due Date
    let duedate = document.createElement("input");
    duedate.setAttribute("type", "date");
    duedate.setAttribute("id", "duedate");
    d.appendChild(duedate);
    
    // Progress    
    let select_prog = document.createElement("select");
    
    var notstarted = document.createElement("option"); 
    notstarted.value = "notstarted"; 
    notstarted.text = "Not Started"; 
    select_prog.appendChild(notstarted); 

    var inprog = document.createElement("option"); 
    inprog.value = "inprog"; 
    inprog.text = "In Progress"; 
    select_prog.appendChild(inprog); 

    var complete = document.createElement("option"); 
    complete.value = "complete"; 
    complete.text = "Complete"; 
    select_prog.appendChild(complete); 
    
    select_prog.setAttribute("id", "selectProg");
    p.appendChild(select_prog);

    // Action
    let delButton = document.createElement("button");
    delButton.textContent = "Delete";
    delButton.onclick = function () { deleteData(item.id);};
    delButton.setAttribute("id", "delButton");
    a.appendChild(delButton);
}


// Send/Add data using PUT
function sendData() {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");

    var course = document.getElementById("id");
    var task = document.getElementById("name");
    var duedate = document.getElementById("price");
    var progress = document.getElementById("checkItemAdded");

    if (course.value != "" || task.value != "" || duedate.value != "" || progress.value != "") {
    xhr.send(JSON.stringify({
                "course": course.value,
                "task": task.value,
                "duedate": duedate.value,
                "progress": progress.value
            }));
            // check.textContent = "Added Item. Load the table to check";
    } else {
        // check.textContent = "Cannot add empty values";
    }
}

const inputField = document.getElementById('userInput');
    const label = document.getElementById('placeholderLabel');

    inputField.addEventListener('input', function () {
      if (inputField.value.trim() !== '') {
        label.style.display = 'inline'; // Show the label
        inputField.placeholder = ''; // Clear the placeholder
      } else {
        label.style.display = 'none'; // Hide the label
        inputField.placeholder = 'Type something here...'; // Restore the placeholder
      }
    });
