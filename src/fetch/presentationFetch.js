import { getRequest, postRequest } from "./httpClient";

export async function getAllPresentationsInGroup(groupId) {
    const url = `${process.env.REACT_APP_API_URL}/presentations/${groupId}`;
    const result = await getRequest(url);
    return result.data;
}

export async function getUserRoleInGroup(groupId, userId) {
    const url = `${process.env.REACT_APP_API_URL}/presentations/${groupId}/role/${userId}`;
    const result = await getRequest(url);
    return result.data;
}

export async function addNewPresentation(groupId, userId, presentName)
{
    const url = `${process.env.REACT_APP_API_URL}/presentations/add`;
    const data = {
        groupId: groupId,
        userId: userId,
        presentName: presentName
    }
    const result = await postRequest(url, data);
    return result.data;
}