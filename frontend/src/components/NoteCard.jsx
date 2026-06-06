import { PenSquareIcon, Trash2Icon, PinIcon } from "lucide-react"; 
import { Link } from "react-router-dom"; 
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter(note => note._id !== id));
      toast.success("Notes deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handlePin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/notes/${note._id}/pin`);
      setNotes((prev) =>
        prev.map((n) => (n._id === note._id ? res.data : n)) // 👈 fixed: removed {} so it returns
      );
      toast.success(res.data.isPinned ? "Note pinned" : "Note unpinned");
    } catch (error) {
      toast.error("Failed to pin note");
    }
  };

  return (
   <Link
      to={`/note/${note._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid h-52 overflow-hidden relative"
      style={{
        borderColor: note.color || "#00FF9D",
        backgroundColor: note.color ? `${note.color}18` : "transparent",
      }}
>
      {/* 👇 pin badge — shows when pinned */}
      {note.isPinned && (
        <div className="absolute top-2 right-2 bg-primary/20 rounded-full p-1">
          <PinIcon className="size-3 text-primary fill-primary" />
        </div>
      )}

      <div className="card-body flex flex-col justify-between">
        <div>
          <h3 className="card-title text-base-content">{note.title}</h3>
          <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        </div>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            {/* 👇 pin button */}
            <button
              className={`btn btn-ghost btn-xs ${note.isPinned ? "text-primary" : "text-base-content/40"}`}
              onClick={handlePin}
            >
              <PinIcon className="size-4" />
            </button>
            <PenSquareIcon className="size-4" />
            <button className="btn btn-ghost btn-xs text-error" onClick={(e) => handleDelete(e, note._id)}>
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;