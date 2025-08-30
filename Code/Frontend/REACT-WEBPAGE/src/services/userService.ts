import axios from "axios";
import { User, UserCreate } from "../types";

async function create(user: UserCreate) {
  await axios.post(`/users`, user);
  return;
}

async function get(username: string) {
  const response = await axios.get<User>(`/users/${username}`);
  return response.data;
}

const userService = { get, create };

export { userService };
