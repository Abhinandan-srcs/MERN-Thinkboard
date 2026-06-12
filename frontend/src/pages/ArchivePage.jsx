import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, ArchiveRestoreIcon } from "lucide-react";
import { useApiWithAuth } from "../lib/axios";
import toast from "react-hot-toast";
import { formatDate } from "../lib/utils";

const ArchivePage = () => {
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApiWithAuth();

  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const res = await api.get("/notes/archived");
        setArchivedNotes(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        toast.error("Failed to load archived notes");
      } finally {
        setLoading(false);
      }
    };
    fetchArchived();
  }, []);

  const handleUnarchive = async (id) => {
    try {
      await api.patch(`/notes/${id}/archive`);
      setArchivedNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note restored");
    } catch (error) {
      toast.error("Failed to restore note");
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/" className="btn btn-ghost btn-sm">
              <ArrowLeftIcon className="size-4" />
              Back
            </Link>
            <h1 className="text-2xl font-bold font-mono text-primary">Archive</h1>
            <span className="badge badge-ghost">{archivedNotes.length}</span>
          </div>

          {loading && (
            <div className="text-center text-primary py-10">Loading...</div>
          )}

          {!loading && archivedNotes.length === 0 && (
            <div className="text-center py-20 text-base-content/40">
              <p className="text-lg">No archived notes</p>
              <p className="text-sm mt-1">Notes you archive will appear here</p>
            </div>
          )}

          {archivedNotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {archivedNotes.map((note) => (
                <div
                  key={note._id}
                  className="card bg-base-100 border-t-4 border-solid h-44 overflow-hidden relative opacity-80 hover:opacity-100 transition-opacity"
                  style={{ borderColor: note.color || "#00FF9D" }}
                >
                  <div className="card-body flex flex-col justify-between py-4">
                    <div>
                      <h3 className="font-semibold text-base-content truncate">{note.title}</h3>
                      <p className="text-base-content/60 text-sm line-clamp-2 mt-1">{note.content}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-base-content/40">{formatDate(new Date(note.createdAt))}</span>
                      <button
                        onClick={() => handleUnarchive(note._id)}
                        className="btn btn-ghost btn-xs text-primary gap-1"
                        title="Restore note"
                      >
                        <ArchiveRestoreIcon className="size-3.5" />
                        Restore
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;
