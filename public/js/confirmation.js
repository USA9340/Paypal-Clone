// Confirmation JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  if (!isLoggedIn) {
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

  userNameElements.forEach((el) => {
    if (el) el.textContent = user.name
  })

  userInitialElements.forEach((el) => {
    if (el) el.textContent = user.name.charAt(0)
  })

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

  // Get transaction type from URL
  const urlParams = new URLSearchParams(window.location.search)
  const type = urlParams.get("type") || "send"

  // Get transaction data
  const transactionDataString = localStorage.getItem("lastTransaction")
  let transactionData = null

  if (transactionDataString) {
    try {
      transactionData = JSON.parse(transactionDataString)
    } catch (e) {
      console.error("Error parsing transaction data:", e)
    }
  }

  // Set receipt details
  const receiptTitle = document.getElementById("receipt-title")
  const receiptSubtitle = document.getElementById("receipt-subtitle")
  const transactionId = document.getElementById("transaction-id")
  const transactionDate = document.getElementById("transaction-date")
  const recipientLabel = document.getElementById("recipient-label")
  const recipientValue = document.getElementById("recipient-value")
  const transactionAmount = document.getElementById("transaction-amount")
  const transactionNote = document.getElementById("transaction-note")
  const noteRow = document.getElementById("note-row")
  const receiptMessage = document.getElementById("receipt-message")

  if (type === "send") {
    receiptTitle.textContent = "Money Sent Successfully"
    receiptSubtitle.textContent = "Your transaction has been processed"
    recipientLabel.textContent = "Recipient"
    receiptMessage.textContent = "The recipient will be notified about this transaction."
  } else if (type === "request") {
    receiptTitle.textContent = "Money Request Sent"
    receiptSubtitle.textContent = "Your request has been sent"
    recipientLabel.textContent = "Requested From"
    receiptMessage.textContent = "The recipient will be notified about your request."
  }

  if (transactionData) {
    if (transactionData.id) {
      transactionId.textContent = transactionData.id
    }

    const date = new Date(transactionData.date)
    transactionDate.textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

    if (transactionData.recipient) {
      recipientValue.textContent = transactionData.recipient
    }

    if (transactionData.amount) {
      transactionAmount.textContent = formatCurrency(transactionData.amount)
    }

    if (transactionData.note) {
      transactionNote.textContent = transactionData.note
    } else {
      noteRow.style.display = "none"
    }
  }

  // Handle print receipt
  const printReceiptBtn = document.getElementById("print-receipt")
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener("click", () => {
      window.print()
    })
  }

  // Countdown and redirect
  const countdownElement = document.getElementById("countdown")
  let countdown = 5

  if (countdownElement) {
    countdownElement.textContent = countdown

    const interval = setInterval(() => {
      countdown--
      countdownElement.textContent = countdown

      if (countdown <= 0) {
        clearInterval(interval)
        window.location.href = "dashboard.html"
      }
    }, 1000)
  }
})

// Helper function to format currency
function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}
