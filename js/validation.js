/**
 * Form validation utilities
 */
const Validator = (() => {
  // Validate username
  const username = (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers and underscores';
    return null;
  };

  // Validate password
  const password = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  // Validate email
  const email = (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  };

  // Validate full name
  const fullName = (value) => {
    if (!value) return 'Full name is required';
    if (value.length < 3) return 'Full name must be at least 3 characters';
    return null;
  };

  // Validate station name
  const station = (value) => {
    if (!value) return 'Station name is required';
    return null;
  };

  // Validate date
  const date = (value) => {
    if (!value) return 'Date is required';
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) return 'Date cannot be in the past';
    return null;
  };

  // Validate form
  const validateForm = (formData, rules) => {
    const errors = {};
    let isValid = true;

    for (const field in rules) {
      if (rules.hasOwnProperty(field)) {
        const value = formData[field];
        const validateFn = rules[field];
        const error = validateFn(value);
        
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      }
    }

    return { isValid, errors };
  };

  // Validate phone number
  const phone = (value) => {
    if (!value) return 'Phone number is required';
    if (!/^\d{10}$/.test(value)) return 'Please enter a valid 10-digit phone number';
    return null;
  };

  // Validate age
  const age = (value) => {
    if (!value) return 'Age is required';
    const ageNum = parseInt(value);
    if (isNaN(ageNum)) return 'Age must be a number';
    if (ageNum < 1 || ageNum > 120) return 'Please enter a valid age';
    return null;
  };

  // Show validation error on form field
  const showError = (inputElement, errorMessage) => {
    const formGroup = inputElement.closest('.form-group');
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = errorMessage;
  };

  // Clear validation error
  const clearError = (inputElement) => {
    const formGroup = inputElement.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = '';
    }
  };
  
  // Clear all errors in a form
  const clearAllErrors = (formElement) => {
    const errorElements = formElement.querySelectorAll('.error-message');
    const formGroups = formElement.querySelectorAll('.form-group.error');
    
    errorElements.forEach(element => {
      element.textContent = '';
    });
    
    formGroups.forEach(group => {
      group.classList.remove('error');
    });
  };

  // Shake animation for form on error
  const shakeForm = (formElement) => {
    formElement.classList.add('shake');
    setTimeout(() => {
      formElement.classList.remove('shake');
    }, 500);
  };

  // Public API
  return {
    username,
    password,
    email,
    fullName,
    station,
    date,
    phone,
    age,
    validateForm,
    showError,
    clearError,
    clearAllErrors,
    shakeForm
  };
})();