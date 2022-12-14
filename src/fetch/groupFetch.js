import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest
} from "./httpClient";

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
  return { status: result.status === 200, data: result.data };
}

export async function requestDeleteGroup(id) {
  const url = `${process.env.REACT_APP_API_URL}/groups/${id}`;
  const result = await deleteRequest(url);
  return result.status === 200;
}

export async function getMembersInGroup(groupId) {
  const url = `${process.env.REACT_APP_API_URL}/groups/${groupId}/users`;
  const result = await getRequest(url);
  return result.data;
}

export async function requestKickMember(groupId, userId) {
  const url = `${process.env.REACT_APP_API_URL}/groups/${groupId}/kick/${userId}`;
  const result = await getRequest(url);
  return result.status === 200;
}

export async function getOwnerAndCoOwnersOfGroup(id) {
  const url = `${process.env.REACT_APP_API_URL}/groups/${id}/authorities`;
  const result = await getRequest(url);
  return result.data;
}
