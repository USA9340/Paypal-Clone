// Send Money JavaScript

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
  const availableBalanceElement = document.getElementById("available-balance")

  userNameElements.forEach((el) => {
    if (el) el.textContent = user.name
  })

  userInitialElements.forEach((el) => {
    if (el) el.textContent = user.name.charAt(0)
  })

  if (availableBalanceElement) {
    availableBalanceElement.textContent = formatCurrency(user.balance, user.currency)
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

  // Handle contact selection
  const contactItems = document.querySelectorAll(".contact-item")
  const recipientEmailInput = document.getElementById("recipient-email")

  contactItems.forEach((item) => {
    item.addEventListener("click", function () {
      const email = this.getAttribute("data-email")
      if (recipientEmailInput && email) {
        recipientEmailInput.value = email

        // Switch to email tab
        const emailTabBtn = document.querySelector('.tab-btn[data-tab="email"]')
        if (emailTabBtn) {
          emailTabBtn.click()
        }
      }
    })

    // Handle select button click
    const selectBtn = item.querySelector(".btn")
    if (selectBtn) {
      selectBtn.addEventListener("click", (e) => {
        e.stopPropagation() // Prevent triggering the parent click event
        const email = item.getAttribute("data-email")
        if (recipientEmailInput && email) {
          recipientEmailInput.value = email

          // Switch to email tab
          const emailTabBtn = document.querySelector('.tab-btn[data-tab="email"]')
          if (emailTabBtn) {
            emailTabBtn.click()
          }
        }
      })
    }
  })

  // Handle send money form
  const sendMoneyForm = document.getElementById("send-money-form")
  const continueBtn = document.getElementById("continue-btn")
  const errorMessage = document.getElementById("error-message")

  if (sendMoneyForm) {
    sendMoneyForm.addEventListener("submit", handleSendMoney)
  }

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      if (sendMoneyForm) {
        sendMoneyForm.dispatchEvent(new Event("submit"))
      }
    })
  }

  function handleSendMoney(e) {
    e.preventDefault()

    const recipient = document.getElementById("recipient-email").value
    const amount = document.getElementById("amount").value
    const note = document.getElementById("note").value

    // Validation
    if (!recipient) {
      errorMessage.textContent = "Please enter a recipient email"
      errorMessage.style.display = "block"
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      errorMessage.textContent = "Please enter a valid amount"
      errorMessage.style.display = "block"
      return
    }

    if (Number.parseFloat(amount) > user.balance) {
      errorMessage.textContent = "Insufficient funds"
      errorMessage.style.display = "block"
      return
    }

    // Show loading state
    const submitButton = continueBtn || sendMoneyForm.querySelector('button[type="submit"]')
    const originalButtonText = submitButton.textContent
    submitButton.textContent = "Processing..."
    submitButton.disabled = true

    // Save transaction data for receipt
    const transactionData = {
      recipient,
      amount: Number.parseFloat(amount),
      note,
      date: new Date().toISOString(),
    }
    localStorage.setItem("lastTransaction", JSON.stringify(transactionData))

    // Send API request
    fetch("/api/transactions/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: user.id || "user-1",
        recipientEmail: recipient,
        amount: Number.parseFloat(amount),
        note: note,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update user balance
          user.balance -= Number.parseFloat(amount)
          localStorage.setItem("user", JSON.stringify(user))

          // Save transaction ID for receipt
          if (data.transaction && data.transaction.id) {
            const transactionData = JSON.parse(localStorage.getItem("lastTransaction") || "{}")
            transactionData.id = data.transaction.id
            localStorage.setItem("lastTransaction", JSON.stringify(transactionData))
          }

          // Redirect to confirmation page
          window.location.href = "confirmation.html?type=send"
        } else {
          errorMessage.textContent = data.message || "Transaction failed. Please try again."
          errorMessage.style.display = "block"
          submitButton.textContent = originalButtonText
          submitButton.disabled = false
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        errorMessage.textContent = "An error occurred. Please try again."
        errorMessage.style.display = "block"
        submitButton.textContent = originalButtonText
        submitButton.disabled = false
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
