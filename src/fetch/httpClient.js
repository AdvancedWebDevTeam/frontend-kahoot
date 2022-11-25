import axios from "axios";

export async function getRequest(url, params) {
  return axios.get(url, params);
}

export async function postRequest(url, data) {
  return axios.post(url, data);
}
