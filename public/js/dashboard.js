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

  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

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
  const userEmailElements = document.querySelectorAll("#user-email")
  const userInitialElements = document.querySelectorAll("#user-initial, #user-initial-large")
  const welcomeNameElement = document.getElementById("welcome-name")
  const userBalanceElement = document.getElementById("user-balance")

  userNameElements.forEach((el) => {
    if (el) el.textContent = user.name
  })

  userEmailElements.forEach((el) => {
    if (el) el.textContent = user.email
  })

  userInitialElements.forEach((el) => {
    if (el) el.textContent = user.name.charAt(0)
  })

  if (welcomeNameElement) {
    welcomeNameElement.textContent = user.name.split(" ")[0]
  }

  if (userBalanceElement) {
    userBalanceElement.textContent = formatCurrency(user.balance, user.currency)
  }

  // Handle user menu dropdown
  const userMenuBtn = document.querySelector(".user-menu-btn")
  const userDropdown = document.querySelector(".user-dropdown")

  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener("click", () => {
      userDropdown.classList.toggle("show")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove("show")
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

  // Handle activity filter tabs
  const filterTabs = document.querySelectorAll(".filter-tab")

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      filterTabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Get filter value
      const filter = this.getAttribute("data-filter")

      // Apply filter to transactions
      filterTransactions(filter)
    })
  })

  // Handle search input
  const searchInput = document.querySelector(".filter-search input")

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      searchTransactions(searchTerm)
    })
  }

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
              <p>You don't have any transactions yet</p>
              <p>Send or request money to get started</p>
            </div>
          `
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error)
        // Show error state
        transactionsList.innerHTML = `
          <div class="empty-state">
            <p>Something went wrong</p>
            <p>We couldn't load your transactions. Please try again.</p>
          </div>
        `
      })
  }

  // Function to filter transactions
  function filterTransactions(filter) {
    const transactions = document.querySelectorAll(".transaction-item")

    if (transactions.length === 0) return

    transactions.forEach((transaction) => {
      if (filter === "all") {
        transaction.style.display = ""
      } else {
        const type = transaction.getAttribute("data-type")
        transaction.style.display = type === filter ? "" : "none"
      }
    })
  }

  // Function to search transactions
  function searchTransactions(searchTerm) {
    const transactions = document.querySelectorAll(".transaction-item")

    if (transactions.length === 0) return

    transactions.forEach((transaction) => {
      const name = transaction.querySelector(".transaction-name").textContent.toLowerCase()
      const amount = transaction.querySelector(".transaction-amount").textContent.toLowerCase()

      if (name.includes(searchTerm) || amount.includes(searchTerm)) {
        transaction.style.display = ""
      } else {
        transaction.style.display = "none"
      }
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
        <p>You don't have any transactions yet</p>
        <p>Send or request money to get started</p>
      </div>
    `
    return
  }

  // Clear loading spinner
  container.innerHTML = ""

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

    const transactionItem = document.createElement("div")
    transactionItem.className = "transaction-item"
    transactionItem.setAttribute("data-type", type)

    transactionItem.innerHTML = `
      <div class="transaction-icon ${type}">
        <i class="fas fa-arrow-${type === "received" ? "down" : "up"}"></i>
      </div>
      <div class="transaction-details">
        <div class="transaction-name">${name}</div>
        <div class="transaction-date">${formattedDate}</div>
      </div>
      <div>
        <div class="transaction-amount ${type === "received" ? "received" : ""}">
          ${type === "received" ? "+" : "-"}${formatCurrency(amount)}
        </div>
        <div class="transaction-status">${transaction.status}</div>
      </div>
    `

    container.appendChild(transactionItem)
  })
}
