import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllTopics, createTopic } from "../services/topicService";
import type { Topic } from "../services/topicService";
import { getAllVocabulary } from "../services/vocabularyService";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [vocabCount, setVocabCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSavingTopic, setIsSavingTopic] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [topicList, vocabList] = await Promise.all([
          getAllTopics(),
          getAllVocabulary(),
        ]);
        setTopics(topicList);
        setVocabCount(vocabList.length);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Failed to load dashboard data.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!newTopicName.trim()) {
      setModalError("Topic name is required.");
      return;
    }

    setIsSavingTopic(true);
    try {
      const created = await createTopic({
        topicName: newTopicName.trim(),
        description: newDescription.trim() || undefined,
      });
      setTopics((prev) => [...prev, created]);
      
      // Reset form
      setNewTopicName("");
      setNewDescription("");
      setIsCreateModalOpen(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to create topic.";
      setModalError(msg);
    } finally {
      setIsSavingTopic(false);
    }
  };

  return (
    <div className="app-layout">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">📚</span>
          <span className="sidebar-brand-text">EnglishEveryday</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item nav-item--active" id="nav-dashboard">
            <span className="nav-icon">🏠</span> Dashboard
          </Link>
          <Link to="/vocabulary" className="nav-item" id="nav-vocabulary">
            <span className="nav-icon">📖</span> Vocabulary
          </Link>
          <Link to="/quiz" className="nav-item" id="nav-quiz">
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

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Welcome back, {user?.fullName?.split(" ")[0]} 👋</h1>
            <p className="page-subtitle">Here's your learning overview</p>
          </div>
        </header>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Stats cards */}
        <div className="stats-grid">
          <div className="stat-card" id="stat-vocab">
            <div className="stat-icon">📝</div>
            <div className="stat-body">
              <p className="stat-label">Total Vocabulary</p>
              <p className="stat-value">
                {isLoading ? "—" : vocabCount}
              </p>
            </div>
          </div>

          <div className="stat-card" id="stat-topics">
            <div className="stat-icon">🗂️</div>
            <div className="stat-body">
              <p className="stat-label">Topics</p>
              <p className="stat-value">
                {isLoading ? "—" : topics.length}
              </p>
            </div>
          </div>

          <div className="stat-card" id="stat-role">
            <div className="stat-icon">🎓</div>
            <div className="stat-body">
              <p className="stat-label">Your Role</p>
              <p className="stat-value">{user?.role ?? "—"}</p>
            </div>
          </div>
        </div>

        {/* Topics list */}
        <section className="section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="section-title">Topics</h2>
            {(user?.role === "admin" || user?.role === "teacher") && (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setIsCreateModalOpen(true)}
                id="create-topic-btn"
              >
                + Create Topic
              </button>
            )}
          </div>
          {isLoading ? (
            <div className="skeleton-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : topics.length === 0 ? (
            <p className="empty-state">No topics found.</p>
          ) : (
            <div className="topic-grid">
              {topics.map((topic) => (
                <div key={topic.id} className="topic-card" id={`topic-${topic.id}`}>
                  <h3 className="topic-name">{topic.topicName}</h3>
                  {topic.description && (
                    <p className="topic-desc">{topic.description}</p>
                  )}
                  <Link
                    to={`/vocabulary?topicId=${topic.id}`}
                    className="btn btn-sm btn-outline"
                    id={`topic-view-${topic.id}`}
                  >
                    View Words →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-grid">
            <Link to="/vocabulary" className="action-card" id="action-vocab">
              <span className="action-icon">📖</span>
              <span>Browse Vocabulary</span>
            </Link>
            <Link to="/quiz" className="action-card" id="action-quiz">
              <span className="action-icon">🧩</span>
              <span>Take a Quiz</span>
            </Link>
          </div>
        </section>
      </main>

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Create New Topic</h3>
              <button
                className="modal-close"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSavingTopic}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateTopic} className="modal-form">
              {modalError && <div className="alert alert-error">{modalError}</div>}
              <div className="form-group">
                <label className="form-label">
                  Topic Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="e.g. Travel, Business, Food"
                  required
                  disabled={isSavingTopic}
                  id="new-topic-name-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Short description of this topic"
                  disabled={isSavingTopic}
                  id="new-topic-desc-input"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSavingTopic}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSavingTopic}
                  id="submit-create-topic-btn"
                >
                  {isSavingTopic ? <span className="btn-spinner" /> : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
