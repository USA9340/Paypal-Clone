// Dashboard JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  if (
    !isLoggedIn &&
    !window.location.pathname.includes("login.html") &&
    !window.location.pathname.includes("signup.html") &&
    !window.location.pathname.includes("index.html")
  ) {
    window.location.href = "login.html"
    return
  }

  // Get user data
  const userString = localStorage.getItem("user")
  let user = null

  if (userString) {
    try {
      user = JSON.parse(userString)
    } catch (e) {
      console.error("Error parsing user data:", e)
    }
  }

  // If no user data, use default
  if (!user) {
    user = {
      name: "John Doe",
      email: "john@example.com",
      balance: 2543.89,
      currency: "USD",
    }
  }

  // Set user info in UI
  const userNameElements = document.querySelectorAll("#user-name")
  const userInitialElements = document.querySelectorAll("#user-initial")
  const welcomeNameElement = document.getElementById("welcome-name")
  const userBalanceElement = document.getElementById("user-balance")

  userNameElements.forEach((el) => {
    if (el) el.textContent = user.name
  })

  userInitialElements.forEach((el) => {
    if (el) el.textContent = user.name.charAt(0)
  })

  if (welcomeNameElement) {
    welcomeNameElement.textContent = user.name
  }

  if (userBalanceElement) {
    userBalanceElement.textContent = formatCurrency(user.balance, user.currency)
  }

  // Handle user dropdown
  const userDropdownBtn = document.querySelector(".user-dropdown-btn")
  const dropdownMenu = document.querySelector(".dropdown-menu")

  if (userDropdownBtn && dropdownMenu) {
    userDropdownBtn.addEventListener("click", () => {
      dropdownMenu.classList.toggle("show")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!userDropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove("show")
      }
    })
  }

  // Handle logout
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Clear user data
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("user")

      // Redirect to login
      window.location.href = "login.html"
    })
  }

  // Handle tabs
  const tabBtns = document.querySelectorAll(".tab-btn")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Remove active class from all tabs and panes
      document.querySelectorAll(".tab-btn").forEach((el) => el.classList.remove("active"))
      document.querySelectorAll(".tab-pane").forEach((el) => el.classList.remove("active"))

      // Add active class to clicked tab and corresponding pane
      this.classList.add("active")
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })

  // Load transactions
  const transactionsList = document.getElementById("transactions-list")

  if (transactionsList) {
    // Fetch transactions from API
    fetch(`/api/transactions?userId=${user.id || "user-1"}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.transactions && data.transactions.length > 0) {
          renderTransactions(data.transactions, transactionsList)
        } else {
          // Show empty state
          transactionsList.innerHTML = `
            <div class="empty-state">
              <p>No transactions found</p>
            </div>
          `
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error)
        // Show error state
        transactionsList.innerHTML = `
          <div class="empty-state">
            <p>Error loading transactions. Please try again.</p>
          </div>
        `
      })
  }
})

// Helper function to format currency
function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

// Helper function to render transactions
function renderTransactions(transactions, container) {
  if (transactions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No transactions found</p>
      </div>
    `
    return
  }

  let html = ""

  transactions.forEach((transaction) => {
    const formattedDate = new Date(transaction.createdAt).toLocaleDateString()

    // Determine transaction type and details
    let type, name, amount

    if (transaction.type === "transfer") {
      // For transfer transactions
      const isReceived = transaction.recipientId === (JSON.parse(localStorage.getItem("user"))?.id || "user-1")
      type = isReceived ? "received" : "sent"
      name = isReceived ? transaction.senderName : transaction.recipientName
      amount = transaction.amount
    } else if (transaction.type === "admin-fund") {
      // For admin funding
      type = "received"
      name = "Admin Funding"
      amount = transaction.amount
    }

    html += `
      <div class="transaction-item">
        <div class="transaction-left">
          <div class="transaction-icon ${type}">
            <i class="fas fa-arrow-${type === "received" ? "down" : "up"}"></i>
          </div>
        </div>
        <div class="transaction-details">
          <h3>${type === "received" ? `From ${name}` : `To ${name}`}</h3>
          <p>${formattedDate}</p>
        </div>
        <div class="transaction-amount">
          <div class="amount ${type === "received" ? "received" : ""}">
            ${type === "received" ? "+" : "-"}${formatCurrency(amount)}
          </div>
          <div class="status">${transaction.status}</div>
        </div>
      </div>
    `
  })

  container.innerHTML = html
}
