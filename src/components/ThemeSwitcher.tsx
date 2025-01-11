import React from "react";
import { Moon, Sun } from "lucide-react";

interface ThemeSelectorProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, setTheme }) => {
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-900 backdrop-blur text-gray-800
                      dark:text-gray-200 transition-all duration-300 border border-gray-300 dark:border-gray-700"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <div className="relative w-5 h-5">
        <div
          className={`absolute inset-0 transform transition-transform duration-500
                              ${
                                theme === "dark"
                                  ? "opacity-100 rotate-0"
                                  : "opacity-0 -rotate-90"
                              }`}
        >
          <Moon className="w-5 h-5 transition-colors" />
        </div>
        <div
          className={`absolute inset-0 transform transition-transform duration-500
                              ${
                                theme === "light"
                                  ? "opacity-100 rotate-0"
                                  : "opacity-0 rotate-90"
                              }`}
        >
          <Sun className="w-5 h-5 transition-colors" />
        </div>
      </div>
    </button>
  );
};

export default ThemeSelector;
