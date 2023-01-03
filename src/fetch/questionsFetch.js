import { getRequest, putRequest } from "./httpClient";

export async function getAllQuestionsOfPresent(id) {
  const url = `${process.env.REACT_APP_API_URL}/questions/${id}`;
  const res = await getRequest(url);
  return res.data;
}

export async function requestUpdateQuestions(presentsId, questions) {
  const url = `${process.env.REACT_APP_API_URL}/questions/${presentsId}/update`;
  const data = { questions };
  const res = await putRequest(url, data);
  return res.status === 200;
}
