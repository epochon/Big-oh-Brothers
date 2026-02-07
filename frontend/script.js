// script.js
function submitData() {
  // Show the result container
  const resultContainer = document.getElementById("result-container");
  resultContainer.style.display = "block"; // Make visible

  // Clear previous results and show loading state
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "<p>Analyzing data... this may take a few seconds.</p>";

  const crop = document.getElementById("crop").value;
  const land = document.getElementById("land").value;
  const investment = document.getElementById("investment").value;
  const location = document.getElementById("location").value;

  if (!crop || !land || !location) {
    alert("Please fill all details (Crop, Land Size, Location) to get accurate advice!");
    return;
  }

  const data = {
    crop: crop,
    land: land,
    investment: investment,
    location: location
  };

  fetch("http://127.0.0.1:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (!res.ok) throw new Error("Server Error");
      return res.json();
    })
    .then(data => {
      // Helper function to format text (basic markdown to HTML)
      const formatText = (text) => {
        if (!text) return "";
        return text
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
          .replace(/\n/g, '<br>'); // Newlines
      };


      // Check for backend error
      if (data.error) {
        throw new Error(data.error);
      }

      // Safe check for deals
      const deals = data.deals || [];
      const dealSectionInfo = deals.length > 0 ? `
        <!-- DEAL FINDER CARD -->
        <div class="container" style="border-left: 5px solid #000000; background: linear-gradient(135deg, rgba(0,0,0,0.05), rgba(255,255,255,0.95)); grid-column: span 2;">
            <h3 style="color: #000000;">🤝 Deal Finder & Contract</h3>
            <p>Compare buyers and sell directly:</p>
            <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background: #e5e7eb;">
                    <th style="padding: 8px; text-align: left;">Buyer</th>
                    <th style="padding: 8px; text-align: left;">Price/Qt</th>
                    <th style="padding: 8px; text-align: left;">Total Income</th>
                    <th style="padding: 8px; text-align: center;">Action</th>
                </tr>
                ${deals.map(deal => `
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 8px;"><b>${deal.buyer}</b><br><small>${deal.type}</small></td>
                        <td style="padding: 8px;">₹${deal.price_per_qt}</td>
                        <td style="padding: 8px; color: green; font-weight: bold;">₹${deal.total_earning.toLocaleString()}</td>
                        <td style="padding: 8px; text-align: center;">
                            <button onclick="openContract('${deal.buyer}', '${deal.price_per_qt}', '${deal.total_earning}')" style="background: #111827; padding: 5px 10px; font-size: 0.8rem;">Sell Now</button>
                        </td>
                    </tr>
                `).join('')}
            </table>
        </div>` : '';

      // Create separate cards for each section
      resultDiv.innerHTML = `
      <div class="results-grid">
        <div class="container" style="border-left: 5px solid #3b82f6; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(255,255,255,0.9));">
          <h3 style="color: #1e40af;">🌍 Environment Analysis</h3>
          <p>${formatText(data.environment)}</p>
        </div>
        
        <div class="container" style="border-left: 5px solid #f59e0b; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(255,255,255,0.9));">
          <h3 style="color: #b45309;">📈 Market Analysis</h3>
          <p>${formatText(data.market)}</p>
        </div>

        <div class="container" style="border-left: 5px solid #8b5cf6; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255,255,255,0.9));">
          <h3 style="color: #5b21b6;">💰 Maximum Revenue (Sales)</h3>
          <p>${formatText(data.sales)}</p>
        </div>

        <div class="container" style="border-left: 5px solid #ef4444; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(255,255,255,0.9));">
          <h3 style="color: #991b1b;">🛡️ Insurance & Schemes</h3>
          <p>${formatText(data.insurance)}</p>
        </div>
        
        ${dealSectionInfo}

        <div class="container" style="border-left: 5px solid #10b981; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(255,255,255,0.9));">
          <h3 style="color: #047857;">✅ Strategic Roadmap</h3>
          <p>${formatText(data.decision)}</p>
        </div>
      </div>
    `;
      saveHistory(data); // Save the result to history
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("result").innerHTML = `<div style="text-align: center; color: white; background: rgba(239, 68, 68, 0.8); padding: 20px; border-radius: 10px;">
        <h3>⚠️ Error</h3>
        <p>${error.message}</p>
        <small>Please ensure the backend server is running.</small>
      </div>`;
    });
}

// Format text logic
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>");
}

