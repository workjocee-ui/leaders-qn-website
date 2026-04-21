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

const leaders = [
  { id: 1, name: "Christian Lim", dept: "Enterprise Services" },
  { id: 2, name: "Michelle Tay", dept: "Enterprise Services" },
  { id: 3, name: "Emisukri Abdul Rahman", dept: "Enterprise Services" },
  { id: 4, name: "Danny Boey", dept: "Enterprise Services" },
  { id: 5, name: "Steven Er", dept: "Enterprise Services" },
  { id: 6, name: "Judy Loh", dept: "Enterprise Services" },
  { id: 7, name: "Chee Wee Tan", dept: "Enterprise Services" },
  { id: 8, name: "Francis Tan", dept: "Enterprise Services" },
  { id: 9, name: "Vince Tan", dept: "Enterprise Services" },
  { id: 10, name: "Ajith Thadiyil Vidyadharan", dept: "Enterprise Services" },
  { id: 11, name: "Yung Yeow Wong", dept: "Enterprise Services" },
  { id: 12, name: "Hong Eng Yap", dept: "Enterprise Services" },
  { id: 13, name: "Hendra Setiawan", dept: "Enterprise Services" },
  { id: 14, name: "Ming Wen Yang", dept: "Enterprise Services" },
  { id: 15, name: "Lawrence Ong", dept: "Enterprise Services" },
  { id: 16, name: "Shaofeng Zhu", dept: "Enterprise Services" }
];

const leaderImages = {
  1: "Images for Leaders/Christian Lim.jpg",
  2: "Images for Leaders/Michelle Tay.jpg",
  3: "Images for Leaders/Emisukri Abdul Rahman.jpg",
  4: "Images for Leaders/Danny Boey.jpg",
  5: "Images for Leaders/Steven Er.jpg",
  6: "https://via.placeholder.com/300?text=Judy+Loh",
  7: "Images for Leaders/Chee Wee Tan.jpg",
  8: "Images for Leaders/Francis Tan.jpg",
  9: "Images for Leaders/Vince Tan.jpg",
  10: "Images for Leaders/Ajith Thadiyil Vidyadharan.jpg",
  11: "Images for Leaders/Yung Yeow Wong.jpg",
  12: "Images for Leaders/Hong Eng Yap.jpg",
  13: "Images for Leaders/Hendra Setiawan.jpg",
  14: "Images for Leaders/Ming Wen Yang.jpg",
  15: "https://via.placeholder.com/300?text=Lawrence+Ong",
  16: "Images for Leaders/Shaofeng Zhu.jpg"
};

const pageTitle = document.getElementById("page-title");
const leaderImageEl = document.getElementById("leader-image");
const leaderNameEl = document.getElementById("leader-name");
const leaderDeptEl = document.getElementById("leader-dept");
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