// leader.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  doc,          // Add this
  updateDoc,    // Add this
  increment     // Add this
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

import { leaders, leaderImages } from "./data.js";

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

onSnapshot(q, (snapshot) => {
  questionsContainer.innerHTML = "";

  if (snapshot.empty) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "no-questions";
    emptyMessage.textContent = "No questions have been added for this leader yet.";
    questionsContainer.appendChild(emptyMessage);
    return;
  }

  // Convert snapshot to array so we can sort by upvotes on the user page too
  const questionsArray = [];
  snapshot.forEach((docSnap) => {
    questionsArray.push({ id: docSnap.id, ...docSnap.data() });
  });

  // Sort descending by upvotes
  questionsArray.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

  questionsArray.forEach((questionData) => {
    const li = document.createElement("li");
    li.className = "question-item";

    const textSpan = document.createElement("span");
    textSpan.textContent = questionData.text;

    const voteContainer = document.createElement("div");
    voteContainer.className = "vote-container";

    const voteCount = document.createElement("span");
    voteCount.className = "vote-count";
    voteCount.textContent = `${questionData.upvotes || 0} votes`;

    const upvoteBtn = document.createElement("button");
    upvoteBtn.textContent = "▲ Vote Me!";
    upvoteBtn.className = "upvote-btn";
    
    // Upvote click logic
    upvoteBtn.addEventListener("click", async () => {
      try {
        const questionRef = doc(db, "questions", questionData.id);
        await updateDoc(questionRef, {
          upvotes: increment(1)
        });
      } catch (error) {
        console.error("Error upvoting:", error);
      }
    });

    voteContainer.append(voteCount, upvoteBtn);
    li.append(textSpan, voteContainer);
    questionsContainer.appendChild(li);
  });
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
      text: text,
      timestamp: new Date(),
      upvotes: 0 // Initialize upvotes to 0
    });
    questionInput.value = "";
    limitMsg.textContent = "";
  } catch (error) {
    console.error("Error adding question:", error);
    limitMsg.textContent = "Failed to add question. Check console for details.";
  }
});