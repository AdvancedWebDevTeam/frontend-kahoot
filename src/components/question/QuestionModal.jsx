import React, {useEffect} from "react";
import {Modal} from "react-bootstrap";
import uuid from "react-uuid";
import {getAllQuestionsOfPresent, requestUpdateQuestions} from "../../fetch/questionsFetch";
import Question from "./Question";
import "./question.css";
import {getLoggedInUserEmail, getLoggedInUserId, getLoggedInUsername} from "../../util/ultilis";
import QuestionInput from "./QuestionInput";

function QuestionModal({ show, handleClose, target }) {
  const presentId = target.presents_id;
  const ownerId = target["user.users_id"];
  const [questions, setQuestions] = React.useState([]);
  const [hasChange, setHasChange] = React.useState(false);

  useEffect(() => {
    if (show) {
      setHasChange(false);
    }
  }, [show]);

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

  function handleAddQuestion(newQuestionContent) {
    setQuestions((prevQuestions) => {
      return [
        ...prevQuestions,
        {
          questions_id: uuid(),
          content: newQuestionContent,
          vote: 0,
          is_answer: false,
          questionerId: getLoggedInUserId(),
          questionerName: getLoggedInUsername(),
          questionerEmail: getLoggedInUserEmail(),
          questions_time: new Date()
        }
      ];
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
            canMarkAsAnswered={getLoggedInUserId() === ownerId}
          />
        ))}
        <QuestionInput onSubmit={(question) => handleAddQuestion(question)} />
      </Modal.Body>
    </Modal>
  );
}

export default QuestionModal;
