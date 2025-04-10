// Authentication JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  if (
    isLoggedIn &&
    (window.location.pathname.includes("login.html") || window.location.pathname.includes("signup.html"))
  ) {
    window.location.href = "dashboard.html"
  }

  // Login form handling
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const errorMessage = document.getElementById("error-message")

      // Simple validation
      if (!email || !password) {
        errorMessage.textContent = "Please enter both email and password"
        errorMessage.style.display = "block"
        return
      }

      // Show loading state
      const submitButton = loginForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.textContent
      submitButton.textContent = "Logging in..."
      submitButton.disabled = true

      // Simulate API call
      setTimeout(() => {
        // For demo purposes, any login works
        fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Store user data
              localStorage.setItem("isLoggedIn", "true")
              localStorage.setItem("user", JSON.stringify(data.user))

              // Redirect to dashboard
              window.location.href = "dashboard.html"
            } else {
              errorMessage.textContent = data.message || "Invalid email or password"
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
      }, 1000)
    })
  }

  // Signup form handling
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const firstName = document.getElementById("firstName").value
      const lastName = document.getElementById("lastName").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirmPassword").value
      const errorMessage = document.getElementById("error-message")

      // Simple validation
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        errorMessage.textContent = "Please fill in all fields"
        errorMessage.style.display = "block"
        return
      }

      if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match"
        errorMessage.style.display = "block"
        return
      }

      // Show loading state
      const submitButton = signupForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.textContent
      submitButton.textContent = "Creating account..."
      submitButton.disabled = true

      // Simulate API call
      setTimeout(() => {
        fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Store user data
              localStorage.setItem("isLoggedIn", "true")
              localStorage.setItem("user", JSON.stringify(data.user))

              // Redirect to dashboard
              window.location.href = "dashboard.html"
            } else {
              errorMessage.textContent = data.message || "Registration failed. Please try again."
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
      }, 1000)
    })
  }
})
