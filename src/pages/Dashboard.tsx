import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { CreateNoteModal } from "../components/CreateNoteModal";
import type { Note } from "../types";
import { notesApi } from "../utils/api";
import logo from "../assets/top.svg";

export function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const notes = await notesApi.getNotes();
      setNotes(notes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchNotes = async () => {
    setIsLoading(true);
    await fetchNotes();
  };

  const handleCreateNote = async (content: string) => {
    const newNote = await notesApi.createNote(content);
    setNotes((prev) => [...prev, newNote]);
    refetchNotes();
  };

  const handleUpdateNote = async (content: string) => {
    if (!selectedNote) return;
    const updatedNote = await notesApi.updateNote(selectedNote._id, content);
    setNotes((prev) =>
      prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
    setSelectedNote(null);
    refetchNotes();
  };

  const handleDeleteNote = async (id: string) => {
    await notesApi.deleteNote(id);
    setNotes((prev) => prev.filter((note) => note._id !== id));
    refetchNotes();
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-12 w-12" />
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
          <p className="text-gray-600 mb-4">Start creating your notes below.</p>
          <Button onClick={() => setIsModalOpen(true)}>Create Note</Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : notes.length === 0 ? (
            <div className="text-center text-gray-500">
              No notes yet. Create your first one!
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow p-4 flex items-start justify-between"
              >
                <div className="flex-1">
                  <p className="text-gray-900">{note.content}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedNote(note);
                      setIsModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSubmit={selectedNote ? handleUpdateNote : handleCreateNote}
        initialContent={selectedNote?.content}
      />
    </div>
  );
}
