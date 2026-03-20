import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("todo-theme");
    return saved !== null ? saved === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("todo-theme", dark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", dark);
    document.body.style.background = dark ? "#0a0f1e" : "#f1f5f9";
    document.body.style.color = dark ? "#e2e8f0" : "#0f172a";
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
