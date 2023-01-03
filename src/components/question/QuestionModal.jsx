import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { getAllQuestionsOfPresent } from "../../fetch/questionsFetch";
import Question from "./Question";

function QuestionModal({ show, handleClose, target }) {
  const presentId = target.presents_id;
  const ownerId = target["user.users_id"];
  const collaboratorIds = target.collaborators?.map((collaborator) => {
    return collaborator.userId;
  });
  const [questions, setQuestions] = React.useState([]);

  useEffect(() => {
    getAllQuestionsOfPresent(presentId).then((data) => {
      setQuestions(data);
    });
  }, [target]);

  function handleVote(id, amount) {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question) => {
        if (question.questions_id === id) {
          return {
            ...question,
            vote: question.vote + amount
          };
        }
        return question;
      });
    });
  }

  function handleMarkAsAnswered(id) {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question) => {
        if (question.questions_id === id) {
          return {
            ...question,
            is_answer: !question.is_answer
          };
        }
        return question;
      });
    });
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Questions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {questions.map((question) => (
          <Question
            key={question.questions_id}
            question={question}
            onVote={(amount) => handleVote(question.questions_id, amount)}
            onMarkAsAnswered={() => handleMarkAsAnswered(question.questions_id)}
          />
        ))}
      </Modal.Body>
    </Modal>
  );
}

export default QuestionModal;
