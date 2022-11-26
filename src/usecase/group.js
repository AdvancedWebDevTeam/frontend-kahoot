import { getAllUsers } from "../fetch/userFetch";

export async function getPotentialMembersForOwner(ownerId) {
  const users = await getAllUsers();
  return users.filter((user) => user.users_id !== ownerId);
}
