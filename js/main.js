window.onload = loadData();

/**
 * Simple Function that will be run when the browser is finished loading.
 */
// function loaded() {
//     // Assign to a variable so we can set a breakpoint in the debugger!
//     const hello = sayHello();
//     console.log(hello);
// }

let taskNum = 0;

function addRow() {

// Append the row to the table body
    // let rows = document.getElementById("myTable");
    let newRow = document.createElement("tr");

    // var r = rows.insertRow();
    let t = document.createElement("td"); // For task input
    let c = document.createElement("td"); // For task input
    let desc = document.createElement("td"); // For task input
    let d = document.createElement("td"); // For due date
    let p = document.createElement("td"); // For progress dropdown
    let a = document.createElement("td"); // For actions


    /**
     * If decided to use drop down option for course select
     */
    // let select_course = document.createElement("select");

    let task = document.createElement("input");
    task.setAttribute("type", "number");
    task.setAttribute("id", "taskID");
    task.setAttribute("placeholder", "1");
    t.appendChild(task);

    // Course selection
    let course = document.createElement("input");
    course.setAttribute("type", "text");
    course.setAttribute("id", "course");
    course.setAttribute("placeholder", "e.g. CS 408");
    c.appendChild(course);

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

    // Description
    let description = document.createElement("input");
    description.setAttribute("type", "text");
    description.setAttribute("id", "desc");
    description.setAttribute("placeholder", "e.g. HW 1");
    desc.appendChild(description);

    // Action
    let save = document.createElement("button");
    save.textContent = "Save";
    // save.onclick = function () { sendData();};
    save.setAttribute("id", "saveButton");
    save.onclick = function () { sendData();     
        setTimeout(() => {
        window.location.reload();
      }, 500);};
    a.appendChild(save);

    // Append the cells to the row
    newRow.appendChild(t);
    newRow.appendChild(c);
    newRow.appendChild(desc);
    newRow.appendChild(d);
    newRow.appendChild(p);
    newRow.appendChild(a);

    document.getElementById("bodyTable").appendChild(newRow);
    taskNum++;
    console.log("addingrow: " + task.value);
    
}

// Send/Add data using PUT
function sendData() {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");

    var id = document.getElementById("taskID");
    var course = document.getElementById("course");
    var description = document.getElementById("desc");
    var duedate = document.getElementById("duedate");
    var progress = document.getElementById("selectProg");
    // console.log("Course Element:", course.value);
    // console.log("Task Element:", task);
    // console.log("Due Date Element:", duedate);
    // console.log("Progress Element:", progress);

    console.log("Task Value:", id ? id.value : null);    
    console.log("Course Value:", course ? course.value : null);
    console.log("Description Value:", description ? description.value : null);
    console.log("Due Date Value:", duedate ? duedate.value : null);
    console.log("Progress Value:", progress ? progress.value : null);
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { // Request completed
            if (xhr.status === 200) {
                alert("Data successfully saved!");
            } else {
                alert("Error saving data: " + xhr.statusText);
            }
        }
    };
    xhr.send(JSON.stringify({
                // "id": String(taskNum),
                "id": id.value,
                "course": course.value,
                "description": description.value,
                "duedate": duedate.value,
                "progress": progress.value,
            }));
}

//Loads the data using GET
function loadData(){
    let lambda = document.getElementById("bodyTable");
    let xhr = new XMLHttpRequest();
    // xhr.onload = function () {
    //     if (xhr.status >= 200 && xhr.status < 300) {
    //         console.log("Raw response:", xhr.response); // Log raw response
    //         try {
    //             const items = JSON.parse(xhr.response);
    //             console.log("Parsed items:", items); // Log parsed response
    //         } catch (err) {
    //             console.error("Error parsing JSON:", err);
    //         }
    //     } else {
    //         console.error(`Request failed with status ${xhr.status}`);
    //     }
    // };
    xhr.addEventListener("load", function () {
        // lambda.innerHTML = xhr.response;
        lambda.innerHTML = ""; // no duplicates
        const items = JSON.parse(xhr.response); // parse the item
        
        for (const item of items) {
            console.log("Item:", item);

        // iterate through all items
        // items.forEach(item => {
            //cell.appendChild(cellText);
            //row.appendChild(cell);
            var row = lambda.insertRow();
            var id = row.insertCell(0);
            var course = row.insertCell(1);
            var desc = row.insertCell(2);
            var duedate = row.insertCell(3); 
            var progress = row.insertCell(4); 
            var action = row.insertCell(5); 

            id.innerText = item.id;
            course.innerText = item.course;
            desc.innerText = item.description;
            duedate.innerText = item.duedate;
            progress.innerText = item.progress;
            
            // let save = document.createElement("button");
            // save.textContent = "Save";
            // // save.onclick = function () { sendData();};
            // save.setAttribute("id", "saveButton");
            // save.onclick = function () { sendData();};
            // action.appendChild(save);
            // // need delete button
            let delButton = document.createElement("button");
            delButton.textContent = "Delete";
            delButton.onclick = function () {
                deleteData(item.id);     
                setTimeout(() => {
                window.location.reload();
              }, 500);};
            action.appendChild(delButton);
        }
    });

    xhr.open("GET", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items", true);
    xhr.send();
    
}

function deleteData(id) {
    let xhr = new XMLHttpRequest();
    // lambdaUrl + itemNumber
    // const lambdaUrl = "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items" + id;
    xhr.open("DELETE", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items/" + id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    loadData();
    // checkDelete(); // Display message that it has been deleted -- not working
}

function addCourse () {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        // lambda.innerHTML = xhr.response;
        lambda.innerHTML = ""; // no duplicates
        const items = JSON.parse(xhr.response); // parse the item
        
        // iterate through all items
        items.forEach(item => {
            //cell.appendChild(cellText);
            //row.appendChild(cell);
            var row = lambda.insertRow();
            var id = row.insertCell(0);
            var course = row.insertCell(1);
            var desc = row.insertCell(2);
            var duedate = row.insertCell(3); 
            var progress = row.insertCell(4); 
            var action = row.insertCell(5); 

            id.innerText = item.id;
            course.innerText = item.course;
            desc.innerText = item.description;
            duedate.innerText = item.duedate;
            progress.innerText = item.progress;
            
            // let save = document.createElement("button");
            // save.textContent = "Save";
            // // save.onclick = function () { sendData();};
            // save.setAttribute("id", "saveButton");
            // save.onclick = function () { sendData();};
            // action.appendChild(save);
            // // need delete button
            let delButton = document.createElement("button");
            delButton.textContent = "Delete";
            delButton.onclick = function () {deleteData(item.id);     setTimeout(() => {
                window.location.reload();
              }, 500);};
            action.appendChild(delButton);
        });
    });

    xhr.open("GET", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
    

}