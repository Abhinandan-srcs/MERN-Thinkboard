
import {
  NotebookIcon,
  PinIcon,
  ArchiveIcon,
  Trash2Icon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

const LABEL_COLORS = [
  "#00FF9D",
  "#60a5fa",
  "#c084fc",
  "#f472b6",
  "#fbbf24",
  "#f87171",
];

const Sidebar = ({ isOpen, onClose, activeView, setActiveView, notes = [], labels, setLabels }) => {
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);

  const pinnedCount = notes.filter((n) => n.isPinned && !n.isArchived && !n.isTrashed).length;
  const allCount = notes.filter((n) => !n.isArchived && !n.isTrashed).length;
  const archivedCount = notes.filter((n) => n.isArchived && !n.isTrashed).length;
  const trashedCount = notes.filter((n) => n.isTrashed).length;

  const addLabel = () => {
    const name = newLabelName.trim();
    if (!name) return;
    if (labels.find((l) => l.name.toLowerCase() === name.toLowerCase())) return;
    setLabels((prev) => [...prev, { name, color: newLabelColor, id: Date.now() }]);
    setNewLabelName("");
    setNewLabelColor(LABEL_COLORS[0]);
    setShowLabelInput(false);
  };

  const removeLabel = (id) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  };

  const navItems = [
    { id: "all", label: "All notes", icon: NotebookIcon, count: allCount },
    { id: "pinned", label: "Pinned", icon: PinIcon, count: pinnedCount },
  ];

  const organizeItems = [
    { id: "archive", label: "Archive", icon: ArchiveIcon, count: archivedCount },
    { id: "trash", label: "Trash", icon: Trash2Icon, count: trashedCount },
  ];

  const NavBtn = ({ id, icon: Icon, label, count }) => {
    const active = activeView === id;
    return (
      <button
        onClick={() => { setActiveView(id); onClose(); }}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors relative ${
          active
            ? "text-primary bg-base-100"
            : "text-base-content/60 hover:text-base-content hover:bg-base-100"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-r" />
        )}
        <Icon className="size-4 flex-shrink-0" />
        <span className="truncate">{label}</span>
        {count > 0 && (
          <span className="ml-auto text-[10px] bg-base-content/10 text-base-content/50 px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-56 flex flex-col bg-base-200 border-r border-base-content/10 transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ boxShadow: isOpen ? "4px 0 32px rgba(0,0,0,0.35)" : "none" }}
      >
        {/* Header — close button only */}
        <div className="flex items-center justify-end px-3 py-3 border-b border-base-content/10 min-h-[61px]">
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-base-content"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="py-2 border-b border-base-content/10">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-base-content/40 px-3 py-1">
            Navigation
          </p>
          {navItems.map((item) => <NavBtn key={item.id} {...item} />)}
        </div>

        {/* Organize */}
        <div className="py-2 border-b border-base-content/10">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-base-content/40 px-3 py-1">
            Organize
          </p>
          {organizeItems.map((item) => <NavBtn key={item.id} {...item} />)}
        </div>

        {/* Labels */}
        <div className="flex-1 overflow-y-auto py-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-base-content/40 px-3 py-1">
            Labels
          </p>

          {labels.map((label) => {
            const active = activeView === `label:${label.name}`;
            return (
              <div
                key={label.id}
                className={`flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors group cursor-pointer relative ${
                  active
                    ? "text-primary bg-base-100"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-100"
                }`}
                onClick={() => { setActiveView(`label:${label.name}`); onClose(); }}
              >
                {active && (
                  <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-r" />
                )}
                <span
                  className="size-2.5 rounded-full flex-shrink-0"
                  style={{ background: label.color }}
                />
                <span className="truncate flex-1">{label.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeLabel(label.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-base-content/30 hover:text-error"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            );
          })}

          {showLabelInput && (
            <div className="px-3 py-2 flex flex-col gap-2">
              <input
                autoFocus
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addLabel();
                  if (e.key === "Escape") { setShowLabelInput(false); setNewLabelName(""); }
                }}
                placeholder="Label name..."
                className="input input-xs input-bordered w-full focus:border-primary"
                maxLength={20}
              />
              <div className="flex items-center gap-1.5">
                {LABEL_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewLabelColor(c)}
                    className="size-4 rounded-full transition-transform hover:scale-110 flex-shrink-0"
                    style={{
                      background: c,
                      outline: newLabelColor === c ? `2px solid ${c}` : "none",
                      outlineOffset: "1.5px",
                    }}
                  />
                ))}
                <button
                  onClick={addLabel}
                  className="ml-auto text-[11px] border border-primary text-primary px-2 py-0.5 rounded hover:bg-primary/10 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {!showLabelInput && (
            <button
              onClick={() => setShowLabelInput(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-base-content/40 hover:text-base-content/70 transition-colors w-full"
            >
              <PlusIcon className="size-3.5" />
              Add label
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

