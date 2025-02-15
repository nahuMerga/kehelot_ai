import axios from "axios";

// Set up Axios instance
const API_BASE_URL = "https://kehelotapi.vercel.app/kehelot_ai";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Function to set Authorization header globally
const setAuthHeader = async () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      await api.get("/chat_history/"); // Test token validity
    } catch (error) {
      if (error.response?.status === 401) {
        // console.log("Token expired, refreshing...");
        const refreshResponse = await refreshAccessToken();
        if (refreshResponse.access) {
          localStorage.setItem("access_token", refreshResponse.access);
          api.defaults.headers.common["Authorization"] = `Bearer ${refreshResponse.access}`;
        } else {
          // console.error("Failed to refresh token.");
        }
      }
    }
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register/", userData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.detail || "Registration failed" };
  }
};

// Login user
export const loginUser = async (userData) => {
  try {
    const response = await api.post("/login/", userData);
    const { access, refresh } = response.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    await setAuthHeader();
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.detail || "Login failed" };
  }
};

// Refresh access token
export const refreshAccessToken = async () => {
  setAuthHeader()
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return { error: "No refresh token available" };

  try {
    const response = await api.post("/token_refresh/", { refresh: refreshToken });
    const { access } = response.data;
    localStorage.setItem("access_token", access);
    api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "Failed to refresh token" };
  }
};

// Get chat history
export const getChatHistory = async () => {
  
  try {
    const response = await api.get("/chat_history/");
    return response.data.chat_history || [];  // Ensure correct extraction
  } catch (error) {
    if (error.response?.status === 401) {
      // console.error("Unauthorized: Token expired. Attempting to refresh...");
      await refreshAccessToken();
      return getChatHistory();
    }
    return [];
  }
};


// Send message to AI
export const sendMessageToAI = async (message) => {
  setAuthHeader()
  const token = localStorage.getItem("access_token");
  const userId = Number(localStorage.getItem("user_id"));
  const safeMessage = message?.trim() || "";

  if (!token || isNaN(userId) || !safeMessage) {
    // console.error("Missing data:", { token, userId, safeMessage });
    return { error: "User ID, token, or message is missing. Please try again." };
  }

  try {
    const response = await api.post("/chat/", { user: userId, message: safeMessage });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "Failed to send message" };
  }
};

// Get heritage cards
export const getHeritageCards = async () => {
  try {
    const response = await api.get("/heritage/");
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "Failed to fetch heritage cards" };
  }
};