/* --- Authentication & Profile Logic --- */

// Check if user is logged in
function checkLogin() {
  const user = localStorage.getItem("farmerUserSession"); // Session only
  const currentPage = window.location.pathname.split("/").pop();

  if (!user && currentPage !== "login.html") {
    window.location.href = "login.html";
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check login status for redirection on protected pages
  checkLogin();

  // Add Dynamic Login/Profile Button to Home Page
  if (!window.location.href.includes("login.html") && !window.location.href.includes("profile.html")) {
    const user = localStorage.getItem("farmerUserSession");
    const header = document.querySelector('h1');

    // Remove existing button if any to prevent duplicates
    const existingBtn = document.getElementById('auth-btn-container');
    if (existingBtn) existingBtn.remove();

    if (header) {
      const btnContainer = document.createElement('div');
      btnContainer.id = 'auth-btn-container';

      if (user) {
        // Logged In -> Show Profile Button
        btnContainer.innerHTML = `
            <button id="profile-btn" onclick="window.location.href='profile.html'" style="width: auto; margin-bottom: 20px; background: #8b5cf6;">View Profile 👨‍🌾</button>
        `;
      } else {
        // Not Logged In -> Show Login Button
        btnContainer.innerHTML = `
            <button id="login-btn" onclick="window.location.href='login.html'" style="width: auto; margin-bottom: 20px; background: #2563eb;">Login 🔐</button>
        `;
      }
      header.parentNode.insertBefore(btnContainer, header.nextSibling);
    }
  }
});

function loginUser() {
  const name = document.getElementById("username").value.trim();
  const loc = document.getElementById("user-location").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (name && loc && pass) {
    // Get User Database
    let db = JSON.parse(localStorage.getItem("farmerDB")) || {};

    // Check if user exists
    if (db[name]) {
      // Validation (Verify Password)
      if (db[name].password === pass) {
        // Success
        const session = { name: name, location: db[name].location };
        localStorage.setItem("farmerUserSession", JSON.stringify(session));
        alert("Welcome back, " + name + "! 🚜");
        window.location.href = "index.html";
      } else {
        // Fail
        alert("❌ Incorrect Password!");
      }
    } else {
      // Register New User
      db[name] = { location: loc, password: pass };
      localStorage.setItem("farmerDB", JSON.stringify(db));

      const session = { name: name, location: loc };
      localStorage.setItem("farmerUserSession", JSON.stringify(session));

      alert("✅ Account Created! Welcome " + name + "!");
      window.location.href = "index.html";
    }
  } else {
    alert("Please fill all details including Password!");
  }
}

function logout() {
  localStorage.removeItem("farmerUserSession");
  window.location.href = "login.html";
}

function saveHistory(resultData) {
  const userSession = JSON.parse(localStorage.getItem("farmerUserSession"));
  if (!userSession) return; // Should not happen

  const crop = document.getElementById("crop").value;
  const historyItem = {
    date: new Date().toLocaleDateString(),
    crop: crop,
    summary: resultData.decision // Saving the roadmap as summary
  };

  // Key is specific to the user: "history_Rajesh"
  const storageKey = "history_" + userSession.name;

  let history = JSON.parse(localStorage.getItem(storageKey)) || [];
  history.push(historyItem);
  localStorage.setItem(storageKey, JSON.stringify(history));
}

