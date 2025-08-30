import axios from "axios";

async function isLoggedIn() {
  const response = await axios.get<{ username: string }>(`/logins`);
  return response.data.username;
}

async function login(creds: { username: string; password: string }) {
  await axios.post<{ username: string }>(`/logins`, creds);
  return;
}

async function logout() {
  const response = await axios.delete(`/logins`);
  return response.data;
}

const loginService = { login, isLoggedIn, logout };

export { loginService };
