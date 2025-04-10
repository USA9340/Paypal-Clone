// Request Money JavaScript

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
  const paymentNameElement = document.getElementById("payment-name")
  const paymentEmailElement = document.getElementById("payment-email")
  const paymentIdElement = document.getElementById("payment-id")
  const paymentLinkElement = document.getElementById("payment-link")

  userNameElements.forEach((el) => {
    if (el) el.textContent = user.name
  })

  userInitialElements.forEach((el) => {
    if (el) el.textContent = user.name.charAt(0)
  })

  if (paymentNameElement) {
    paymentNameElement.textContent = user.name
  }

  if (paymentEmailElement) {
    paymentEmailElement.textContent = user.email
  }

  if (paymentIdElement) {
    // Create a PayClone ID from the user's name
    const payCloneId = "@" + user.name.toLowerCase().replace(/\s+/g, "")
    paymentIdElement.textContent = payCloneId
  }

  if (paymentLinkElement) {
    // Create a payment link
    const paymentLink = `https://payclone.com/pay/${user.name.toLowerCase().replace(/\s+/g, "")}`
    paymentLinkElement.value = paymentLink
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

      // Remove active class from  function () {
      // Remove active class from all tabs and panes
      document.querySelectorAll(".tab-btn").forEach((el) => el.classList.remove("active"))
      document.querySelectorAll(".tab-pane").forEach((el) => el.classList.remove("active"))

      // Add active class to clicked tab and corresponding pane
      this.classList.add("active")
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })

  // Handle copy link button
  const copyLinkBtn = document.getElementById("copy-link-btn")
  const paymentLink = document.getElementById("payment-link")

  if (copyLinkBtn && paymentLink) {
    copyLinkBtn.addEventListener("click", () => {
      paymentLink.select()
      document.execCommand("copy")

      // Change button text temporarily
      const originalText = copyLinkBtn.innerHTML
      copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'

      setTimeout(() => {
        copyLinkBtn.innerHTML = originalText
      }, 2000)
    })
  }

  // Handle share buttons
  const shareButtons = document.querySelectorAll(".share-btn")

  shareButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const paymentLink = document.getElementById("payment-link").value
      const userName = user.name
      const shareText = `Please send money to ${userName} using PayClone: ${paymentLink}`

      if (this.classList.contains("email-share")) {
        window.location.href = `mailto:?subject=Payment Request from ${userName}&body=${encodeURIComponent(shareText)}`
      } else if (this.classList.contains("sms-share")) {
        window.location.href = `sms:?body=${encodeURIComponent(shareText)}`
      } else if (this.classList.contains("whatsapp-share")) {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")
      } else if (this.classList.contains("more-share")) {
        if (navigator.share) {
          navigator
            .share({
              title: `Payment Request from ${userName}`,
              text: shareText,
              url: paymentLink,
            })
            .catch((err) => console.error("Error sharing:", err))
        } else {
          alert("Share feature not supported on this browser")
        }
      }
    })
  })

  // Handle request money form
  const requestMoneyForm = document.getElementById("request-money-form")
  const errorMessage = document.getElementById("error-message")
  const successMessage = document.getElementById("success-message")

  if (requestMoneyForm) {
    requestMoneyForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("request-email").value
      const amount = document.getElementById("request-amount").value
      const note = document.getElementById("request-note").value

      // Validation
      if (!email) {
        errorMessage.textContent = "Please enter an email address"
        errorMessage.style.display = "block"
        successMessage.style.display = "none"
        return
      }

      if (!amount || Number.parseFloat(amount) <= 0) {
        errorMessage.textContent = "Please enter a valid amount"
        errorMessage.style.display = "block"
        successMessage.style.display = "none"
        return
      }

      // Show loading state
      const submitButton = requestMoneyForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.textContent
      submitButton.textContent = "Processing..."
      submitButton.disabled = true

      // Save transaction data for receipt
      const transactionData = {
        recipient: email,
        amount: Number.parseFloat(amount),
        note,
        date: new Date().toISOString(),
      }
      localStorage.setItem("lastTransaction", JSON.stringify(transactionData))

      // Simulate API call (in a real app, this would be a fetch to the server)
      setTimeout(() => {
        // Show success message
        errorMessage.style.display = "none"
        successMessage.textContent = `Money request for ${formatCurrency(Number.parseFloat(amount))} sent to ${email}`
        successMessage.style.display = "block"

        // Reset form
        requestMoneyForm.reset()

        // Reset button
        submitButton.textContent = originalButtonText
        submitButton.disabled = false

        // Redirect to confirmation page after a delay
        setTimeout(() => {
          window.location.href = "confirmation.html?type=request"
        }, 2000)
      }, 1500)
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
