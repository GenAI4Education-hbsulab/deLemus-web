"use client";
import React, { useState } from "react";

const AIQuiz = () => {
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
          Chapter: AI and Machine Learning
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

export default AIQuiz;

const quizQuestions = [
  {
    topic: "Machine Learning",
    question:
      "Which type of machine learning algorithm is trained on labeled data to make predictions on new, unseen data?",
    options: [
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Semi-supervised Learning",
      "Supervised Learning",
    ],
    answer: "Supervised Learning",
  },
  {
    topic: "Machine Learning",
    question: "In unsupervised learning, the primary task is:",
    options: [
      "Predicting an output value based on input data",
      "Discovering patterns or structures in data",
      "Maximizing cumulative rewards through interactions with the environment",
      "Learning from expert demonstrations",
    ],
    answer: "Discovering patterns or structures in data",
  },
  {
    topic: "Machine Learning",
    question:
      "Which technique is used for reducing the dimensionality of data while preserving its most important features?",
    options: [
      "Principal Component Analysis (PCA)",
      "Linear Regression",
      "Logistic Regression",
      "Gradient Descent",
    ],
    answer: "Principal Component Analysis (PCA)",
  },
  {
    topic: "Machine Learning",
    question:
      "Which machine learning algorithm is inspired by the behavior of neurons in the human brain?",
    options: [
      "Decision Trees",
      "k-Nearest Neighbors (k-NN)",
      "Support Vector Machines (SVM)",
      "Artificial Neural Networks (ANN)",
    ],
    answer: "Artificial Neural Networks (ANN)",
  },
  {
    topic: "Machine Learning",
    question: "The loss function in a machine learning model measures:",
    options: [
      "The number of features used in the model",
      "The complexity of the model",
      "The difference between predicted and actual values",
      "The time taken to train the model",
    ],
    answer: "The difference between predicted and actual values",
  },
  {
    topic: "Machine Learning",
    question:
      "What is the name of the technique used to deal with overfitting in machine learning models?",
    options: [
      "Underfitting",
      "Regularization",
      "Feature Engineering",
      "Cross-validation",
    ],
    answer: "Regularization",
  },
  {
    topic: "Machine Learning",
    question:
      "Which evaluation metric is commonly used for binary classification problems and measures the proportion of true positive predictions among all positive examples?",
    options: ["Precision", "Recall", "F1-score", "Accuracy"],
    answer: "Recall",
  },
  {
    topic: "Machine Learning",
    question:
      "Which machine learning algorithm is designed to handle sequential data and has been widely used in speech recognition and natural language processing?",
    options: [
      "Convolutional Neural Network (CNN)",
      "Long Short-Term Memory (LSTM)",
      "Support Vector Machines (SVM)",
      "k-Nearest Neighbors (k-NN)",
    ],
    answer: "Long Short-Term Memory (LSTM)",
  },
  {
    topic: "Machine Learning",
    question:
      "Which technique is used for reducing the variance of a machine learning model by combining predictions from multiple models?",
    options: [
      "Regularization",
      "Bagging",
      "Feature Selection",
      "Hyperparameter Tuning",
    ],
    answer: "Bagging",
  },
  {
    topic: "Machine Learning",
    question:
      "Which method is used for reducing the learning rate during the training of neural networks to avoid overshooting the optimal weights?",
    options: [
      "Gradient Descent",
      "Learning Rate Decay",
      "Momentum",
      "Batch Normalization",
    ],
    answer: "Learning Rate Decay",
  },
];

const sections = [{ title: "General Info", link: "/student/content" }] as const;
