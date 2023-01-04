import React from "react";
import { Button } from "react-bootstrap";
import "./question.css";
import { ImArrowDown, ImArrowUp, ImCheckmark } from "react-icons/im";
import { getFormattedDateTimeString } from "../../util/ultilis";

export default function Question({
  question,
  onVote,
  onMarkAsAnswered,
  canMarkAsAnswered
}) {
  const [givenVote, setGivenVote] = React.useState(0);

  function upvote() {
    if (givenVote < 1) {
      setGivenVote((prev) => prev + 1);
      onVote(1);
    } else if (givenVote === 1) {
      setGivenVote((prev) => prev - 1);
      onVote(-1);
    }
  }

  function downvote() {
    if (givenVote > -1) {
      setGivenVote((prev) => prev - 1);
      onVote(-1);
    } else if (givenVote === -1) {
      setGivenVote((prev) => prev + 1);
      onVote(1);
    }
  }

  const upvoteVariant = givenVote > 0 ? "primary" : "outline-primary";
  const downvoteVariant = givenVote < 0 ? "primary" : "outline-primary";
  const markAsAnsweredVariant = question.is_answer
    ? "success"
    : "outline-success";

  return (
    <div className="question">
      <div className="question-header">
        <div>
          <h1>{question.questionerName}</h1>
          <p>{question.questionerEmail}</p>
        </div>
        <p>{getFormattedDateTimeString(question.questions_time)}</p>
      </div>

      <p className="question-content">{question.content}</p>

      <div className="question-footer">
        <Button size="sm" onClick={() => upvote()} variant={upvoteVariant}>
          <ImArrowUp />
        </Button>
        <p>{question.vote}</p>
        <Button size="sm" onClick={() => downvote()} variant={downvoteVariant}>
          <ImArrowDown />
        </Button>

        {canMarkAsAnswered && (
          <Button
            onClick={() => onMarkAsAnswered()}
            variant={markAsAnsweredVariant}
            size="sm"
            className="last-btn"
          >
            {question.is_answer ? <ImCheckmark /> : "Mark as answered"}
          </Button>
        )}
      </div>
    </div>
  );
}
