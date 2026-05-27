const firebaseConfig = {
  apiKey: "AIzaSyCq_K4YFMKSVvtvev20dYMPTr8RyqoWnjc",
  authDomain: "medical-aae78.firebaseapp.com",
  projectId: "medical-aae78"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function sendRequest() {
  let med = document.getElementById("medicine").value;

  
  db.collection("responses").get().then(snapshot => {
    snapshot.forEach(doc => {
      db.collection("responses").doc(doc.id).delete();
    });

    
    db.collection("requests").add({
      medicine: med,
      timestamp: Date.now()
    }).then(docRef => {
      localStorage.setItem("requestId", docRef.id);
      alert("Request Sent!");
    });
  });
}

function loadRequests() {
  db.collection("requests")
    .orderBy("timestamp", "desc")
    .limit(1) 
    .onSnapshot(snapshot => {

      let list = document.getElementById("requests");
      list.innerHTML = "";

      snapshot.forEach(doc => {
        let data = doc.data();

        let li = document.createElement("li");
        li.innerHTML = `
          ${data.medicine}
          <br>
          <button onclick="respond('${doc.id}','same')">Same</button>
          <button onclick="respond('${doc.id}','alt')">Alternative</button>
          <button onclick="respond('${doc.id}','no')">No</button>
        `;
        list.appendChild(li);
      });
    });
}

function respond(id, status) {
  let altName = "";

  if (status === "alt") {
    altName = prompt("Enter alternative name:");
  }

  db.collection("responses").add({
    requestId: id,
    status: status,
    alternative: altName
  });

  alert("Response sent!");
}

function loadResponses() {
  db.collection("responses").onSnapshot(snapshot => {
    let list = document.getElementById("results");
    list.innerHTML = "";

    snapshot.forEach(doc => {
      let data = doc.data();

      let li = document.createElement("li");
      li.innerText = `Status: ${data.status} | Alt: ${data.alternative}`;
      list.appendChild(li);
    });
  });
}