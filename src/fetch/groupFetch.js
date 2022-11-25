import { getRequest, postRequest } from "./httpClient";

export async function getGroupsOfUser(userId) {
  const url = `${process.env.REACT_APP_API_URL}/groups/user/${userId}`;
  const result = await getRequest(url);
  return result.data;
}

export async function postCreateGroupRequest(groupName, ownerId, memberIds) {
  const url = `${process.env.REACT_APP_API_URL}/groups/create`;
  const data = {
    groupName,
    userId: ownerId,
    memberIds
  };
  const result = await postRequest(url, data);
  return result.status === 200;
}
