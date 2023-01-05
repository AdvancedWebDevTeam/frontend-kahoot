import React from "react";
import { Button, Form } from "react-bootstrap";
import { BiSend } from "react-icons/bi";
import "./question.css";

export default function QuestionInput({ onSubmit }) {
  const [newQuestion, setNewQuestion] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(newQuestion);
    setNewQuestion("");
  }

  return (
    <Form className="question-input" onSubmit={handleSubmit}>
      <Form.Control
        type="text"
        placeholder="Enter your question"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        className="input"
        as="textarea"
      />
      <Button variant="outline-primary" type="submit" size="sm">
        <BiSend />
      </Button>
    </Form>
  );
}
