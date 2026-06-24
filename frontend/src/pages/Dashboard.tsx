import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllTopics } from "../services/topicService";
import type { Topic } from "../services/topicService";
import { getAllVocabulary } from "../services/vocabularyService";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [vocabCount, setVocabCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <h2 className="section-title">Topics</h2>
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
    </div>
  );
};

export default Dashboard;
