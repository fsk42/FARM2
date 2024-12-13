import React from "react";
import QAndA from "../../../components/qAndAComponent"; // Assuming the correct component name is QAndA
const QuestionAnswer = () => {
  return (
    <>
      <div className="page-header divide-y-2">Fragen und Antworten </div>
      <hr className="my-4 mx-4 bg-black-1 h-1 rounded border-0" />
      <div className="page-content">
        <QAndA />
      </div>
    </>
  );
};

export default QuestionAnswer;
