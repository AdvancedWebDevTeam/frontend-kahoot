import { getRequest, putRequest } from "./httpClient";

export async function getAllAvailableRoles() {
  const url = `${process.env.REACT_APP_API_URL}/roles/all`;
  const res = await getRequest(url);
  return res.data;
}

export async function requestMemberRoleChange(groupId, userId, roleId) {
  const url = `${process.env.REACT_APP_API_URL}/roles/assign`;
  const data = {
    groupId,
    userId,
    roleId,
    createNewIfNotExists: false
  };
  const res = await putRequest(url, data);
  return res.status === 200;
}
