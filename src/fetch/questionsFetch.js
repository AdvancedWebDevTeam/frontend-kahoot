import { getRequest } from "./httpClient";

export async function getAllQuestionsOfPresent(id) {
  const url = `${process.env.REACT_APP_API_URL}/questions/${id}`;
  const res = await getRequest(url);
  return res.data;
}
