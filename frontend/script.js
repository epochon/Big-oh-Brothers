// script.js
function submitData() {
  // Clear previous results and show loading state
  document.getElementById("result").innerHTML = "Analyzing data... please wait.";

  const data = {
    crop: document.getElementById("crop").value,
    land: document.getElementById("land").value,
    investment: document.getElementById("investment").value,
    location: document.getElementById("location").value
  };

  fetch("http://127.0.0.1:5000/analyze", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) throw new Error("Server Error");
    return res.json();
  })
  .then(data => {
    // These keys MUST match the keys in your Python dictionary above
    document.getElementById("result").innerHTML = `
      <p><b>Environment:</b> ${data.environment}</p>
      <p><b>Market:</b> ${data.market}</p>
      <h3>✅ Final Advice: ${data.decision}</h3>
    `;
  })
  .catch(err => {
    document.getElementById("result").innerHTML = `<p style="color:red">Error: ${err.message}. Check your terminal for details.</p>`;
  });
}