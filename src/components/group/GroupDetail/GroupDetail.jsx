import React, { useEffect } from "react";
import MemberList from "./MemberList";
import { getMembersInGroup } from "../../../fetch/groupFetch";
import { capitalizeFirstLetter } from "../../../util/string";
import "./groupDetail.css";

function GroupDetail({ group }) {
  const [members, setMembers] = React.useState([]);

  useEffect(() => {
    getMembersInGroup(group.groups_id).then((data) => {
      setMembers(data);
    });
  }, []);

  return (
    <div className="group-detail">
      <h1 className="title">{capitalizeFirstLetter(group.groups_name)}</h1>
      <p>Số lượng thành viên: {members.length}</p>
      <MemberList members={members} groupId={group.groups_id} />
    </div>
  );
}

export default GroupDetail;
