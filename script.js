// Paste your Google Apps Script Web App URL here
const API_URL = "https://script.google.com/macros/s/AKfycbxdDb9PrIc5QXjJAg3ChNRpFp65vPt-EeG6U10_1NWGaYUNKQZecd5HkgPgC2w7wREhsg/exec";

async function submitRating() {
  let prof = document.getElementById("professor").value;
  let course = document.getElementById("course").value;
  let rating = parseInt(document.getElementById("rating").value);
  let review = document.getElementById("review").value;

  if (!rating || rating < 1 || rating > 10) {
    alert("Enter a valid rating (1–10)");
    return;
  }

  // Send rating to Google Sheets
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      professor: prof,
      course: course,
      rating: rating,
      review: review
    })
  });

  // Clear inputs
  document.getElementById("rating").value = "";
  document.getElementById("review").value = "";

  // Refresh results
  fetchResults();
}

async function fetchResults() {
  let res = await fetch(API_URL);
  let data = await res.json();

  let container = document.getElementById("results");
  container.innerHTML = "";

  for (let key in data) {
    let avg = (
      data[key].ratings.reduce((a, b) => a + b, 0) / data[key].ratings.length
    ).toFixed(2);

    // Create card for each professor-course
    let div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${key}</h3>
      <p class="rating">Average Rating: ${avg} / 10 ⭐</p>
      
      <!-- Progress bar visualization -->
      <div class="progress">
        <div class="progress-bar" style="width:${avg * 10}%;"></div>
      </div>

      <p><strong>Reviews:</strong></p>
      <ul>${data[key].reviews.map(r => `<li>${r}</li>`).join("")}</ul>
    `;

    container.appendChild(div);
  }
}

// Load data when website opens
fetchResults();
