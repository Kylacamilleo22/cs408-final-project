// window.onload = loadData();
// window.onload = populateSelect();
window.onload = loaded;
/**
 * Simple Function that will be run when the browser is finished loading.
 */
function loaded() {
    loadData();
    populateSelect();

    // Assign to a variable so we can set a breakpoint in the debugger!
    document.getElementById("editTaskButton")?.addEventListener("click", (event) => {
        event.preventDefault();
        editTaskButton();
    });

}

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
    task.setAttribute("placeholder", "1, 2, 3...");
    t.appendChild(task);

    // Course selection
    let course = document.createElement("input");
    course.setAttribute("type", "text");
    course.setAttribute("id", "course");
    course.setAttribute("placeholder", "CS 408 e.g.");
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
    description.setAttribute("placeholder", "HW 1, Quiz 1, e.g.");
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

    xhr.addEventListener("load", function () {
        // lambda.innerHTML = xhr.response;
        lambda.innerHTML = ""; // no duplicates
        const items = JSON.parse(xhr.response); // parse the item
        
        for (const item of items) {

            console.log("Item:", item);
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

            let editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = function () {
                editRow(item.id);
                
            }
            action.appendChild(editButton);
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
}

function editRow(id) {
    insertSelectedRow(id);
    modalOverlay.style.display = "block"; // Show the modal
    // can also do it in edit page

}

// Get references to the modal elements
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");

// Close the modal when the "Close" button is clicked
closeModal.addEventListener("click", () => {
    modalOverlay.style.display = "none"; // Hide the modal
});

// Closing modal when clicking outside of content
modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
    modalOverlay.style.display = "none"; // Hide the modal
    }
});


function insertSelectedRow(id) {
    let lambda = document.getElementById("bodyTableEdit");
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function () {
        // lambda.innerHTML = xhr.response;
        lambda.innerHTML = ""; // no duplicates
        const items = JSON.parse(xhr.response); // parse the item
            
        // for (const item of items) {
            // if (item.id == id) {
                // console.log("Item:", item);
                var row = lambda.insertRow();
                var id = row.insertCell(0);
                var course = row.insertCell(1);
                var desc = row.insertCell(2);
                var duedate = row.insertCell(3); 
                var progress = row.insertCell(4); 
                var action = row.insertCell(5); 

                // let task = document.createElement("input");
                // task.setAttribute("type", "number");
                // task.setAttribute("id", "taskID_edit");
                // task.setAttribute("value", items.id);
                // id.appendChild(task);
                id.innerText = items.id;

                let c = document.createElement("input");
                c.setAttribute("type", "text");
                c.setAttribute("id", "course_edit");
                c.setAttribute("value", items.course);
                course.appendChild(c);
    
                let des = document.createElement("input");
                des.setAttribute("type", "text");
                des.setAttribute("id", "desc_edit");
                des.setAttribute("value", items.description);
                desc.appendChild(des);

                // Due Date
                let due = document.createElement("input");
                due.setAttribute("type", "date");
                due.setAttribute("id", "duedate_edit");
                due.setAttribute("value", items.duedate);
                duedate.appendChild(due);

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
                
                select_prog.setAttribute("id", "selectProg_edit");
                progress.appendChild(select_prog);


                // id.innerText = items.id;

                
                // course.innerText = items.course;
                // desc.innerText = items.description;
                // duedate.innerText = items.duedate;
                // progress.innerText = items.progress;
    
                let saveButton = document.createElement("button");
                saveButton.textContent = "save";
                saveButton.onclick = function () {
                    saveEditRow();
                    setTimeout(() => {
                        window.location.reload();
                        }, 500);};
                action.appendChild(saveButton);
                let delButton = document.createElement("button");
                delButton.textContent = "Delete";
                delButton.onclick = function () {
                    deleteData(items.id);     
                    setTimeout(() => {
                    window.location.reload();
                }, 500);};
                
                action.appendChild(delButton);
            
            
        }
    );
    xhr.open("GET", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items/" + id);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function saveEditRow() {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");

    var id = document.getElementById("taskID_edit");
    var course = document.getElementById("course_edit");
    var description = document.getElementById("desc_edit");
    var duedate = document.getElementById("duedate_edit");
    var progress = document.getElementById("selectProg_edit");
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
                "id": id.value,
                "course": course.value,
                "description": description.value,
                "duedate": duedate.value,
                "progress": progress.value,
            }));
}



function populateSelect() {
    const select = document.getElementById("selectTask"); // selectTask
    let xhr = new XMLHttpRequest();

    // let lambda = document.getElementById("selectTask");
    select.innerHTML = ""; 
    xhr.addEventListener("load", function () {
        const items = JSON.parse(xhr.response); // parse the item
        
        for (const item of items) {

            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.id;
            select.appendChild(option);
        }
    });
    xhr.open("GET", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items", true);
    xhr.send();
}


function insertSelectedRowForEdit(id) {
    let lambda = document.getElementById("bodyTableEdit");
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function () {
        // lambda.innerHTML = xhr.response;
        lambda.innerHTML = ""; // no duplicates
        const items = JSON.parse(xhr.response); // parse the item
            
        // for (const item of items) {
            // if (item.id == id) {
                // console.log("Item:", item);
                var row = lambda.insertRow();
                var id = row.insertCell(0);
                var course = row.insertCell(1);
                var desc = row.insertCell(2);
                var duedate = row.insertCell(3); 
                var progress = row.insertCell(4); 
                var action = row.insertCell(5); 

                id.innerText = items.id;
                // id.appendChild(task);

                let c = document.createElement("input");
                c.setAttribute("type", "text");
                c.setAttribute("id", "course_edit");
                c.setAttribute("value", items.course);
                course.appendChild(c);
    
                let des = document.createElement("input");
                des.setAttribute("type", "text");
                des.setAttribute("id", "desc_edit");
                des.setAttribute("value", items.description);
                desc.appendChild(des);

                // Due Date
                let due = document.createElement("input");
                due.setAttribute("type", "date");
                due.setAttribute("id", "duedate_edit");
                due.setAttribute("value", items.duedate);
                duedate.appendChild(due);

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
                
                select_prog.setAttribute("id", "selectProg_edit");
                progress.appendChild(select_prog);


                // id.innerText = items.id;

                
                // course.innerText = items.course;
                // desc.innerText = items.description;
                // duedate.innerText = items.duedate;
                // progress.innerText = items.progress;
    
                let saveButton = document.createElement("button");
                saveButton.textContent = "save";
                saveButton.onclick = function () {
                    saveEditRow();
                    setTimeout(() => {
                        location.replace("/html/board.html");
                        }, 500);};
                action.appendChild(saveButton);
                let delButton = document.createElement("button");
                delButton.textContent = "Delete";
                delButton.onclick = function () {
                    deleteData(items.id);     
                    setTimeout(() => {
                        location.replace("/html/board.html");
                        }, 500);};
                action.appendChild(delButton);
        }
    );
    xhr.open("GET", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items/" + id);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}


function editTaskButton() {
    const selectedTask = document.getElementById("selectTask");
    const selectedTaskValue = selectedTask.value;

    console.log("Task Value:", selectedTaskValue);    

    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        const items = JSON.parse(xhr.response); // parse the item
        
        for (const item of items) {

            if (item.id == selectedTaskValue) {
                console.log("item Task Value:", item.id);    
                insertSelectedRowForEdit(item.id);
             
            }
        }
    });
    xhr.open("GET", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items", true);
    xhr.send();
        
}