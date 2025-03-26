
/**
 * API service for handling all API requests
 */
const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

/**
 * Generic fetch function with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
async function fetchWithErrorHandling(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error in ${endpoint}:`, error);
    throw error;
  }
}

// Products API
export const productsApi = {
  getAll: () => fetchWithErrorHandling('products'),
  getById: (id) => fetchWithErrorHandling(`products/${id}`),
  create: (data) => fetchWithErrorHandling('products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchWithErrorHandling(`products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchWithErrorHandling(`products/${id}`, {
    method: 'DELETE',
  }),
};

// Customers API
export const customersApi = {
  getAll: () => fetchWithErrorHandling('customers'),
  getById: (id) => fetchWithErrorHandling(`customers/${id}`),
  create: (data) => fetchWithErrorHandling('customers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchWithErrorHandling(`customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchWithErrorHandling(`customers/${id}`, {
    method: 'DELETE',
  }),
};

// Sales API
export const salesApi = {
  getAll: () => fetchWithErrorHandling('sales'),
  getById: (id) => fetchWithErrorHandling(`sales/${id}`),
  create: (data) => fetchWithErrorHandling('sales', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchWithErrorHandling(`sales/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchWithErrorHandling(`sales/${id}`, {
    method: 'DELETE',
  }),
};

// Purchases API
export const purchasesApi = {
  getAll: () => fetchWithErrorHandling('purchases'),
  getById: (id) => fetchWithErrorHandling(`purchases/${id}`),
  create: (data) => fetchWithErrorHandling('purchases', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchWithErrorHandling(`purchases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchWithErrorHandling(`purchases/${id}`, {
    method: 'DELETE',
  }),
};

// Auth API
export const authApi = {
  login: (credentials) => fetchWithErrorHandling('login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  forgotPassword: (email) => fetchWithErrorHandling('forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  resetPassword: (token, password) => fetchWithErrorHandling('reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  }),
};

// Repairs API
export const repairsApi = {
  getAll: () => fetchWithErrorHandling('repairs'),
  getById: (id) => fetchWithErrorHandling(`repairs/${id}`),
  create: (data) => fetchWithErrorHandling('repairs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchWithErrorHandling(`repairs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchWithErrorHandling(`repairs/${id}`, {
    method: 'DELETE',
  }),
};
