import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  getAllQuestionsOfPresent,
  requestUpdateQuestions
} from "../../fetch/questionsFetch";
import Question from "./Question";
import "./question.css";

function QuestionModal({ show, handleClose, target }) {
  const presentId = target.presents_id;
  const ownerId = target["user.users_id"];
  const collaboratorIds = target.collaborators?.map((collaborator) => {
    return collaborator.userId;
  });
  const [questions, setQuestions] = React.useState([]);
  const [hasChange, setHasChange] = React.useState(false);

  useEffect(() => {
    if (presentId) {
      getAllQuestionsOfPresent(presentId).then((data) => {
        setQuestions(data);
      });
    }
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
    setHasChange(true);
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
    setHasChange(true);
  }

  async function onHide() {
    if (hasChange) {
      await requestUpdateQuestions(target.presents_id, questions);
    }
    handleClose();
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Questions</Modal.Title>
          <p className="question-modal-subtitle">{target.presents_name}</p>
        </div>
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
