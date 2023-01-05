import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest
} from "./httpClient";

export async function getAllPresentationsInGroup(groupId) {
  const url = `${process.env.REACT_APP_API_URL}/presentations/${groupId}`;
  const result = await getRequest(url);
  return result.data;
}

export async function getAllChat(presentID) {
  const url = `${process.env.REACT_APP_API_URL}/presentations/chat/${presentID}`;
  const result = await getRequest(url);
  return result.data;
}

export async function getAllMyPresentations(userId) {
  const url = `${process.env.REACT_APP_API_URL}/presentations/mypresent/${userId}`;
  const result = await getRequest(url);
  return result.data;
}

export async function getUserRoleInGroup(groupId, userId) {
  const url = `${process.env.REACT_APP_API_URL}/presentations/${groupId}/role/${userId}`;
  const result = await getRequest(url);
  return result.data;
}

export async function addNewPresentation(groupId, userId, presentName) {
  const url = `${process.env.REACT_APP_API_URL}/presentations/add`;
  const data = {
    groupId,
    userId,
    presentName
  };
  const result = await postRequest(url, data);
  return result.data;
}

export async function updatePresentation(id, presentName) {
  const url = `${process.env.REACT_APP_API_URL}/presentations/${id}/update`;
  const data = {
    name: presentName
  };
  const result = await putRequest(url, data);
  return result.data;
}

export async function deletePresentation(id) {
  const url = `${process.env.REACT_APP_API_URL}/presentations/delete/${id}`;
  const result = await deleteRequest(url);
  return result.data;
}
