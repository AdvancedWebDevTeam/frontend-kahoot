export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getLoggedInUserId() {
  const accessToken = localStorage.getItem("accessToken");
  return JSON.parse(atob(accessToken.split(".")[1])).user.users_id;
}
