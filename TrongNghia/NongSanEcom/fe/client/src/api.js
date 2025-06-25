const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API_ENDPOINTS = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  PROFILE: '/api/auth/profile',
  LOGOUT: '/api/auth/logout'
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Có lỗi xảy ra');
  }
  return response.json();
};

export const registerUser = async (data) => {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.REGISTER}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const loginUser = async (data) => {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getUserProfile = async () => {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.PROFILE}`, {
    credentials: 'include',
  });
  return handleResponse(response);
};

export const logoutUser = async () => {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.LOGOUT}`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(response);
};