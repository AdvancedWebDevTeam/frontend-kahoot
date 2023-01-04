import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { HiOutlineArrowSmUp, HiOutlineArrowSmDown } from "react-icons/hi";
import "./question.css";

const defaultVariant = "outline-info";

export default function QuestionsSorter({ onSort, labels, attributes }) {
  const [sortOrders, setSortOrder] = useState(attributes.map(() => "none"));

  function getNextSortOrder(currentOrder) {
    if (currentOrder === "asc") return "desc";
    if (currentOrder === "desc") return "none";
    if (currentOrder === "none") return "asc";
    return null;
  }

  function getVariant(index) {
    return sortOrders[index] === "none" ? defaultVariant : "info";
  }

  function getArrow(index) {
    if (sortOrders[index] === "asc") return <HiOutlineArrowSmUp />;
    if (sortOrders[index] === "desc") return <HiOutlineArrowSmDown />;
    return null;
  }

  function sort(e, index) {
    e.preventDefault();
    const nextOrder = getNextSortOrder(sortOrders[index]);
    const newOrders = attributes.map((attr, i) => {
      return i === index ? nextOrder : "none";
    });

    setSortOrder(newOrders);
    onSort(attributes[index], newOrders[index]);
  }

  return (
    <div className="sorter">
      {labels.map((label, index) => (
        <Button
          key={label}
          size="sm"
          value={attributes[index]}
          onClick={(e) => sort(e, index)}
          variant={getVariant(index)}
        >
          {label} {getArrow(index)}
        </Button>
      ))}
    </div>
  );
}
