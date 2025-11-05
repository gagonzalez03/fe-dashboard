'use client';

import React, { useState } from 'react';
import { ChevronDown, Calculator, BookOpen, Zap, Hammer, Droplet, Mountain, Truck, Building2, Compass, BarChart3, CheckCircle, XCircle, ArrowRight, Clock, Play } from 'lucide-react';

// Timed Quiz Modal Component
const TimedQuizModal = ({ questions, subtopicTitle, onClose, onComplete }) => {
  const [timeLimit, setTimeLimit] = useState(5);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  React.useEffect(() => {
    if (!quizStarted || timeRemaining === null) return;

    if (timeRemaining <= 0) {
      setQuizCompleted(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const handleStartQuiz = () => {
    setTimeRemaining(timeLimit * 60);
    setQuizStarted(true);
  };

  const handleAnswer = (answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach((question, idx) => {
      const answer = quizAnswers[idx];
      if (!answer) return;

      if (question.type === 'multiple-choice') {
        const userAnswers = new Set(answer);
        const isCorrect = question.correctAnswers.size === userAnswers.size &&
          [...question.correctAnswers].every(c => userAnswers.has(c));
        if (isCorrect) correct++;
      } else if (question.type === 'fill-in-blank') {
        const isCorrect = question.correctAnswers.some(correct =>
          answer.toLowerCase().trim() === correct.toLowerCase().trim()
        );
        if (isCorrect) correct++;
      } else if (question.type === 'point-and-click') {
        if (answer === question.correctAnswer) correct++;
      }
    });
    return { correct, total: questions.length };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!quizStarted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Start Timed Quiz</h2>
            <p className="text-gray-400 mb-6">{subtopicTitle}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Time Limit:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 10].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTimeLimit(mins)}
                      className={`p-3 rounded font-medium transition-all ${
                        timeLimit === mins
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700 bg-opacity-40 p-4 rounded">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">{questions.length} questions</span> | Time limit: <span className="font-medium">{timeLimit} minutes</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartQuiz}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const results = calculateResults();
    const percentage = Math.round((results.correct / results.total) * 100);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-gray-400 mb-6">{subtopicTitle}</p>

            <div className="bg-gray-700 bg-opacity-40 p-6 rounded mb-6">
              <div className="text-5xl font-bold text-white mb-2">{percentage}%</div>
              <div className="text-lg text-gray-300">
                {results.correct} of {results.total} correct
              </div>
            </div>

            <div className={`p-4 rounded mb-6 ${
              percentage >= 80
                ? 'bg-green-600 bg-opacity-20 text-green-200'
                : percentage >= 60
                ? 'bg-yellow-600 bg-opacity-20 text-yellow-200'
                : 'bg-red-600 bg-opacity-20 text-red-200'
            }`}>
              {percentage >= 80 && 'Excellent! Keep practicing to master this topic.'}
              {percentage >= 60 && percentage < 80 && 'Good effort! Review the incorrect questions.'}
              {percentage < 60 && 'Keep studying! Try again to improve your score.'}
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto border border-gray-700">
        <div className="sticky top-0 p-6 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Timed Quiz</h2>
            <p className="text-sm text-gray-400">
              Question {currentQuestionIdx + 1} of {questions.length}
            </p>
          </div>
          <div className={`flex items-center gap-2 text-2xl font-bold ${
            timeRemaining < 60 ? 'text-red-400' : 'text-blue-400'
          }`}>
            <Clock className="w-6 h-6" />
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          <p className="text-white font-medium mb-4">{currentQuestion.text}</p>

          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-2">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const selected = quizAnswers[currentQuestionIdx] || new Set();
                    const newSelected = new Set(selected);
                    if (newSelected.has(idx)) {
                      newSelected.delete(idx);
                    } else {
                      newSelected.add(idx);
                    }
                    handleAnswer(newSelected);
                  }}
                  className={`w-full text-left p-3 rounded border-2 transition-all ${
                    quizAnswers[currentQuestionIdx]?.has(idx)
                      ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                      : 'border-gray-600 bg-gray-700 bg-opacity-40 hover:border-gray-500'
                  }`}
                >
                  <span className="text-sm text-gray-100">{option}</span>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'fill-in-blank' && (
            <input
              type="text"
              value={quizAnswers[currentQuestionIdx] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full px-4 py-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          )}
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIdx === 0}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:opacity-50 text-white rounded font-medium transition-all"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-all"
          >
            {currentQuestionIdx === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Exercise Modal Component
const ExerciseModal = ({ questions, subtopicTitle, onClose }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState({});
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const handleAnswer = (answer) => {
    setExerciseAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setExerciseCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach((question, idx) => {
      const answer = exerciseAnswers[idx];
      if (!answer) return;

      if (question.type === 'multiple-choice') {
        const userAnswers = new Set(answer);
        const isCorrect = question.correctAnswers.size === userAnswers.size &&
          [...question.correctAnswers].every(c => userAnswers.has(c));
        if (isCorrect) correct++;
      } else if (question.type === 'fill-in-blank') {
        const isCorrect = question.correctAnswers.some(correct =>
          answer.toLowerCase().trim() === correct.toLowerCase().trim()
        );
        if (isCorrect) correct++;
      }
    });
    return { correct, total: questions.length };
  };

  if (exerciseCompleted) {
    const results = calculateResults();
    const percentage = Math.round((results.correct / results.total) * 100);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Exercise Complete!</h2>
            <p className="text-gray-400 mb-6">{subtopicTitle}</p>

            <div className="bg-gray-700 bg-opacity-40 p-6 rounded mb-6">
              <div className="text-5xl font-bold text-white mb-2">{percentage}%</div>
              <div className="text-lg text-gray-300">
                {results.correct} of {results.total} correct
              </div>
            </div>

            <div className={`p-4 rounded mb-6 ${
              percentage >= 80
                ? 'bg-green-600 bg-opacity-20 text-green-200'
                : percentage >= 60
                ? 'bg-yellow-600 bg-opacity-20 text-yellow-200'
                : 'bg-red-600 bg-opacity-20 text-red-200'
            }`}>
              {percentage >= 80 && 'Excellent! You have mastered this topic.'}
              {percentage >= 60 && percentage < 80 && 'Good work! Review the incorrect answers.'}
              {percentage < 60 && 'Keep practicing! Try the exercise again.'}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentQuestionIdx(0);
                  setExerciseAnswers({});
                  setExerciseCompleted(false);
                }}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-all"
              >
                Retry
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto border border-gray-700">
        <div className="sticky top-0 p-6 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Practice Exercise</h2>
            <p className="text-sm text-gray-400">
              Question {currentQuestionIdx + 1} of {questions.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          <p className="text-white font-medium mb-4">{currentQuestion.text}</p>

          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-2">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const selected = exerciseAnswers[currentQuestionIdx] || new Set();
                    const newSelected = new Set(selected);
                    if (newSelected.has(idx)) {
                      newSelected.delete(idx);
                    } else {
                      newSelected.add(idx);
                    }
                    handleAnswer(newSelected);
                  }}
                  className={`w-full text-left p-3 rounded border-2 transition-all ${
                    exerciseAnswers[currentQuestionIdx]?.has(idx)
                      ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                      : 'border-gray-600 bg-gray-700 bg-opacity-40 hover:border-gray-500'
                  }`}
                >
                  <span className="text-sm text-gray-100">{option}</span>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'fill-in-blank' && (
            <input
              type="text"
              value={exerciseAnswers[currentQuestionIdx] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full px-4 py-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          )}
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIdx === 0}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:opacity-50 text-white rounded font-medium transition-all"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-all"
          >
            {currentQuestionIdx === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Generate Questions Section Component
const GenerateQuestionsSection = ({ categoryKey, subtopic, initialQuestions, onExercise, onQuiz }) => {
  const [loading, setLoading] = React.useState(false);
  const [generatedQuestions, setGeneratedQuestions] = React.useState(initialQuestions);

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      // Generate 2 sample questions
      const types = ['multiple-choice', 'fill-in-blank'];
      const newQuestions = [...generatedQuestions];

      for (const type of types) {
        const response = await fetch('/api/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: categoryKey,
            subtopic: subtopic.title,
            questionType: type
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.question) {
            newQuestions.push({
              id: Date.now() + Math.random(),
              type: data.question.type,
              text: data.question.text,
              options: data.question.options,
              correctAnswers: data.question.type === 'multiple-choice' 
                ? new Set(data.question.correctAnswers)
                : data.question.correctAnswers,
              explanation: data.question.explanation
            });
          }
        }
      }

      setGeneratedQuestions(newQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 bg-opacity-50 border-t border-gray-600 space-y-4">
      {generatedQuestions.length > 0 ? (
        <>
          {/* Analytics */}
          <div className="bg-gray-700 bg-opacity-40 p-4 rounded">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Performance Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-gray-600 bg-opacity-50 p-3 rounded">
                <div className="text-gray-400 mb-1">Accuracy</div>
                <div className="text-lg font-bold text-white">—</div>
              </div>
              <div className="bg-gray-600 bg-opacity-50 p-3 rounded">
                <div className="text-gray-400 mb-1">Questions</div>
                <div className="text-lg font-bold text-white">{generatedQuestions.length}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onExercise(generatedQuestions)}
              className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-medium rounded transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Open Exercise
            </button>
            <button
              onClick={() => onQuiz(generatedQuestions)}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-medium rounded transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Timed Quiz
            </button>
          </div>

          {/* Generate More Button */}
          <button
            onClick={handleGenerateQuestions}
            disabled={loading}
            className="w-full p-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin">⚙️</div>
                Generating...
              </>
            ) : (
              <>
                ✨ Generate Questions with AI
              </>
            )}
          </button>
        </>
      ) : (
        <div className="p-4 text-center space-y-3">
          <p className="text-sm text-gray-400">No exercises available for this topic yet.</p>
          <button
            onClick={handleGenerateQuestions}
            disabled={loading}
            className="w-full p-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin">⚙️</div>
                Generating...
              </>
            ) : (
              <>
                ✨ Generate Questions with AI
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
export default function FECivilDashboard() {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubtopics, setExpandedSubtopics] = useState({});
  const [activeExercise, setActiveExercise] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [generatedQuestionsBySubtopic, setGeneratedQuestionsBySubtopic] = useState({});

  // Sample Questions
  const exerciseData = {
    'mathematics-A': [
      {
        id: 1,
        type: 'multiple-choice',
        text: 'Which of the following equations represent the same line? (Select all that apply)',
        options: [
          'y = 2x + 3',
          '2x - y + 3 = 0',
          '4x - 2y + 6 = 0',
          'y = x + 1.5'
        ],
        correctAnswers: new Set([0, 1, 2])
      },
      {
        id: 2,
        type: 'fill-in-blank',
        text: 'The distance between points (3, 4) and (6, 8) is _____ units.',
        correctAnswers: ['5', '5.0']
      }
    ],
    'statics-A': [
      {
        id: 1,
        type: 'multiple-choice',
        text: 'A force of 100 N is applied at 30° to the horizontal. What are the vertical and horizontal components? (Select the correct pair)',
        options: [
          'Horizontal: 50 N, Vertical: 86.6 N',
          'Horizontal: 86.6 N, Vertical: 50 N',
          'Horizontal: 70.7 N, Vertical: 70.7 N',
          'Horizontal: 100 N, Vertical: 0 N'
        ],
        correctAnswers: new Set([1])
      },
      {
        id: 2,
        type: 'fill-in-blank',
        text: 'A 5 kN force is applied at 45°. The horizontal component is _____ kN.',
        correctAnswers: ['3.54', '3.5', '3.536']
      }
    ]
  };

  const categories = {
    mathematics: {
      icon: Calculator,
      title: 'Mathematics & Statistics',
      color: 'from-blue-500 to-cyan-500',
      numQuestions: '8–12',
      subtopics: [
        { id: 'A', title: 'Analytic Geometry', exercises: 2, accuracy: null },
        { id: 'B', title: 'Single-Variable Calculus', exercises: 0, accuracy: null },
        { id: 'C', title: 'Vector Operations', exercises: 0, accuracy: null },
        { id: 'D', title: 'Statistics', exercises: 0, accuracy: null }
      ]
    },
    ethics: {
      icon: BookOpen,
      title: 'Ethics & Professional Practice',
      color: 'from-violet-500 to-purple-500',
      numQuestions: '4–6',
      subtopics: [
        { id: 'A', title: 'Codes of Ethics', exercises: 0, accuracy: null },
        { id: 'B', title: 'Professional Liability', exercises: 0, accuracy: null },
        { id: 'C', title: 'Licensure', exercises: 0, accuracy: null },
        { id: 'D', title: 'Contracts and Contract Law', exercises: 0, accuracy: null }
      ]
    },
    economics: {
      icon: Zap,
      title: 'Engineering Economics',
      color: 'from-yellow-500 to-orange-500',
      numQuestions: '5–8',
      subtopics: [
        { id: 'A', title: 'Time Value of Money', exercises: 0, accuracy: null },
        { id: 'B', title: 'Cost Analysis', exercises: 0, accuracy: null },
        { id: 'C', title: 'Break-even & Life Cycle Analysis', exercises: 0, accuracy: null },
        { id: 'D', title: 'Uncertainty & Risk', exercises: 0, accuracy: null }
      ]
    },
    statics: {
      icon: Hammer,
      title: 'Statics',
      color: 'from-purple-500 to-pink-500',
      numQuestions: '8–12',
      subtopics: [
        { id: 'A', title: 'Resultants of Force Systems', exercises: 2, accuracy: null },
        { id: 'B', title: 'Equivalent Force Systems', exercises: 0, accuracy: null },
        { id: 'C', title: 'Equilibrium of Rigid Bodies', exercises: 0, accuracy: null },
        { id: 'D', title: 'Frames and Trusses', exercises: 0, accuracy: null },
        { id: 'E', title: 'Centroid of Area', exercises: 0, accuracy: null },
        { id: 'F', title: 'Area Moments of Inertia', exercises: 0, accuracy: null },
        { id: 'G', title: 'Static Friction', exercises: 0, accuracy: null }
      ]
    },
    dynamics: {
      icon: Zap,
      title: 'Dynamics',
      color: 'from-orange-500 to-yellow-500',
      numQuestions: '4–6',
      subtopics: [
        { id: 'A', title: 'Kinematics', exercises: 0, accuracy: null },
        { id: 'B', title: 'Mass Moments of Inertia', exercises: 0, accuracy: null },
        { id: 'C', title: 'Force Acceleration', exercises: 0, accuracy: null },
        { id: 'D', title: 'Work, Energy, and Power', exercises: 0, accuracy: null }
      ]
    },
    materials: {
      icon: Building2,
      title: 'Mechanics of Materials',
      color: 'from-red-500 to-pink-500',
      numQuestions: '7–11',
      subtopics: [
        { id: 'A', title: 'Shear and Moment Diagrams', exercises: 0, accuracy: null },
        { id: 'B', title: 'Stresses and Strains', exercises: 0, accuracy: null },
        { id: 'C', title: 'Deformations', exercises: 0, accuracy: null },
        { id: 'D', title: 'Combined Stresses & Mohr\'s Circle', exercises: 0, accuracy: null }
      ]
    },
    materialsprop: {
      icon: BookOpen,
      title: 'Materials',
      color: 'from-indigo-600 to-purple-500',
      numQuestions: '5–8',
      subtopics: [
        { id: 'A', title: 'Mix Design of Concrete and Asphalt', exercises: 0, accuracy: null },
        { id: 'B', title: 'Test Methods and Specifications', exercises: 0, accuracy: null },
        { id: 'C', title: 'Physical and Mechanical Properties', exercises: 0, accuracy: null }
      ]
    },
    fluid: {
      icon: Droplet,
      title: 'Fluid Mechanics',
      color: 'from-cyan-500 to-blue-500',
      numQuestions: '6–9',
      subtopics: [
        { id: 'A', title: 'Flow Measurement', exercises: 0, accuracy: null },
        { id: 'B', title: 'Fluid Properties', exercises: 0, accuracy: null },
        { id: 'C', title: 'Fluid Statics', exercises: 0, accuracy: null },
        { id: 'D', title: 'Energy, Impulse, and Momentum', exercises: 0, accuracy: null }
      ]
    },
    surveying: {
      icon: Compass,
      title: 'Surveying',
      color: 'from-green-600 to-teal-500',
      numQuestions: '6–9',
      subtopics: [
        { id: 'A', title: 'Angles, Distances, and Trigonometry', exercises: 0, accuracy: null },
        { id: 'B', title: 'Area Computations', exercises: 0, accuracy: null },
        { id: 'C', title: 'Earthwork and Volume Computations', exercises: 0, accuracy: null },
        { id: 'D', title: 'Coordinate Systems', exercises: 0, accuracy: null },
        { id: 'E', title: 'Leveling', exercises: 0, accuracy: null }
      ]
    },
    water: {
      icon: Droplet,
      title: 'Water Resources & Environmental',
      color: 'from-sky-500 to-blue-600',
      numQuestions: '10–15',
      subtopics: [
        { id: 'A', title: 'Basic Hydrology', exercises: 0, accuracy: null },
        { id: 'B', title: 'Basic Hydraulics', exercises: 0, accuracy: null },
        { id: 'C', title: 'Pumps', exercises: 0, accuracy: null },
        { id: 'D', title: 'Water Distribution Systems', exercises: 0, accuracy: null },
        { id: 'E', title: 'Flood Control', exercises: 0, accuracy: null },
        { id: 'F', title: 'Stormwater', exercises: 0, accuracy: null },
        { id: 'G', title: 'Collection Systems', exercises: 0, accuracy: null },
        { id: 'H', title: 'Groundwater', exercises: 0, accuracy: null },
        { id: 'I', title: 'Water Quality', exercises: 0, accuracy: null },
        { id: 'J', title: 'Testing and Standards', exercises: 0, accuracy: null },
        { id: 'K', title: 'Water and Wastewater Treatment', exercises: 0, accuracy: null }
      ]
    },
    structural: {
      icon: Building2,
      title: 'Structural Engineering',
      color: 'from-indigo-500 to-blue-500',
      numQuestions: '10–15',
      subtopics: [
        { id: 'A', title: 'Analysis of Statically Determinant Structures', exercises: 0, accuracy: null },
        { id: 'B', title: 'Deflection Methods', exercises: 0, accuracy: null },
        { id: 'C', title: 'Column Analysis', exercises: 0, accuracy: null },
        { id: 'D', title: 'Structural Determinacy', exercises: 0, accuracy: null },
        { id: 'E', title: 'Indeterminate Structures', exercises: 0, accuracy: null },
        { id: 'F', title: 'Loads and Load Paths', exercises: 0, accuracy: null },
        { id: 'G', title: 'Design of Steel Components', exercises: 0, accuracy: null },
        { id: 'H', title: 'Design of Reinforced Concrete', exercises: 0, accuracy: null }
      ]
    },
    geotechnical: {
      icon: Mountain,
      title: 'Geotechnical Engineering',
      color: 'from-amber-600 to-orange-500',
      numQuestions: '10–15',
      subtopics: [
        { id: 'A', title: 'Index Properties and Soil Classifications', exercises: 0, accuracy: null },
        { id: 'B', title: 'Phase Relations', exercises: 0, accuracy: null },
        { id: 'C', title: 'Laboratory and Field Tests', exercises: 0, accuracy: null },
        { id: 'D', title: 'Effective Stress', exercises: 0, accuracy: null },
        { id: 'E', title: 'Stability of Retaining Structures', exercises: 0, accuracy: null },
        { id: 'F', title: 'Shear Strength', exercises: 0, accuracy: null },
        { id: 'G', title: 'Bearing Capacity', exercises: 0, accuracy: null },
        { id: 'H', title: 'Foundation Types', exercises: 0, accuracy: null },
        { id: 'I', title: 'Consolidation and Settlement', exercises: 0, accuracy: null },
        { id: 'J', title: 'Slope Stability', exercises: 0, accuracy: null },
        { id: 'K', title: 'Soil Stabilization', exercises: 0, accuracy: null }
      ]
    },
    transportation: {
      icon: Truck,
      title: 'Transportation Engineering',
      color: 'from-green-500 to-emerald-500',
      numQuestions: '9–14',
      subtopics: [
        { id: 'A', title: 'Geometric Design', exercises: 0, accuracy: null },
        { id: 'B', title: 'Pavement System Design', exercises: 0, accuracy: null },
        { id: 'C', title: 'Traffic Capacity and Flow', exercises: 0, accuracy: null },
        { id: 'D', title: 'Traffic Control Devices', exercises: 0, accuracy: null },
        { id: 'E', title: 'Transportation Planning', exercises: 0, accuracy: null }
      ]
    },
    construction: {
      icon: Hammer,
      title: 'Construction Engineering',
      color: 'from-orange-500 to-red-500',
      numQuestions: '8–12',
      subtopics: [
        { id: 'A', title: 'Project Administration', exercises: 0, accuracy: null },
        { id: 'B', title: 'Construction Operations', exercises: 0, accuracy: null },
        { id: 'C', title: 'Project Controls', exercises: 0, accuracy: null },
        { id: 'D', title: 'Construction Estimating', exercises: 0, accuracy: null },
        { id: 'E', title: 'Interpretation of Engineering Drawings', exercises: 0, accuracy: null }
      ]
    }
  };

  const toggleCategory = (key) => {
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSubtopic = (key, subtopicId) => {
    const expandKey = `${key}-${subtopicId}`;
    setExpandedSubtopics(prev => ({
      ...prev,
      [expandKey]: !prev[expandKey]
    }));
  };

  const getQuestionsForSubtopic = (categoryKey, subtopicId) => {
    const key = `${categoryKey}-${subtopicId}`;
    return exerciseData[key] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">FE Civil Exam Dashboard</h1>
          <p className="text-xl text-gray-400">AI-Generated Study Questions with Advanced Analytics</p>
          <p className="text-sm text-gray-500 mt-2">6 hours | 110 Questions | Multiple Question Formats</p>
        </div>

        {/* Categories */}
        <div className="space-y-4 mb-8">
          {Object.entries(categories).map(([key, category]) => {
            const Icon = category.icon;
            const isExpanded = expandedCategories[key];

            return (
              <div
                key={key}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(key)}
                  className={`w-full p-6 flex items-center justify-between bg-gradient-to-r ${category.color} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Icon className="w-6 h-6 text-white flex-shrink-0" />
                    <div className="text-left">
                      <h2 className="text-lg font-semibold text-white">{category.title}</h2>
                      <p className="text-xs text-gray-400">{category.numQuestions} Questions</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-white transition-transform duration-300 flex-shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Subtopics */}
                {isExpanded && (
                  <div className="p-6 space-y-2 bg-gray-700 bg-opacity-20">
                    {category.subtopics.map((subtopic) => {
                      const subtopicKey = `${key}-${subtopic.id}`;
                      const isSubtopicExpanded = expandedSubtopics[subtopicKey];
                      const questions = getQuestionsForSubtopic(key, subtopic.id);

                      return (
                        <div key={subtopic.id} className="border border-gray-600 rounded-lg overflow-hidden hover:border-gray-500 transition-all">
                          {/* Subtopic Header */}
                          <button
                            onClick={() => toggleSubtopic(key, subtopic.id)}
                            className="w-full p-4 flex items-center justify-between bg-gray-700 bg-opacity-40 hover:bg-opacity-60 transition-all"
                          >
                            <div className="flex items-center gap-3 text-left flex-1">
                              <span className="text-sm font-bold text-gray-300 bg-gray-600 bg-opacity-50 px-2.5 py-1 rounded min-w-fit">
                                {subtopic.id}
                              </span>
                              <span className="text-sm text-gray-100">{subtopic.title}</span>
                              {subtopic.exercises > 0 && (
                                <span className="text-xs bg-blue-600 text-blue-100 px-2 py-0.5 rounded">
                                  {subtopic.exercises} exercises
                                </span>
                              )}
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                                isSubtopicExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Subtopic Content */}
                          {isSubtopicExpanded && (
                            <GenerateQuestionsSection 
                              categoryKey={key}
                              subtopic={subtopic}
                              initialQuestions={questions}
                              onExercise={(qs) => setActiveExercise({ questions: qs, subtopicTitle: subtopic.title })}
                              onQuiz={(qs) => setActiveQuiz({ questions: qs, subtopicTitle: subtopic.title })}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Exercise Modal */}
        {activeExercise && (
          <ExerciseModal
            questions={activeExercise.questions}
            subtopicTitle={activeExercise.subtopicTitle}
            onClose={() => setActiveExercise(null)}
          />
        )}

        {/* Timed Quiz Modal */}
        {activeQuiz && (
          <TimedQuizModal
            questions={activeQuiz.questions}
            subtopicTitle={activeQuiz.subtopicTitle}
            onClose={() => setActiveQuiz(null)}
            onComplete={(results) => {
              setActiveQuiz(null);
            }}
          />
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Fundamentals of Engineering (FE) Civil CBT Exam Specifications - NCEES</p>
          <p className="text-xs text-gray-600 mt-2">AI-Generated Questions | Powered by Anthropic Claude</p>
        </div>
      </div>
    </div>
  );
}