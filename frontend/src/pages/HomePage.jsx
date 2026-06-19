import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RateLimitedUI from "../components/RateLimitedUI";
import { useApiWithAuth } from "../lib/axios"; //custom Hook
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import { NotebookIcon, PinIcon, ArchiveIcon, Trash2Icon, TagIcon } from "lucide-react";

const VIEW_META = {
  all:     { icon: NotebookIcon, label: "All Notes" },
  pinned:  { icon: PinIcon,      label: "Pinned" },
  archive: { icon: ArchiveIcon,  label: "Archive" },
  trash:   { icon: Trash2Icon,   label: "Trash" },
};

const HomePage = ({ theme, toggleTheme }) => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("all");

  const [labels, setLabels] = useState(() => {
    try { return JSON.parse(localStorage.getItem("thinkboard_labels") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("thinkboard_labels", JSON.stringify(labels));
  }, [labels]);

  const apiWithAuth = useApiWithAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await apiWithAuth.get("/notes"); 
        setNotes(Array.isArray(res.data) ? res.data : []); //safety check
      } catch (error) {
        if (error.response?.status === 429) setIsRateLimited(true);
        else toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  //  Archive toggle ───────────────────────────────────────────────────────────
  const handleArchive = async (noteId) => {
    try {
      const res = await apiWithAuth.patch(`/notes/${noteId}/archive`);
      setNotes((prev) => prev.map((n) => (n._id === noteId ? res.data : n)));
      toast.success(res.data.isArchived ? "Note archived" : "Note unarchived");
    } catch {
      toast.error("Failed to archive note");
    }
  };

  //  Trash toggle ─────────────────────────────────────────────────────────────
  const handleTrash = async (noteId) => {
    try {
      const res = await apiWithAuth.patch(`/notes/${noteId}/trash`);
      setNotes((prev) => prev.map((n) => (n._id === noteId ? res.data : n)));
      toast.success(res.data.isTrashed ? "Moved to trash" : "Restored");
    } catch {
      // optimistic fallback - even if backend fails user sees UI
      setNotes((prev) =>
        prev.map((n) => (n._id === noteId ? { ...n, isTrashed: !n.isTrashed } : n)) //loop through privious notes and update the updated note
      );
    }
  };

  //  Filter notes for the active view ────────────────────────────────────────
  const getVisibleNotes = () => {
    let base;
    if (activeView === "all")
      base = notes.filter((n) => !n.isArchived && !n.isTrashed);
    else if (activeView === "pinned")
      base = notes.filter((n) => n.isPinned && !n.isArchived && !n.isTrashed);
    else if (activeView === "archive")
      base = notes.filter((n) => n.isArchived && !n.isTrashed);
    else if (activeView === "trash")
      base = notes.filter((n) => n.isTrashed);
    else if (activeView.startsWith("label:")) {
      const name = activeView.slice(6);
      base = notes.filter((n) => !n.isArchived && !n.isTrashed && (n.labels || []).includes(name));
    } else {
      base = notes.filter((n) => !n.isArchived && !n.isTrashed);
    }

    return base
      .filter((n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.isPinned - a.isPinned);
  };

  const visibleNotes = getVisibleNotes();
 
  const meta = activeView.startsWith("label:") //This sayys show only the notes which i have clicked from all (like pinned/archive/trash)
    ? { icon: TagIcon, label: activeView.slice(6) }
    : VIEW_META[activeView] || VIEW_META.all;

  const Icon = meta.icon;

  return (
    <div className="min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
        onMenuClick={() => setSidebarOpen(true)}
        setActiveView={setActiveView}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        notes={notes}
        labels={labels}
        setLabels={setLabels}
        setNotes={setNotes}
      />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {/* View header */}
        <div className="flex items-center gap-2 mb-6 text-base-content/60">
          <Icon className="size-5" />
          <h2 className="text-lg font-semibold text-base-content">{meta.label}</h2>
          <span className="text-sm text-base-content/40">({visibleNotes.length})</span>
        </div>

        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {visibleNotes.length === 0 && !loading && !isRateLimited && <NotesNotFound />}

        {visibleNotes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                setNotes={setNotes}
                theme={theme}
                onArchive={handleArchive}
                onTrash={handleTrash}
                availableLabels={labels}
                activeView={activeView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
