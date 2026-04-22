// ✅ Firebase imports (MODULAR SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
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

const leadersContainer = document.getElementById("leaders-container");

function createLeaderCards() {
  leaders.forEach(leader => {
    const card = document.createElement("div");
    card.className = "leader-card";
    card.dataset.leaderId = leader.id;

    const img = document.createElement("img");
    img.src = leaderImages[leader.id];
    img.alt = `${leader.name} portrait`;

    const dept = document.createElement("p");
    dept.className = "dept-text";
    dept.textContent = `Dept: ${leader.dept}`;

    const button = document.createElement("a");
    button.className = "leader-card-button";
    button.href = `leader.html?leaderId=${leader.id}`;
    button.textContent = leader.name;

    card.append(img, dept, button);
    leadersContainer.appendChild(card);
  });
}

createLeaderCards();

