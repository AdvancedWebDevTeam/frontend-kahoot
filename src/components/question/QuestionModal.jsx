import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import uuid from "react-uuid";
import {
  getAllQuestionsOfPresent,
  requestUpdateQuestions
} from "../../fetch/questionsFetch";
import Question from "./Question";
import "./question.css";
import {
  getLoggedInUserEmail,
  getLoggedInUserId,
  getLoggedInUsername
} from "../../util/ultilis";
import QuestionInput from "./QuestionInput";
import QuestionsSorter from "./QuestionsSorter";

function QuestionModal({ show, handleClose, target }) {
  const presentId = target.presents_id;
  const ownerId = target["user.users_id"];
  const [originalQuestions, setOriginalQuestion] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [hasChange, setHasChange] = useState(false);

  useEffect(() => {
    if (show) {
      setHasChange(false);
    }
  }, [show]);

  // get list of questions
  useEffect(() => {
    if (presentId) {
      getAllQuestionsOfPresent(presentId).then((data) => {
        setQuestions(data);
        setOriginalQuestion(data);
      });
    }
  }, [target]);

  function handleVote(id, amount) {
    const newQuestions = questions.map((question) => {
      if (question.questions_id === id) {
        return {
          ...question,
          vote: question.vote + amount
        };
      }
      return question;
    });
    setQuestions(newQuestions);
    setOriginalQuestion(newQuestions);
    setHasChange(true);
  }

  function handleMarkAsAnswered(id) {
    const newQuestions = questions.map((question) => {
      if (question.questions_id === id) {
        return {
          ...question,
          is_answer: !question.is_answer
        };
      }
      return question;
    });
    setQuestions(newQuestions);
    setOriginalQuestion(newQuestions);
    setHasChange(true);
  }

  function handleAddQuestion(newQuestionContent) {
    const newQuestions = [
      ...questions,
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
    setQuestions(newQuestions);
    setOriginalQuestion(newQuestions);
    setHasChange(true);
  }

  function handleSort(attribute, order) {
    if (order === "none") {
      setQuestions(originalQuestions);
    } else {
      setQuestions((prevQuestions) => {
        return [...prevQuestions].sort((a, b) => {
          let attributeA = a[attribute];
          let attributeB = b[attribute];
          if (attribute === "questions_time") {
            attributeA = Date.parse(a[attribute]);
            attributeB = Date.parse(b[attribute]);
          }

          if (order === "asc") {
            return attributeA - attributeB;
          }
          return attributeB - attributeA;
        });
      });
    }
  }

  async function onHide() {
    if (hasChange) {
      await requestUpdateQuestions(target.presents_id, questions);
    }
    handleClose();
  }

  return (
    <Modal show={show} onHide={() => onHide()}>
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Questions</Modal.Title>
          <p className="question-modal-subtitle">{target.presents_name}</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        {questions.length > 0 && (
          <QuestionsSorter
            labels={["Is Answered", "Total Vote", "Time asked"]}
            attributes={["is_answer", "vote", "questions_time"]}
            onSort={(attribute, order) => handleSort(attribute, order)}
          />
        )}
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
