import { getRequest } from "./httpClient";

export async function getAllUsers() {
  const url = `${process.env.REACT_APP_API_URL}/users/all`;
  const result = await getRequest(url);
  return result.data;
}
