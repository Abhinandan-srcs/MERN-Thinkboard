import { useState, useRef, useEffect } from "react";
import { PenSquareIcon, Trash2Icon, PinIcon, ArchiveIcon, TagIcon, CheckIcon, RotateCcwIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../lib/utils";
import { useApiWithAuth } from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes,theme, onArchive, onTrash, availableLabels = [], activeView }) => {
  const api = useApiWithAuth();
  const navigate = useNavigate();
  const [labelMenuOpen, setLabelMenuOpen] = useState(false);
  const labelMenuRef = useRef(null);

  const isTrashView   = activeView === "trash";
  const isArchiveView = activeView === "archive";

  useEffect(() => {
    if (!labelMenuOpen) return;
    const handler = (e) => {
      if (labelMenuRef.current && !labelMenuRef.current.contains(e.target))
        setLabelMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [labelMenuOpen]);

  const handleCardClick = () => {
    if (!isTrashView) navigate(`/note/${note._id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Permanently delete this note? This cannot be undone.")) return;
    try {
      await api.delete(`/notes/${note._id}`);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handlePin = async (e) => {
    e.stopPropagation();
    try {
      const res = await api.patch(`/notes/${note._id}/pin`);
      setNotes((prev) => prev.map((n) => (n._id === note._id ? res.data : n)));
      toast.success(res.data.isPinned ? "Note pinned" : "Note unpinned");
    } catch {
      toast.error("Failed to pin note");
    }
  };

  const handleArchive = (e) => {
    e.stopPropagation();
    onArchive?.(note._id);
  };

  const handleTrash = (e) => {
    e.stopPropagation();
    onTrash?.(note._id);
  };

  const handleLabelToggle = async (e, labelName) => {
    e.stopPropagation();
    const current = note.labels || [];
    const updated = current.includes(labelName)
      ? current.filter((l) => l !== labelName)
      : [...current, labelName];
    try {
      const res = await api.patch(`/notes/${note._id}/labels`, { labels: updated });
      setNotes((prev) => prev.map((n) => (n._id === note._id ? res.data : n)));
    } catch {
      toast.error("Failed to update labels");
    }
  };

const isDark = theme === "dark";
const noteLabels = note.labels || [];



const cardBg = note.color
  ? `${note.color}${isDark ? "2e" : "40"}`
  : "transparent";

const labelChipStyle = () => ({
  background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
  color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)",
  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
});





  return (
  <div
    onClick={handleCardClick}
    className={`card bg-base-100 border-t-4 border-solid overflow-hidden relative transition-all duration-200 ${
      !isTrashView ? "hover:shadow-lg cursor-pointer" : "cursor-default"
    }`}
    style={{
      borderColor: note.color || "#00FF9D",
      backgroundColor: cardBg,
      minHeight: "11rem",
    }}
  >
    {note.isPinned && !isTrashView && (
      <div className="absolute top-2 right-2 bg-primary/20 rounded-full p-1">
        <PinIcon className="size-3 text-primary fill-primary" />
      </div>
    )}

    <div className="card-body flex flex-col justify-between py-4 px-4">
      <div>
        <h3 className="font-semibold text-base-content text-base mb-1 pr-6">
          {note.title}
        </h3>

        <p className="text-base-content/60 line-clamp-3 text-sm leading-relaxed">
          {note.content}
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {noteLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {noteLabels.slice(0, 3).map((l) => (
              <span
                key={l}
                className="text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide"
                style={labelChipStyle()}
              >
                {l}
              </span>
            ))}

            {noteLabels.length > 3 && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={labelChipStyle()}
              >
                +{noteLabels.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-base-content/40">
            {formatDate(new Date(note.createdAt))}
          </span>

          <div className="flex items-center gap-0.5">
            {isTrashView ? (
              <>
                <button
                  className="btn btn-ghost btn-xs text-primary hover:text-primary/70"
                  onClick={handleTrash}
                >
                  <RotateCcwIcon className="size-3.5" />
                </button>

                <button
                  className="btn btn-ghost btn-xs text-error hover:text-error/70"
                  onClick={handleDelete}
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </>
            ) : (
              <>
                {!isArchiveView && (
                  <button
                    className={`btn btn-ghost btn-xs ${
                      note.isPinned
                        ? "text-primary"
                        : "text-base-content/30 hover:text-base-content/70"
                    }`}
                    onClick={handlePin}
                  >
                    <PinIcon className="size-3.5" />
                  </button>
                )}

                {!isArchiveView && availableLabels.length > 0 && (
                  <div className="relative" ref={labelMenuRef}>
                    <button
                      className="btn btn-ghost btn-xs text-base-content/30 hover:text-base-content/70"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLabelMenuOpen((v) => !v);
                      }}
                    >
                      <TagIcon className="size-3.5" />
                    </button>

                    {labelMenuOpen && (
                      <div
                        className="absolute bottom-full right-0 mb-1 z-50 min-w-36 bg-base-200 border border-base-content/10 rounded-xl shadow-xl py-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {availableLabels.map((label) => {
                          const active = noteLabels.includes(label.name);

                          return (
                            <button
                              key={label.name}
                              onClick={(e) =>
                                handleLabelToggle(e, label.name)
                              }
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-base-content/8 text-base-content/80"
                            >
                              <span
                                className="size-2 rounded-full"
                                style={{ background: label.color }}
                              />

                              <span className="flex-1 text-left">
                                {label.name}
                              </span>

                              {active && (
                                <CheckIcon className="size-3 text-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <button
                  className="btn btn-ghost btn-xs text-base-content/30 hover:text-base-content/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/note/${note._id}`);
                  }}
                >
                  <PenSquareIcon className="size-3.5" />
                </button>

                <button
                  className={`btn btn-ghost btn-xs ${
                    isArchiveView
                      ? "text-primary"
                      : "text-base-content/30 hover:text-primary"
                  }`}
                  onClick={handleArchive}
                >
                  <ArchiveIcon className="size-3.5" />
                </button>

                <button
                  className="btn btn-ghost btn-xs text-base-content/30 hover:text-error"
                  onClick={handleTrash}
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default NoteCard;
