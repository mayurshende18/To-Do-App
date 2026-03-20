import { useEffect } from "react";

/**
 * useKeyboard — registers global keyboard shortcuts.
 * shortcuts: [{ key, ctrl?, shift?, action, description }]
 */
const useKeyboard = (shortcuts, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e) => {
      for (const s of shortcuts) {
        const ctrlMatch = s.ctrl ? (e.ctrlKey || e.metaKey) : !(e.ctrlKey || e.metaKey);
        const shiftMatch = s.shift ? e.shiftKey : !e.shiftKey;
        const keyMatch = e.key.toLowerCase() === s.key.toLowerCase();
        // Don't fire when typing in inputs
        const inInput = ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);
        if (keyMatch && ctrlMatch && shiftMatch && !inInput) {
          e.preventDefault();
          s.action();
          break;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts, enabled]);
};

export default useKeyboard;
