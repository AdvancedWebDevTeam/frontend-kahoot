import React, { useRef, useState } from "react";
import { Button, Popover } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { BsTrash } from "react-icons/bs";

export default function DeleteButton(props) {
  const { text, onDelete, style } = props;
  // use ref to force click button to hide popover. useState does not work
  const deleteBtnRef = useRef(null);

  function confirmDelete() {
    deleteBtnRef.current.click();
    onDelete();
  }

  function hide() {
    deleteBtnRef.current.click();
  }

  const popover = (
    <Popover>
      <Popover.Body>
        <p>{text}</p>
        <Button
          className="fs-7 m-1"
          variant="danger"
          onClick={() => confirmDelete()}
        >
          Yes
        </Button>
        <Button
          className="fs-7"
          variant="outline-secondary"
          onClick={() => hide()}
        >
          No
        </Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      onHide={() => hide()}
      rootClose
      overlay={popover}
    >
      <Button variant="outline-danger" style={style} ref={deleteBtnRef}>
        <BsTrash />
      </Button>
    </OverlayTrigger>
  );
}
