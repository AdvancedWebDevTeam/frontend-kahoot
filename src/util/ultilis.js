import moment from "moment";

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getLoggedInUserId() {
  const accessToken = getAccessToken();
  return JSON.parse(atob(accessToken.split(".")[1])).user.users_id;
}

export function getLoggedInUsername() {
  const accessToken = getAccessToken();
  return JSON.parse(atob(accessToken.split(".")[1])).user.users_name;
}

export function getLoggedInUserEmail() {
  const accessToken = getAccessToken();
  return JSON.parse(atob(accessToken.split(".")[1])).user.email;
}

export function getFormattedDateTimeString(dateStr) {
  return moment(dateStr).format("DD-MM-YYYY, HH:mm");
}
