import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllTopics } from "../services/topicService";
import type { Topic } from "../services/topicService";
import { getQuizByTopic, submitQuiz } from "../services/quizService";
import type { QuizQuestion } from "../services/quizService";

type Phase = "select" | "quiz" | "result";

const QuizPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── Topic selection ───────────────────────────────────────────────────────
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState<string | null>(null);

  // ── Quiz state ────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("select");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // ── Result state ──────────────────────────────────────────────────────────
  const [score, setScore] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const list = await getAllTopics();
        setTopics(list);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Failed to load topics.";
        setTopicsError(msg);
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const startQuiz = async () => {
    if (!selectedTopicId) return;
    setQuizLoading(true);
    setQuizError(null);
    try {
      const qs = await getQuizByTopic(selectedTopicId);
      setQuestions(qs);
      setAnswers({});
      setPhase("quiz");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to load quiz questions.";
      setQuizError(msg);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!selectedTopicId) return;
    setQuizLoading(true);
    setQuizError(null);
    try {
      const payload = {
        topicId: selectedTopicId,
        answers: Object.entries(answers).map(([qId, answer]) => ({
          questionId: Number(qId),
          answer,
        })),
      };
      const result = await submitQuiz(payload);
      setScore(result.score);
      setTotal(result.total);
      setPhase("result");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to submit quiz.";
      setQuizError(msg);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const resetQuiz = () => {
    setPhase("select");
    setSelectedTopicId(null);
    setQuestions([]);
    setAnswers({});
    setScore(0);
    setTotal(0);
  };

  const answeredCount = Object.keys(answers).length;
  const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">📚</span>
          <span className="sidebar-brand-text">EnglishEveryday</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item" id="nav-dashboard">
            <span className="nav-icon">🏠</span> Dashboard
          </Link>
          <Link to="/vocabulary" className="nav-item" id="nav-vocabulary">
            <span className="nav-icon">📖</span> Vocabulary
          </Link>
          <Link to="/quiz" className="nav-item nav-item--active" id="nav-quiz">
            <span className="nav-icon">🧩</span> Quiz
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.fullName}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="btn btn-ghost btn-full"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Quiz</h1>
            <p className="page-subtitle">Test your vocabulary knowledge</p>
          </div>
        </header>

        {/* ── Phase: Select topic ────────────────────────────────────── */}
        {phase === "select" && (
          <div className="quiz-select-pane">
            <h2 className="section-title">Choose a Topic</h2>

            {topicsError && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {topicsError}
              </div>
            )}
            {quizError && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {quizError}
              </div>
            )}

            {topicsLoading ? (
              <div className="skeleton-list">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : (
              <div className="topic-grid">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    id={`select-topic-${topic.id}`}
                    className={`topic-card topic-card--selectable ${
                      selectedTopicId === topic.id
                        ? "topic-card--selected"
                        : ""
                    }`}
                    onClick={() => setSelectedTopicId(topic.id)}
                  >
                    <h3 className="topic-name">{topic.topicName}</h3>
                    {topic.description && (
                      <p className="topic-desc">{topic.description}</p>
                    )}
                    {selectedTopicId === topic.id && (
                      <span className="topic-check">✓ Selected</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <button
              id="start-quiz-btn"
              className="btn btn-primary"
              onClick={startQuiz}
              disabled={!selectedTopicId || quizLoading}
            >
              {quizLoading ? (
                <>
                  <span className="btn-spinner" /> Loading…
                </>
              ) : (
                "Start Quiz →"
              )}
            </button>
          </div>
        )}

        {/* ── Phase: Quiz ───────────────────────────────────────────── */}
        {phase === "quiz" && (
          <div className="quiz-pane">
            <div className="quiz-progress-bar">
              <div
                className="quiz-progress-fill"
                style={{
                  width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="quiz-progress-text">
              {answeredCount} / {questions.length} answered
            </p>

            {quizError && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {quizError}
              </div>
            )}

            {questions.length === 0 ? (
              <div className="empty-state-box">
                <p className="empty-icon">📭</p>
                <p className="empty-text">
                  No questions available for this topic.
                </p>
                <button
                  id="quiz-back-btn"
                  className="btn btn-ghost"
                  onClick={resetQuiz}
                >
                  ← Back
                </button>
              </div>
            ) : (
              <>
                <div className="question-list">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="question-card"
                      id={`question-${q.id}`}
                    >
                      <p className="question-text">
                        <span className="question-num">Q{idx + 1}.</span>{" "}
                        {q.question}
                      </p>
                      <div className="option-list">
                        {q.options.map((opt) => (
                          <label
                            key={opt}
                            className={`option-label ${
                              answers[q.id] === opt ? "option-label--selected" : ""
                            }`}
                            id={`option-${q.id}-${opt}`}
                          >
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              value={opt}
                              checked={answers[q.id] === opt}
                              onChange={() => handleAnswer(q.id, opt)}
                              className="option-radio"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="quiz-footer">
                  <button
                    id="quiz-back-btn"
                    className="btn btn-ghost"
                    onClick={resetQuiz}
                  >
                    ← Back
                  </button>
                  <button
                    id="submit-quiz-btn"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={
                      answeredCount < questions.length || quizLoading
                    }
                  >
                    {quizLoading ? (
                      <>
                        <span className="btn-spinner" /> Submitting…
                      </>
                    ) : (
                      "Submit Quiz"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Phase: Result ─────────────────────────────────────────── */}
        {phase === "result" && (
          <div className="result-pane">
            <div className="result-card">
              <div
                className={`result-circle ${
                  scorePercent >= 70 ? "result-circle--pass" : "result-circle--fail"
                }`}
              >
                <span className="result-percent">{scorePercent}%</span>
                <span className="result-fraction">
                  {score}/{total}
                </span>
              </div>

              <h2 className="result-title">
                {scorePercent >= 70 ? "🎉 Great Job!" : "💪 Keep Practicing!"}
              </h2>
              <p className="result-subtitle">
                You scored <strong>{score}</strong> out of{" "}
                <strong>{total}</strong> questions correctly.
              </p>

              <div className="result-actions">
                <button
                  id="retry-quiz-btn"
                  className="btn btn-outline"
                  onClick={resetQuiz}
                >
                  Try Again
                </button>
                <Link
                  to="/vocabulary"
                  className="btn btn-primary"
                  id="result-study-btn"
                >
                  Study More Words
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
