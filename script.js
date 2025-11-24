const API_URL = "https://jsonplaceholder.typicode.com/users";

const usersContainer = document.getElementById("usersContainer");
const statusEl = document.getElementById("status");
const reloadBtn = document.getElementById("reloadBtn");
const userCountEl = document.getElementById("userCount");
const fetchTimeEl = document.getElementById("fetchTime");

// Helper: format full address
function formatAddress(address) {
  if (!address) return "N/A";
  const { street, suite, city, zipcode } = address;
  return `${street}, ${suite}, ${city} - ${zipcode}`;
}

// Helper: safe website URL
function formatWebsite(website) {
  if (!website) return "#";
  return website.startsWith("http") ? website : `http://${website}`;
}

// Show loading state
function showLoading() {
  statusEl.className = "status";
  statusEl.innerHTML = `
    <div class="loader"></div>
    <span>Loading users...</span>
  `;
}

// Show error
function showError(message) {
  statusEl.className = "status error";
  statusEl.innerHTML = `⚠ ${message}`;
}

// Clear status
function clearStatus() {
  statusEl.className = "status";
  statusEl.innerHTML = "";
}

// Render user cards
function renderUsers(users) {
  usersContainer.innerHTML = "";

  if (!users || users.length === 0) {
    usersContainer.innerHTML = "<p>No users found.</p>";
    return;
  }

  users.forEach((user) => {
    const card = document.createElement("article");
    card.className = "user-card";

    card.innerHTML = `
      <div class="user-name">${user.name}</div>
      <div class="user-username">@${user.username}</div>

      <div class="info-row">
        <span class="label">Email:</span>
        <span> ${user.email}</span>
      </div>

      <div class="info-row address">
        <span class="label">Address:</span>
        <span> ${formatAddress(user.address)}</span>
      </div>

      <div class="info-row">
        <span class="label">Phone:</span>
        <span> ${user.phone}</span>
      </div>

      <div class="info-row">
        <span class="label">Website:</span>
        <a href="${formatWebsite(user.website)}" target="_blank" rel="noopener">
          ${user.website}
        </a>
      </div>

      <div class="info-row">
        <span class="label">Company:</span>
        <span> ${user.company?.name || "N/A"}</span>
      </div>
    `;

    usersContainer.appendChild(card);
  });
}

// Main fetch function
async function fetchUsers() {
  showLoading();
  usersContainer.innerHTML = "";

  const startTime = performance.now();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const endTime = performance.now();
    const timeMs = endTime - startTime;

    clearStatus();
    renderUsers(data);

    // meta info
    userCountEl.textContent = `Users Loaded: ${data.length}`;
    fetchTimeEl.textContent = `Fetch Time: ${timeMs.toFixed(0)} ms`;
  } catch (err) {
    console.error(err);
    showError("Failed to load users. Please try again.");
    userCountEl.textContent = "Users Loaded: 0";
    fetchTimeEl.textContent = "Fetch Time: --";
  }
}

// Reload button
reloadBtn.addEventListener("click", () => {
  fetchUsers();
});

// Initial load
fetchUsers();
