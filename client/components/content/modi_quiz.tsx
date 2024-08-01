"use client";
import React, { useState } from "react";

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerOptionClick = (option: string) => {
    setSelectedOption(option);
    const isAnswerCorrect = option === currentQuestion.answer;
    setIsCorrect(isAnswerCorrect);
    setFeedback(
      isAnswerCorrect
        ? "Correct! Great job!"
        : `Incorrect. The correct answer is: ${currentQuestion.answer}`,
    );
    if (isAnswerCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      resetState();
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    const prevQuestionIndex = currentQuestionIndex - 1;
    if (prevQuestionIndex >= 0) {
      setCurrentQuestionIndex(prevQuestionIndex);
      resetState();
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    resetState();
  };

  const resetState = () => {
    setSelectedOption("");
    setIsCorrect(null);
    setFeedback("");
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-4">
          Chapter: Virology and Genetics
        </h1>
        <div className="bg-white p-6 shadow-lg rounded-xl">
          {!quizCompleted ? (
            <>
              <h2 className="text-2xl font-semibold text-center">
                {currentQuestion.topic}
              </h2>
              <p className="text-lg mt-4 mb-2">{currentQuestion.question}</p>
              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerOptionClick(option)}
                    className={`w-full text-left px-4 py-2 rounded-lg cursor-pointer
                                    ${selectedOption === option ? (isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white") : "bg-gray-200"}
                                    hover:bg-gray-300`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedback && (
                <div
                  className={`mt-4 p-2 text-center font-medium rounded-lg
                            ${isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                >
                  {feedback}
                </div>
              )}
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousQuestion}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center">
                Quiz Completed!
              </h2>
              <p className="text-lg mt-4 mb-2 text-center">
                Your Score: {score} / {quizQuestions.length}
              </p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleRetakeQuiz}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mx-2"
                >
                  Retake Quiz
                </button>
              </div>
            </>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Review Content</h3>
          <ul className="list-disc list-inside mt-2">
            {sections.map((section, index) => (
              <li key={index} className="mt-1">
                <a
                  href={section.link}
                  className="text-blue-600 hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Go Back to Review
          </button>
          <button
            onClick={() => alert("Proceed to next chapter")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mx-2"
          >
            Next Chapter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

const quizQuestions = [
  {
    topic: "Virology",
    question:
      "What classification was given to the KP.2 variant as of May 3, 2024?",
    options: [
      "Variant of Concern (VOC)",
      "Variant Under Monitoring (VUM)",
      "Variant of High Consequence",
      "Variant of Interest (VOI)",
    ],
    answer: "Variant Under Monitoring (VUM)",
  },
  {
    topic: "Virology",
    question:
      "Which mutation is associated with the KP.2 variant and has implications on the spike protein's conformation?",
    options: ["R346T", "F456L", "V1104L", "All of the above"],
    answer: "All of the above",
  },
  {
    topic: "Genetics",
    question:
      "What notable spike protein mutation is highlighted in the JN.1 variant?",
    options: ["L455S", "F456L", "N440K", "P681H"],
    answer: "L455S",
  },
];

const sections = [
  { title: "General Info", link: "/student/content" },
  { title: "KP.2", link: "/student/content/kp2" },
  { title: "JN.1", link: "/student/content/jn1" },
] as const;
