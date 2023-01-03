import { putRequest } from "./httpClient";

export async function updatePresentationCollaborators(id, collaborators) {
  const url = `${process.env.REACT_APP_API_URL}/presentations/${id}/update-collaborators`;
  const data = {
    collaborators
  };
  const result = await putRequest(url, data);
  return result.data;
}
