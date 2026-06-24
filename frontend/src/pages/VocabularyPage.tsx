import { useEffect, useState, useCallback } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllVocabulary,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
} from "../services/vocabularyService";
import type { Vocabulary, VocabularyPayload } from "../services/vocabularyService";
import { getAllTopics } from "../services/topicService";
import type { Topic } from "../services/topicService";

const EMPTY_FORM: VocabularyPayload = {
  word: "",
  meaning: "",
  exampleSentence: "",
  pronunciation: "",
  topicId: undefined,
};

const VocabularyPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Modal state ───────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<VocabularyPayload>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ── Delete confirmation ───────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const canEdit = user?.role === "teacher" || user?.role === "admin";

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [vocabList, topicList] = await Promise.all([
        getAllVocabulary(),
        getAllTopics(),
      ]);
      setVocabulary(vocabList);
      setTopics(topicList);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to load vocabulary.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Filter by search ──────────────────────────────────────────────────────
  const filtered = vocabulary.filter(
    (v) =>
      v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (vocab: Vocabulary) => {
    setEditingId(vocab.id);
    setFormData({
      word: vocab.word,
      meaning: vocab.meaning,
      exampleSentence: vocab.exampleSentence ?? "",
      pronunciation: vocab.pronunciation ?? "",
      topicId: vocab.topicId,
    });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "topicId" ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.word.trim() || !formData.meaning.trim()) {
      setFormError("Word and Meaning are required.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId !== null) {
        await updateVocabulary(editingId, formData);
      } else {
        await createVocabulary(formData);
      }
      closeModal();
      await fetchData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to save vocabulary.";
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVocabulary(id);
      setDeletingId(null);
      await fetchData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to delete vocabulary.";
      setError(msg);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const topicName = (topicId?: number) =>
    topics.find((t) => t.id === topicId)?.topicName ?? "—";

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
          <Link to="/vocabulary" className="nav-item nav-item--active" id="nav-vocabulary">
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

      {/* Main */}
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Vocabulary</h1>
            <p className="page-subtitle">
              {vocabulary.length} word{vocabulary.length !== 1 ? "s" : ""} in
              your library
            </p>
          </div>
          {canEdit && (
            <button
              id="add-vocab-btn"
              onClick={openAddModal}
              className="btn btn-primary"
            >
              + Add Word
            </button>
          )}
        </header>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
            <button
              className="alert-close"
              onClick={() => setError(null)}
              id="dismiss-error-btn"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search bar */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="vocab-search"
            type="text"
            className="search-input"
            placeholder="Search words or meanings…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              className="search-clear"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Vocabulary cards */}
        {isLoading ? (
          <div className="skeleton-list">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card vocab-skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-box">
            <p className="empty-icon">📭</p>
            <p className="empty-text">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No vocabulary yet. Add your first word!"}
            </p>
          </div>
        ) : (
          <div className="vocab-grid">
            {filtered.map((vocab) => (
              <div
                key={vocab.id}
                className="vocab-card"
                id={`vocab-card-${vocab.id}`}
              >
                <div className="vocab-card-header">
                  <span className="vocab-word">{vocab.word}</span>
                  {vocab.pronunciation && (
                    <span className="vocab-pronunciation">
                      /{vocab.pronunciation}/
                    </span>
                  )}
                </div>

                <p className="vocab-meaning">{vocab.meaning}</p>

                {vocab.exampleSentence && (
                  <p className="vocab-example">
                    <em>"{vocab.exampleSentence}"</em>
                  </p>
                )}

                <div className="vocab-card-footer">
                  <span className="vocab-topic-badge">
                    🗂️ {topicName(vocab.topicId)}
                  </span>
                  {canEdit && (
                    <div className="vocab-actions">
                      <button
                        id={`edit-vocab-${vocab.id}`}
                        className="btn btn-sm btn-outline"
                        onClick={() => openEditModal(vocab)}
                      >
                        Edit
                      </button>
                      <button
                        id={`delete-vocab-${vocab.id}`}
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeletingId(vocab.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="modal-box">
            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">
                {editingId !== null ? "Edit Vocabulary" : "Add New Word"}
              </h2>
              <button
                id="close-modal-btn"
                className="modal-close"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-form" noValidate>
              {formError && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
                  {formError}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-word" className="form-label">
                    Word <span className="required">*</span>
                  </label>
                  <input
                    id="modal-word"
                    name="word"
                    type="text"
                    className="form-input"
                    placeholder="e.g. apple"
                    value={formData.word}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-pronunciation" className="form-label">
                    Pronunciation
                  </label>
                  <input
                    id="modal-pronunciation"
                    name="pronunciation"
                    type="text"
                    className="form-input"
                    placeholder="e.g. ˈæpəl"
                    value={formData.pronunciation}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="modal-meaning" className="form-label">
                  Meaning <span className="required">*</span>
                </label>
                <input
                  id="modal-meaning"
                  name="meaning"
                  type="text"
                  className="form-input"
                  placeholder="e.g. quả táo"
                  value={formData.meaning}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-example" className="form-label">
                  Example sentence
                </label>
                <textarea
                  id="modal-example"
                  name="exampleSentence"
                  className="form-input form-textarea"
                  placeholder="e.g. I eat an apple every day."
                  value={formData.exampleSentence}
                  onChange={handleFormChange}
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-topic" className="form-label">
                  Topic
                </label>
                <select
                  id="modal-topic"
                  name="topicId"
                  className="form-input form-select"
                  value={formData.topicId ?? ""}
                  onChange={handleFormChange}
                >
                  <option value="">— No topic —</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.topicName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button
                  id="modal-cancel-btn"
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  id="modal-save-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="btn-spinner" /> Saving…
                    </>
                  ) : editingId !== null ? (
                    "Save Changes"
                  ) : (
                    "Add Word"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {deletingId !== null && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="modal-box modal-box--sm">
            <div className="modal-header">
              <h2 id="confirm-title" className="modal-title">
                Delete Word
              </h2>
            </div>
            <p className="modal-body-text">
              Are you sure you want to delete this word? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button
                id="confirm-cancel-btn"
                className="btn btn-ghost"
                onClick={() => setDeletingId(null)}
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                className="btn btn-danger"
                onClick={() => deletingId && handleDelete(deletingId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyPage;
