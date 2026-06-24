import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach JWT token from localStorage ──────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 Unauthorized globally ───────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const hadToken = !!localStorage.getItem("token");

      // Only hard-redirect if the user HAD a valid token that has now expired.
      // If there was no token (e.g. initial /me probe on page load) we simply
      // reject the promise and let AuthContext handle it gracefully — this
      // prevents a redirect loop on the Login page itself.
      if (hadToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Avoid redirecting if we are already on the login page
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
