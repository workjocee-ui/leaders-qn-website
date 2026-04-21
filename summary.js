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

const leaders = [
  { id: 1, name: "Christian Lim", dept: "Enterprise Services" },
  { id: 2, name: "Michelle Tay", dept: "Enterprise Services" },
  { id: 3, name: "Emisukri Abdul Rahman", dept: "Enterprise Services" },
  { id: 4, name: "Danny Boey", dept: "Enterprise Services" },
  { id: 5, name: "Judy Loh", dept: "Enterprise Services" },
  { id: 6, name: "Chee Wee Tan", dept: "Enterprise Services" },
  { id: 7, name: "Francis Tan", dept: "Enterprise Services" },
  { id: 8, name: "Vince Tan", dept: "Enterprise Services" },
  { id: 9, name: "Ajith Thadiyil Vidyadharan", dept: "Enterprise Services" },
  { id: 10, name: "Yung Yeow Wong", dept: "Enterprise Services" },
  { id: 11, name: "Hendra Setiawan", dept: "Enterprise Services" },
  { id: 12, name: "Ming Wen Yang", dept: "Enterprise Services" },
  { id: 13, name: "Lawrence Ong", dept: "Enterprise Services" },
  { id: 14, name: "Shaofeng Zhu", dept: "Enterprise Services" }
];

const leaderImages = {
  1: "Images for Leaders/Christian Lim.jpg",
  2: "Images for Leaders/Michelle Tay.jpg",
  3: "Images for Leaders/Emisukri Abdul Rahman.jpg",
  4: "Images for Leaders/Danny Boey.jpg",
  5: "Images for Leaders/Judy Loh.jpg",
  6: "Images for Leaders/Chee Wee Tan.jpg",
  7: "Images for Leaders/Francis Tan.jpg",
  8: "Images for Leaders/Vince Tan.jpg",
  9: "Images for Leaders/Ajith Thadiyil Vidyadharan.jpg",
  10: "Images for Leaders/Yung Yeow Wong.jpg",
  11: "Images for Leaders/Hendra Setiawan.jpg",
  12: "Images for Leaders/Ming Wen Yang.jpg",
  13: "Images for Leaders/Lawrence Ong.jpg",
  14: "Images for Leaders/Shaofeng Zhu.jpg"
};

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
