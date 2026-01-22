/**
 * View management utilities
 */
const ViewManager = (() => {
  const views = {
    login: document.getElementById('loginView'),
    booking: document.getElementById('bookingView'),
    admin: document.getElementById('adminView'),
    user: document.getElementById('userView')
  };

  // Loading spinner
  const loadingSpinner = document.getElementById('loadingSpinner');
  
  // Show loading spinner
  const showLoading = () => {
    loadingSpinner.classList.remove('hidden');
  };
  
  // Hide loading spinner
  const hideLoading = () => {
    loadingSpinner.classList.add('hidden');
  };

  // Show a specific view
  const showView = (viewName) => {
    Object.keys(views).forEach(key => {
      views[key].classList.toggle('hidden', key !== viewName);
    });
  };

  // Switch to login view
  const showLogin = () => {
    showView('login');
    document.title = 'Indian Railways - Login';
  };

  // Switch to booking view
  const showBooking = () => {
    showView('booking');
    document.title = 'Indian Railways - Book Ticket';
  };

  // Switch to admin view
  const showAdmin = () => {
    showView('admin');
    document.title = 'Indian Railways - Admin Dashboard';
  };

  // Switch to user view
  const showUser = () => {
    showView('user');
    document.title = 'Indian Railways - My Dashboard';
    UserDashboard.loadTickets();
  };

  // Show login form, hide register form
  const showLoginForm = () => {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
  };

  // Show register form, hide login form
  const showRegisterForm = () => {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
  };

  // Initialize the tab system
  const initializeTabs = (container, defaultTab) => {
    const tabBtns = container.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show the selected tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
          content.classList.add('hidden');
        });
        
        document.getElementById(`${tabName}Tab`).classList.remove('hidden');
      });
    });
    
    // Activate default tab if specified
    if (defaultTab) {
      const defaultBtn = container.querySelector(`.tab-btn[data-tab="${defaultTab}"]`);
      if (defaultBtn) {
        defaultBtn.click();
      }
    }
  };

  // Show a modal
  const showModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');

    // Close modal when clicking on the background
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal(modalId);
      }
    });

    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        hideModal(modalId);
      }
    });

    // Close button
    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        hideModal(modalId);
      });
    }
  };

  // Hide a modal
  const hideModal = (modalId) => {
    document.getElementById(modalId).classList.add('hidden');
  };

  // Show a toast notification
  const showToast = (message, type = 'info', duration = 3000) => {
    // Create toast container if not exists
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<div class="toast-content">${message}</div>`;

    // Add to container
    toastContainer.appendChild(toast);

    // Show with animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => {
        toast.remove();
        if (toastContainer.childNodes.length === 0) {
          toastContainer.remove();
        }
      });
    }, duration);
  };

  // Return public methods
  return {
    showView,
    showLogin,
    showBooking,
    showAdmin,
    showUser,
    showLoginForm,
    showRegisterForm,
    initializeTabs,
    showModal,
    hideModal,
    showToast,
    showLoading,
    hideLoading
  };
})();