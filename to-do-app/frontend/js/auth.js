const API_URL = 'http://localhost:3000';

//===================================
// Helper arrow functions
//===================================

const showError = (message) => {
  const element = document.getElementById('errorMessage');
  if (element) {
    element.textContent = message;

    element.classList.remove('d-none');
  }
};

const hideError = (message) => {
  const element = document.getElementById('errorMessage');
  if (element) {
    element.textContent = message;

    element.classList.add('d-none');
  }
};

const showSuccess = (message) => {
  const element = document.getElementById('successMessage');
  if (element) {
    element.textContent = message;

    element.classList.remove('d-none');
  }
};

const setLoading = (isLoading) => {
  const btn = document.getElementById('submitBtn');
  if (!btn) return;

  btn.disabled = isLoading;
  btn.textContent = isLoading ? 'Please wait...' : btn.dataset.defaultText;
};

//===================================
// Sign up
//===================================

const signupForm = document.getElementById('signupForm');

if (signupForm) {
  document.getElementById('submitBtn').dataset.defaultText = 'Create Account';

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideError();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!name || !email || !password) {
      showError('Please fill in all fields in this form');
      return;
    }

    if (password.length < 8) {
      showError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || 'something went wrong.');
        return;
      }

      showSuccess('Account created! Redirecting to login...');
      setTimeout(() => (window.location.href = './login.html'), 1000);
    } catch (error) {
      showError('Could not connect to the server. Is it running?');
    } finally {
      setLoading(false);
    }
  });
}

//===================================
// Login
//===================================

const loginForm = document.getElementById('loginForm');

if (loginForm) {
  document.getElementById('submitBtn').dataset.defaultText = 'Log In';

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideError();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        showError(data.error || 'Something went wrong.');
        return;
      }

      // Store the JWT — we'll send this with every future task request
      localStorage.setItem('token', data.token);
      window.location.href = './dashboard.html';

    } catch (err) {
      showError('Could not connect to the server. Is it running?');
    } finally {
      setLoading(false);
    }
  });
}