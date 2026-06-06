import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";

// 👇 ADD THIS — color options
const COLORS = [
  { label: "Green",  border: "#00FF9D", bg: "rgba(0,255,157,0.07)" },
  { label: "Blue",   border: "#60a5fa", bg: "rgba(96,165,250,0.07)" },
  { label: "Purple", border: "#c084fc", bg: "rgba(192,132,252,0.07)" },
  { label: "Pink",   border: "#f472b6", bg: "rgba(244,114,182,0.07)" },
  { label: "Amber",  border: "#fbbf24", bg: "rgba(251,191,36,0.07)" },
  { label: "Red",    border: "#f87171", bg: "rgba(248,113,113,0.07)" },
];

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(COLORS[0]); // 👈 ADD THIS

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      await api.post("/notes", { title, content, color: color.border }); // 👈 send color
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Slow down! you are creating notes too fast", { duration: 4000, icon: "💀" });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label"><span className="label-text">Title</span></label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label"><span className="label-text">Content</span></label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* 👇 COLOR PICKER */}
                <div className="form-control mb-6">
                  <label className="label"><span className="label-text">Card Color</span></label>
                  <div className="flex gap-3">
                    {COLORS.map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setColor(c)}
                        className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c.border,
                          borderColor: color.label === c.label ? "white" : "transparent",
                          boxShadow: color.label === c.label ? `0 0 0 2px ${c.border}` : "none",
                        }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Note"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;