function loadProfile() {
  const user = JSON.parse(localStorage.getItem("farmerUserSession"));
  if (user) {
    document.getElementById("profile-name").innerText = "🌾 " + user.name;
    document.getElementById("profile-location").innerText = "📍 " + user.location;
  } else {
    return;
  }

  // Load Contracts
  const contractKey = "contracts_" + user.name;
  const contracts = JSON.parse(localStorage.getItem(contractKey)) || [];
  const contractGrid = document.getElementById("contracts-grid");

  if (contracts.length === 0) {
    contractGrid.innerHTML = "<p style='color: white; grid-column: span 3; text-align: center;'>No active contracts yet.</p>";
  } else {
    contractGrid.innerHTML = "";
    contracts.reverse().forEach(item => {
      const div = document.createElement("div");
      div.className = "container";
      div.style.borderLeft = "5px solid #000000"; // Black border for contracts
      div.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 240, 0.9))";
      div.innerHTML = `
              <h3 style="color: black;">🤝 ${item.buyer}</h3>
              <p><b>ID:</b> ${item.contractId}</p>
              <p><b>Crop:</b> ${item.crop} (${item.date})</p>
              <p style="color: green; font-weight: bold;">Value: ₹${parseInt(item.total).toLocaleString()}</p>
              <button style="background: #333; padding: 5px 10px; font-size: 0.8rem; margin-top: 5px;" onclick="alert('Downloading Contract ID: ${item.contractId}...')">Download PDF 📥</button>
          `;
      contractGrid.appendChild(div);
    });
  }

  // Load History
  const historyKey = "history_" + user.name;
  const history = JSON.parse(localStorage.getItem(historyKey)) || [];
  const historyGrid = document.getElementById("history-grid");
  historyGrid.innerHTML = "";

  if (history.length === 0) {
    historyGrid.innerHTML = "<p style='color: white; grid-column: span 3; text-align: center;'>No past analysis found.</p>";
    return;
  }

  history.reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "container";
    div.style.borderLeft = "5px solid #10b981";
    div.innerHTML = `
            <h3>${item.crop} (${item.date})</h3>
            <p>${formatText(item.summary)}</p>
        `;
    historyGrid.appendChild(div);
  });
}


function clearHistory() {
  const userSession = JSON.parse(localStorage.getItem("farmerUserSession"));
  if (!userSession) return; // Should not happen

  const storageKey = "history_" + userSession.name;
  localStorage.removeItem(storageKey);
  loadProfile();
}

function analyzeProfile() {
  const userSession = JSON.parse(localStorage.getItem("farmerUserSession"));
  if (!userSession) return;

  const resultBox = document.getElementById("profile-analysis-box");
  const resultText = document.getElementById("profile-analysis-result");
  const storageKey = "history_" + userSession.name;
  const history = JSON.parse(localStorage.getItem(storageKey)) || [];

  resultBox.style.display = "block";
  resultText.innerHTML = "<b>Loading AI Analysis...</b>";

  // Simulate delay or fetch from backend
  setTimeout(() => {
    fetch("http://localhost:5000/analyze_profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: history })
    })
      .then(res => res.json())
      .then(data => {
        resultText.innerHTML = formatText(data.analysis);
      })
      .catch(err => {
        resultText.innerHTML = "Error analyzing profile.";
      });
  }, 1000);
}

// Global to hold current deal context
let currentDeal = {};

function openContract(buyer, price, total) {
  const userSession = JSON.parse(localStorage.getItem("farmerUserSession"));
  const userName = userSession ? userSession.name : "Farmer";
  const userLoc = userSession ? userSession.location : "Unknown";

  const phone = document.getElementById("phone").value || "Not Provided";
  const crop = document.getElementById("crop").value;
  const date = new Date().toLocaleDateString();

  currentDeal = {
    date: date,
    buyer: buyer,
    price: price,
    total: total,
    crop: crop,
    contractId: "AGRI-" + Math.floor(Math.random() * 10000)
  };

  const contract = `
    CROP SALE AGREEMENT (BOND)
    --------------------------
    ID: ${currentDeal.contractId}
    Date: ${date}

    SELLER (FARMER):
    Name: ${userName}
    Location: ${userLoc}
    Phone: ${phone}

    BUYER:
    Company: ${buyer}
    
    PRODUCT DETAILS:
    Crop: ${crop}
    Agreed Price: ₹${price} per Quintal
    Total Estimated Value: ₹${total}

    TERMS:
    1. The seller agrees to deliver the harvested crop to the buyer's nearest collection center.
    2. The buyer agrees to pay the total amount within 7 days of delivery.
    3. This is a digitally generated provisional bond.

    --------------------------
    Signed Digitally by: ${userName}
    `;

  document.getElementById("contractText").innerText = contract;
  document.getElementById("contractModal").style.display = "block";
}

function saveContract() {
  const userSession = JSON.parse(localStorage.getItem("farmerUserSession"));
  if (!userSession) {
    alert("Please login to save contracts!");
    return;
  }

  const storageKey = "contracts_" + userSession.name;
  let contracts = JSON.parse(localStorage.getItem(storageKey)) || [];
  contracts.push(currentDeal);
  localStorage.setItem(storageKey, JSON.stringify(contracts));

  alert("✅ Deal Signed & Saved! Redirecting to Profile...");
  window.location.href = "profile.html";
}

function closeModal() {
  document.getElementById("contractModal").style.display = "none";
}
