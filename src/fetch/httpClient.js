import axios from "axios";

export async function getRequest(url, params) {
  return axios.get(url, params);
}

export async function postRequest(url, data) {
  return axios.post(url, data);
}

export async function putRequest(url, data) {
  return axios.put(url, data);
}

export async function patchRequest(url, data) {
  return axios.patch(url, data);
}

export async function deleteRequest(url) {
  return axios.delete(url);
}
