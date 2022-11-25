import { getRequest } from "./httpClient";

export async function getGroupsOfUser(userId) {
  const url = `${process.env.REACT_APP_API_URL}/groups/user/${userId}`;
  const result = await getRequest(url);
  return result.data;
}
