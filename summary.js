import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQw63fhm4CUuxkQBzendZrr7mf1YSiDaA",
  authDomain: "leaders-question-app.firebaseapp.com",
  projectId: "leaders-question-app",
  storageBucket: "leaders-question-app.firebasestorage.app",
  messagingSenderId: "828044191577",
  appId: "1:828044191577:web:fb565c4ec3e4ab51590e48",
  measurementId: "G-G018NWDGGY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import { leaders, leaderImages } from "./data.js";

const summaryContainer = document.getElementById("summary-container");

function renderCards(summaryData) {
  summaryContainer.innerHTML = "";

  leaders.forEach(leader => {
    const card = document.createElement("div");
    card.className = "summary-card";

    const img = document.createElement("img");
    img.src = leaderImages[leader.id];
    img.alt = `${leader.name} portrait`;

    const dept = document.createElement("p");
    dept.textContent = leader.dept;
    dept.className = "dept-text";

    const count = summaryData[leader.id]?.length || 0;
    const questionsText = document.createElement("p");
    questionsText.textContent = `${count} questions`;
    questionsText.className = "questions-count";

    const name = document.createElement("button");
    name.className = "leader-card-button";
    name.textContent = leader.name;
    name.addEventListener("click", () => {
      window.location.href = `questions.html?leaderId=${leader.id}`;
    });

    card.append(img, dept, questionsText, name);
    summaryContainer.appendChild(card);
  });
}

async function loadSummary() {
  const snapshot = await getDocs(collection(db, "questions"));
  const summaryData = {};

  snapshot.forEach(doc => {
    const { leaderId, text } = doc.data();
    summaryData[leaderId] = summaryData[leaderId] || [];
    summaryData[leaderId].push(text);
  });

  renderCards(summaryData);
}

loadSummary();
