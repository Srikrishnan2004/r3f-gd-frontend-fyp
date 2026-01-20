const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/group-discussion";

export const api = {
  async signup(userData) {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Signup failed");
    }
    return data;
  },

  async login(credentials) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }
    return data;
  },

  async createSession(sessionData) {
    const response = await fetch(`${BASE_URL}/create-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to create session");
    }
    return data;
  }
};
