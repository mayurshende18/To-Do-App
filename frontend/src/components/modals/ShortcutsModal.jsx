import React from "react";
import Modal from "./Modal";
import { useTheme } from "../../context/ThemeContext";

const shortcuts = [
  { keys: ["N"],           description: "Focus the new task input" },
  { keys: ["Escape"],      description: "Close any open modal" },
  { keys: ["Ctrl", "K"],   description: "Open keyboard shortcuts" },
  { keys: ["Ctrl", "E"],   description: "Export tasks as JSON" },
  { keys: ["Ctrl", "T"],   description: "Toggle dark / light theme" },
  { keys: ["Ctrl", "F"],   description: "Focus the search bar" },
  { keys: ["Ctrl", "/"],   description: "Show this shortcuts panel" },
];

const Kbd = ({ k, dark }) => (
  <kbd className={`px-2 py-0.5 rounded-lg text-xs font-display font-bold border ${
    dark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"
  }`}>{k}</kbd>
);

const ShortcutsModal = ({ open, onClose }) => {
  const { dark } = useTheme();
  return (
    <Modal open={open} onClose={onClose} title="⌨️ Keyboard Shortcuts">
      <div className="space-y-3">
        {shortcuts.map((s, i) => (
          <div key={i} className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${dark ? "hover:bg-slate-800/60" : "hover:bg-slate-50"} transition-colors`}>
            <span className={`text-sm font-body ${dark ? "text-slate-300" : "text-slate-600"}`}>{s.description}</span>
            <div className="flex items-center gap-1">
              {s.keys.map((k, j) => (
                <React.Fragment key={k}>
                  {j > 0 && <span className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>+</span>}
                  <Kbd k={k} dark={dark} />
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className={`mt-4 text-xs text-center font-body ${dark ? "text-slate-600" : "text-slate-400"}`}>
        Shortcuts are disabled when typing in an input field.
      </p>
    </Modal>
  );
};

export default ShortcutsModal;
