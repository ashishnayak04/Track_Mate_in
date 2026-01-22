/**
 * Authentication Module
 */
const Auth = (() => {
  // DOM elements
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const regFullNameInput = document.getElementById('regFullName');
  const regEmailInput = document.getElementById('regEmail');
  const regUsernameInput = document.getElementById('regUsername');
  const regPasswordInput = document.getElementById('regPassword');
  const regPasswordConfirmInput = document.getElementById('regPasswordConfirm');
  const showRegisterBtn = document.getElementById('showRegister');
  const showLoginBtn = document.getElementById('showLogin');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const welcomeUserSpan = document.getElementById('welcomeUser');

  // Login a user
  const login = (username, password) => {
    const users = DB.getAll(DB.KEYS.USERS);
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      DB.setCurrentUser(user);
      return user;
    }
    
    return null;
  };

  // Register a new user
  const register = (userData) => {
    const users = DB.getAll(DB.KEYS.USERS);
    
    // Check if username already exists
    if (users.find(u => u.username === userData.username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already exists' };
    }
    
    // Create new user
    const newUser = {
      id: DB.generateId(),
      username: userData.username,
      password: userData.password, // In a real app, this would be hashed
      name: userData.name,
      email: userData.email,
      role: 'user', // Default role
      createdAt: new Date().toISOString()
    };
    
    DB.add(DB.KEYS.USERS, newUser);
    
    return { success: true, user: newUser };
  };

  // Logout the current user
  const logout = () => {
    DB.setCurrentUser(null);
    ViewManager.showLogin();
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    return DB.getCurrentUser() !== null;
  };

  // Handle login form submission
  const handleLoginForm = () => {
    const loginButton = loginForm.querySelector('.login-btn');
    
    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Clear previous errors
      Validator.clearAllErrors(loginForm);
      
      // Get form data
      const formData = {
        username: usernameInput.value,
        password: passwordInput.value
      };
      
      // Validate form
      const rules = {
        username: Validator.username,
        password: Validator.password
      };
      
      const { isValid, errors } = Validator.validateForm(formData, rules);
      
      if (!isValid) {
        // Show validation errors
        for (const field in errors) {
          if (errors.hasOwnProperty(field)) {
            const inputElement = loginForm.querySelector(`#${field}`);
            Validator.showError(inputElement, errors[field]);
          }
        }
        
        Validator.shakeForm(loginForm);
        return;
      }
      
      // Attempt login
      ViewManager.showLoading();
      
      setTimeout(() => {
        const user = login(formData.username, formData.password);
        
        ViewManager.hideLoading();
        
        if (user) {
          // Redirect based on role
          if (user.role === 'admin') {
            ViewManager.showAdmin();
          } else {
            ViewManager.showUser();
            welcomeUserSpan.textContent = `Welcome, ${user.name}`;
          }
        } else {
          Validator.shakeForm(loginForm);
          ViewManager.showToast('Invalid username or password', 'error');
        }
      }, 800);
    });
  };

  // Handle register form submission
  const handleRegisterForm = () => {
    const registerButton = registerForm.querySelector('.register-btn');
    
    registerButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Clear previous errors
      Validator.clearAllErrors(registerForm);
      
      // Get form data
      const formData = {
        name: regFullNameInput.value,
        email: regEmailInput.value,
        username: regUsernameInput.value,
        password: regPasswordInput.value,
        passwordConfirm: regPasswordConfirmInput.value
      };
      
      // Validate form
      const rules = {
        name: Validator.fullName,
        email: Validator.email,
        username: Validator.username,
        password: Validator.password
      };
      
      const { isValid, errors } = Validator.validateForm(formData, rules);
      
      // Check if passwords match
      if (formData.password !== formData.passwordConfirm) {
        Validator.showError(regPasswordConfirmInput, 'Passwords do not match');
        Validator.shakeForm(registerForm);
        return;
      }
      
      if (!isValid) {
        // Show validation errors
        for (const field in errors) {
          if (errors.hasOwnProperty(field)) {
            let inputId = field;
            if (field === 'name') inputId = 'regFullName';
            if (field === 'email') inputId = 'regEmail';
            if (field === 'username') inputId = 'regUsername';
            if (field === 'password') inputId = 'regPassword';
            
            const inputElement = registerForm.querySelector(`#${inputId}`);
            Validator.showError(inputElement, errors[field]);
          }
        }
        
        Validator.shakeForm(registerForm);
        return;
      }
      
      // Register new user
      ViewManager.showLoading();
      
      setTimeout(() => {
        const result = register({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password
        });
        
        ViewManager.hideLoading();
        
        if (result.success) {
          ViewManager.showToast('Registration successful! You can now login.', 'success');
          ViewManager.showLoginForm();
          
          // Clear form
          regFullNameInput.value = '';
          regEmailInput.value = '';
          regUsernameInput.value = '';
          regPasswordInput.value = '';
          regPasswordConfirmInput.value = '';
        } else {
          ViewManager.showToast(result.message, 'error');
          Validator.shakeForm(registerForm);
        }
      }, 800);
    });
  };

  // Initialize auth module
  const init = () => {
    // Show register form
    showRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ViewManager.showRegisterForm();
    });
    
    // Show login form
    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ViewManager.showLoginForm();
    });
    
    // Handle logout
    logoutBtn.addEventListener('click', logout);
    adminLogoutBtn.addEventListener('click', logout);
    
    // Handle form submissions
    handleLoginForm();
    handleRegisterForm();
    
    // Check if user is already logged in
    const currentUser = DB.getCurrentUser();
    if (currentUser) {
      if (currentUser.role === 'admin') {
        ViewManager.showAdmin();
      } else {
        welcomeUserSpan.textContent = `Welcome, ${currentUser.name}`;
        ViewManager.showUser();
      }
    } else {
      ViewManager.showLogin();
    }
  };

  // Public API
  return {
    init,
    login,
    logout,
    register,
    isLoggedIn
  };
})();