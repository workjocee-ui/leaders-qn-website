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

const pageTitle = document.getElementById("page-title");
const leaderImageEl = document.getElementById("leader-image");
const leaderNameEl = document.getElementById("leader-name");
const leaderDeptEl = document.getElementById("leader-dept");
const questionsTitle = document.getElementById("questions-title");
const questionsContainer = document.getElementById("questions-container");
const questionInput = document.getElementById("question-input");
const addBtn = document.getElementById("add-question-btn");
const limitMsg = document.getElementById("question-limit-msg");

const urlParams = new URLSearchParams(window.location.search);
const leaderId = parseInt(urlParams.get('leaderId'));
const leader = leaders.find(l => l.id === leaderId);

if (!leader) {
  alert("Leader not found");
  window.location.href = "index.html";
}

pageTitle.textContent = `Questions for ${leader.name}`;
leaderImageEl.src = leaderImages[leader.id];
leaderNameEl.textContent = leader.name;
leaderDeptEl.textContent = leader.dept;
questionsTitle.textContent = "Questions:";

const q = query(collection(db, "questions"), where("leaderId", "==", leaderId));
onSnapshot(q, snapshot => {
  console.log("Snapshot received, docs count:", snapshot.size);
  questionsContainer.innerHTML = "";

  if (snapshot.empty) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "no-questions";
    emptyMessage.textContent = "No questions have been added for this leader yet.";
    questionsContainer.appendChild(emptyMessage);
    return;
  }

  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().text;
    questionsContainer.appendChild(li);
  });
}, error => {
  console.error("Snapshot error:", error);
});

addBtn.addEventListener("click", async () => {
  const text = questionInput.value.trim();
  if (!text) return;

  const snap = await getDocs(q);

  if (snap.size >= 15) {
    limitMsg.textContent = "Maximum of 15 questions reached.";
    return;
  }

  try {
    await addDoc(collection(db, "questions"), {
      leaderId: leaderId,
      text
    });
    console.log("Question added successfully");
    questionInput.value = "";
    limitMsg.textContent = "";
  } catch (error) {
    console.error("Error adding question:", error);
    limitMsg.textContent = "Failed to add question. Check console for details.";
  }
});