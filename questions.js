// questions.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
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
const topQuestionsList = document.getElementById("top-questions-list");
const questionsList = document.getElementById("questions-list");

const urlParams = new URLSearchParams(window.location.search);
const leaderId = parseInt(urlParams.get('leaderId'));
const leader = leaders.find(l => l.id === leaderId);

if (!leader) {
  alert("Leader not found");
  window.location.href = "summary.html";
}

pageTitle.textContent = `Questions for ${leader.name}`;
leaderImageEl.src = leaderImages[leader.id];
leaderNameEl.textContent = leader.name;
leaderDeptEl.textContent = leader.dept;

async function loadQuestions() {
  const q = query(collection(db, "questions"), where("leaderId", "==", leaderId));
  const snapshot = await getDocs(q);

  topQuestionsList.innerHTML = "";
  questionsList.innerHTML = "";

  if (snapshot.empty) {
    const li = document.createElement("li");
    li.textContent = "No questions have been submitted for this leader yet.";
    questionsList.appendChild(li);
    return;
  }

  // Load into an array to sort manually
  let allQuestions = [];
  snapshot.forEach(doc => {
    allQuestions.push({ id: doc.id, ...doc.data() });
  });

  // Sort by highest upvotes
  allQuestions.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

  // Split into Top 3 and the Rest
  const top3 = allQuestions.slice(0, 3);
  const theRest = allQuestions.slice(3);

  top3.forEach((q) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${q.text}</strong> <span class="vote-badge">${q.upvotes || 0} votes</span>`;
    topQuestionsList.appendChild(li);
  });

  theRest.forEach((q) => {
    const li = document.createElement("li");
    li.innerHTML = `${q.text} <span class="vote-badge">${q.upvotes || 0} votes</span>`;
    questionsList.appendChild(li);
  });
}

loadQuestions();