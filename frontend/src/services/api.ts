import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (data: any) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
};

// Categories
export const categoriesApi = {
  getAll: () => api.get("/categories"),
  getOne: (id: number) => api.get(`/categories/${id}`),
  create: (data: any) => api.post("/categories", data),
  update: (id: number, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Books
export const booksApi = {
  getAll: () => api.get("/books"),
  getOne: (id: number) => api.get(`/books/${id}`),
  create: (data: any) => api.post("/books", data),
  update: (id: number, data: any) => api.patch(`/books/${id}`, data),
  delete: (id: number) => api.delete(`/books/${id}`),
};

// Users
export const usersApi = {
  getAll: () => api.get("/users"),
  getOne: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post("/users", data),
  update: (id: number, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Loans
export const loansApi = {
  getAll: () => api.get("/loans"),
  getOne: (id: number) => api.get(`/loans/${id}`),
  create: (data: any) => api.post("/loans", data),
  update: (id: number, data: any) => api.patch(`/loans/${id}`, data),
  delete: (id: number) => api.delete(`/loans/${id}`),
};
