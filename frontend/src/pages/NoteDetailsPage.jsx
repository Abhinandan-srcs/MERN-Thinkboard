import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApiWithAuth } from "../lib/axios"; // ✅ already imported
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const COLORS = [
  { label: "Green",  border: "#00FF9D", bg: "rgba(0,255,157,0.07)" },
  { label: "Blue",   border: "#60a5fa", bg: "rgba(96,165,250,0.07)" },
  { label: "Purple", border: "#c084fc", bg: "rgba(192,132,252,0.07)" },
  { label: "Pink",   border: "#f472b6", bg: "rgba(244,114,182,0.07)" },
  { label: "Amber",  border: "#fbbf24", bg: "rgba(251,191,36,0.07)" },
  { label: "Red",    border: "#f87171", bg: "rgba(248,113,113,0.07)" },
];

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // 👇 Get the authenticated API instance with Clerk token attached
  const api = useApiWithAuth();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]); // 👈 keep [id] only, not api — prevents infinite refetch

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note); // sends color too since note obj has it
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline">
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">

              <div className="form-control mb-4">
                <label className="label"><span className="label-text">Title</span></label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label"><span className="label-text">Content</span></label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              {/* COLOR PICKER */}
              <div className="form-control mb-6">
                <label className="label"><span className="label-text">Card Color</span></label>
                <div className="flex gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setNote({ ...note, color: c.border })}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c.border,
                        borderColor: note.color === c.border ? "white" : "transparent",
                        boxShadow: note.color === c.border ? `0 0 0 2px ${c.border}` : "none",
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;