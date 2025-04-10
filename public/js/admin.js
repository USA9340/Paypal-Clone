// Admin Dashboard JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Check if admin is logged in (in a real app, this would check for admin role)
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const userString = localStorage.getItem("user")
  let user = null

  if (userString) {
    try {
      user = JSON.parse(userString)
    } catch (e) {
      console.error("Error parsing user data:", e)
    }
  }

  // For demo purposes, allow access to admin page
  // In a real app, this would check if the user has admin role

  // Handle admin dropdown
  const adminDropdownBtn = document.querySelector(".admin-dropdown-btn")
  const dropdownMenu = document.querySelector(".dropdown-menu")

  if (adminDropdownBtn && dropdownMenu) {
    adminDropdownBtn.addEventListener("click", () => {
      dropdownMenu.classList.toggle("show")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!adminDropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove("show")
      }
    })
  }

  // Handle logout
  const logoutBtn = document.getElementById("admin-logout-btn")
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

  // Load users
  const usersTableBody = document.getElementById("users-table-body")
  const userSelectOptions = document.getElementById("user-select-options")
  const showingUsersElement = document.getElementById("showing-users")
  const totalUsersElement = document.getElementById("total-users")

  // Fetch users from API
  fetch("/api/users")
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.users && data.users.length > 0) {
        renderUsers(data.users, usersTableBody, userSelectOptions)
        if (showingUsersElement) showingUsersElement.textContent = data.users.length
        if (totalUsersElement) totalUsersElement.textContent = data.users.length
      } else {
        // Use mock data for demo
        const mockUsers = [
          { id: 1, name: "John Doe", email: "john@example.com", balance: 2543.89, status: "active" },
          { id: 2, name: "Jane Smith", email: "jane@example.com", balance: 1250.5, status: "active" },
          { id: 3, name: "Bob Johnson", email: "bob@example.com", balance: 5000.0, status: "active" },
          { id: 4, name: "Sarah Williams", email: "sarah@example.com", balance: 750.25, status: "active" },
          { id: 5, name: "Michael Brown", email: "michael@example.com", balance: 0.0, status: "pending" },
          { id: 6, name: "Emily Davis", email: "emily@example.com", balance: 3200.75, status: "active" },
          { id: 7, name: "David Wilson", email: "david@example.com", balance: 1800.5, status: "active" },
          { id: 8, name: "Lisa Miller", email: "lisa@example.com", balance: 950.0, status: "suspended" },
        ]
        renderUsers(mockUsers, usersTableBody, userSelectOptions)
        if (showingUsersElement) showingUsersElement.textContent = mockUsers.length
        if (totalUsersElement) totalUsersElement.textContent = mockUsers.length
      }
    })
    .catch((error) => {
      console.error("Error fetching users:", error)
      // Use mock data for demo
      const mockUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", balance: 2543.89, status: "active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", balance: 1250.5, status: "active" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", balance: 5000.0, status: "active" },
        { id: 4, name: "Sarah Williams", email: "sarah@example.com", balance: 750.25, status: "active" },
        { id: 5, name: "Michael Brown", email: "michael@example.com", balance: 0.0, status: "pending" },
        { id: 6, name: "Emily Davis", email: "emily@example.com", balance: 3200.75, status: "active" },
        { id: 7, name: "David Wilson", email: "david@example.com", balance: 1800.5, status: "active" },
        { id: 8, name: "Lisa Miller", email: "lisa@example.com", balance: 950.0, status: "suspended" },
      ]
      renderUsers(mockUsers, usersTableBody, userSelectOptions)
      if (showingUsersElement) showingUsersElement.textContent = mockUsers.length
      if (totalUsersElement) totalUsersElement.textContent = mockUsers.length
    })

  // Load activity
  const activityList = document.getElementById("activity-list")

  if (activityList) {
    // Use mock data for demo
    const mockActivity = [
      {
        action: "User Funded",
        admin: "Admin User",
        target: "john@example.com",
        amount: "$500.00",
        timestamp: "2023-04-15 14:32:45",
      },
      {
        action: "User Created",
        admin: "Admin User",
        target: "sarah@example.com",
        amount: null,
        timestamp: "2023-04-15 13:15:22",
      },
      {
        action: "User Suspended",
        admin: "System",
        target: "suspicious@example.com",
        amount: null,
        timestamp: "2023-04-14 23:05:11",
      },
      {
        action: "User Funded",
        admin: "Admin User",
        target: "bob@example.com",
        amount: "$1,000.00",
        timestamp: "2023-04-14 16:48:33",
      },
      {
        action: "Transaction Reversed",
        admin: "Admin User",
        target: "TX-12345",
        amount: "$250.00",
        timestamp: "2023-04-14 10:22:17",
      },
    ]

    let html = ""

    mockActivity.forEach((activity) => {
      html += `
                <div class="activity-item">
                    <div class="activity-details">
                        <h3>${activity.action}</h3>
                        <p>${activity.admin} • ${activity.target} ${activity.amount ? `• ${activity.amount}` : ""}</p>
                    </div>
                    <div class="activity-time">
                        ${activity.timestamp}
                    </div>
                </div>
            `
    })

    activityList.innerHTML = html
  }

  // Handle user search
  const userSearch = document.getElementById("user-search")
  const userDropdownSearch = document.getElementById("user-dropdown-search")

  if (userSearch) {
    userSearch.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const rows = usersTableBody.querySelectorAll("tr")

      rows.forEach((row) => {
        const name = row.querySelector("td:first-child").textContent.toLowerCase()
        const email = row.querySelector("td:nth-child(2)").textContent.toLowerCase()

        if (name.includes(searchTerm) || email.includes(searchTerm)) {
          row.style.display = ""
        } else {
          row.style.display = "none"
        }
      })

      // Update showing count
      const visibleRows = Array.from(rows).filter((row) => row.style.display !== "none")
      if (showingUsersElement) showingUsersElement.textContent = visibleRows.length
    })
  }

  if (userDropdownSearch) {
    userDropdownSearch.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const options = userSelectOptions.querySelectorAll(".select-option")

      options.forEach((option) => {
        const text = option.textContent.toLowerCase()

        if (text.includes(searchTerm)) {
          option.style.display = ""
        } else {
          option.style.display = "none"
        }
      })
    })
  }

  // Handle user select dropdown
  const userSelectBtn = document.getElementById("user-select-btn")
  const selectDropdown = document.querySelector(".select-dropdown")

  if (userSelectBtn && selectDropdown) {
    userSelectBtn.addEventListener("click", () => {
      selectDropdown.classList.toggle("show")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!userSelectBtn.contains(e.target) && !selectDropdown.contains(e.target)) {
        selectDropdown.classList.remove("show")
      }
    })
  }

  // Handle fund user form
  const fundUserForm = document.getElementById("fund-user-form")
  const fundUserBtn = document.getElementById("fund-user-btn")
  const fundingMessage = document.getElementById("funding-message")

  if (fundUserForm) {
    fundUserForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const selectedUser = userSelectBtn.getAttribute("data-email")
      const amount = document.getElementById("fund-amount").value
      const note = document.getElementById("fund-note").value

      // Validation
      if (!selectedUser) {
        fundingMessage.textContent = "Please select a user"
        fundingMessage.className = "message error"
        fundingMessage.style.display = "block"
        return
      }

      if (!amount || Number.parseFloat(amount) <= 0) {
        fundingMessage.textContent = "Please enter a valid amount"
        fundingMessage.className = "message error"
        fundingMessage.style.display = "block"
        return
      }

      // Show loading state
      const originalButtonText = fundUserBtn.textContent
      fundUserBtn.textContent = "Processing..."
      fundUserBtn.disabled = true

      // Simulate API call
      setTimeout(() => {
        fetch("/api/admin/fund-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminId: "admin-1", // In a real app, this would be the admin's ID
            userEmail: selectedUser,
            amount: Number.parseFloat(amount),
            note: note,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              fundingMessage.textContent = `Successfully funded user with ${formatCurrency(Number.parseFloat(amount))}`
              fundingMessage.className = "message success"
              fundingMessage.style.display = "block"

              // Reset form
              document.getElementById("fund-amount").value = ""
              document.getElementById("fund-note").value = ""
              userSelectBtn.textContent = "Select a user"
              userSelectBtn.removeAttribute("data-email")

              // Refresh user list
              fetch("/api/users")
                .then((response) => response.json())
                .then((data) => {
                  if (data.success && data.users && data.users.length > 0) {
                    renderUsers(data.users, usersTableBody, userSelectOptions)
                  }
                })
                .catch((error) => {
                  console.error("Error refreshing users:", error)
                })
            } else {
              fundingMessage.textContent = data.message || "Failed to fund user. Please try again."
              fundingMessage.className = "message error"
              fundingMessage.style.display = "block"
            }

            fundUserBtn.textContent = originalButtonText
            fundUserBtn.disabled = false
          })
          .catch((error) => {
            console.error("Error:", error)

            // For demo purposes, simulate success
            fundingMessage.textContent = `Successfully funded user with ${formatCurrency(Number.parseFloat(amount))}`
            fundingMessage.className = "message success"
            fundingMessage.style.display = "block"

            // Reset form
            document.getElementById("fund-amount").value = ""
            document.getElementById("fund-note").value = ""
            userSelectBtn.textContent = "Select a user"
            userSelectBtn.removeAttribute("data-email")

            fundUserBtn.textContent = originalButtonText
            fundUserBtn.disabled = false
          })
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

// Helper function to render users
function renderUsers(users, tableBody, selectOptions) {
  if (tableBody) {
    let tableHtml = ""

    users.forEach((user) => {
      tableHtml += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${formatCurrency(user.balance)}</td>
                    <td><span class="status-badge ${user.status}">${user.status}</span></td>
                    <td class="text-right">
                        <div class="dropdown">
                            <button class="btn btn-outline btn-sm">
                                Actions <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-menu">
                                <a href="#" class="dropdown-item">View Details</a>
                                <a href="#" class="dropdown-item">Edit User</a>
                                <a href="#" class="dropdown-item fund-user-action" data-email="${user.email}">Fund Account</a>
                                <div class="dropdown-divider"></div>
                                <a href="#" class="dropdown-item text-danger">Suspend User</a>
                            </div>
                        </div>
                    </td>
                </tr>
            `
    })

    tableBody.innerHTML = tableHtml

    // Add event listeners to fund user actions
    const fundUserActions = document.querySelectorAll(".fund-user-action")
    const userSelectBtn = document.getElementById("user-select-btn")
    const fundingTab = document.querySelector('.tab-btn[data-tab="funding"]')

    fundUserActions.forEach((action) => {
      action.addEventListener("click", function (e) {
        e.preventDefault()

        const email = this.getAttribute("data-email")
        const user = users.find((u) => u.email === email)

        if (user && userSelectBtn) {
          userSelectBtn.textContent = user.name
          userSelectBtn.setAttribute("data-email", email)

          // Switch to funding tab
          if (fundingTab) {
            fundingTab.click()
          }
        }
      })
    })
  }

  if (selectOptions) {
    let optionsHtml = ""

    users.forEach((user) => {
      optionsHtml += `
                <div class="select-option" data-email="${user.email}">
                    <div>
                        <div>${user.name}</div>
                        <div class="text-muted">${user.email}</div>
                    </div>
                </div>
            `
    })

    selectOptions.innerHTML = optionsHtml

    // Add event listeners to select options
    const options = selectOptions.querySelectorAll(".select-option")
    const userSelectBtn = document.getElementById("user-select-btn")
    const selectDropdown = document.querySelector(".select-dropdown")

    options.forEach((option) => {
      option.addEventListener("click", function () {
        const email = this.getAttribute("data-email")
        const name = this.querySelector("div > div").textContent

        if (userSelectBtn) {
          userSelectBtn.textContent = name
          userSelectBtn.setAttribute("data-email", email)

          if (selectDropdown) {
            selectDropdown.classList.remove("show")
          }
        }
      })
    })
  }
}
