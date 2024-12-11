window.onload = displayGoals();
// having the same id overlaps with task, so I just add 100 to id to differentiate. 
let goalID = 102;

function sendData() {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://m14zlk7u19.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");

    var goalid = document.getElementById("goalid");
    var goalName = document.getElementById("goalName");
    var goalDesc = document.getElementById("goalDesc");

    let toNum = goalid.value;
    let idToNum = Number(toNum) + goalID;

    // let goalIDValid =  (Number(goalid.value) + goalID);
    console.log("Goal Name:", goalName ? goalName.value : null);    
    console.log("Goal Desc:", goalDesc ? goalDesc.value : null);    
    console.log("Goal idvalid:", idToNum ? idToNum.value : null);    

    // For testing purposes
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4) { // Request completed
    //         if (xhr.status === 200) {
    //             alert("Data successfully saved!");
    //         } else {
    //             alert("Error saving data: " + xhr.statusText);
    //         }
    //     }
    // };
    xhr.send(JSON.stringify({
                "id": idToNum.toString(),
                // "id": goalID.toString(),
                "goalid": goalid.value,
                "goalname": goalName.value,
                "goaldesc": goalDesc.value,
            }));
            goalID++;
    setTimeout(() => {
        window.location.reload();
    }, 500);

}

function displayGoals() {
    var goalsContainer = document.getElementById("goalsContainer");

    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function () {
        // lambda.innerHTML = xhr.response;
        const items = JSON.parse(xhr.response); // parse the item
        
        for (const item of items) {
            if (Number(item.id) > 100) {
                let goalBox = document.createElement("div");

                let goalTitle = document.createElement("h3");
                goalTitle.textContent =  item.goalname;
                // let goalID = document.createElement("p")
                // goalID.textContent = "Goal id: " + item.goalid;
                let goalDesc = document.createElement("p");
                goalDesc.textContent = item.goaldesc;
                
                let delButton = document.createElement("button");
                delButton.textContent = "Complete";
                delButton.onclick = function () {
                    deleteData(item.id);     
                    setTimeout(() => {
                    window.location.reload();
                }, 500);};

                goalBox.appendChild(goalTitle);
                // goalBox.appendChild(goalID);
                goalBox.appendChild(goalDesc);
                goalBox.appendChild(delButton);
                goalsContainer.appendChild(goalBox);

            }
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
}
