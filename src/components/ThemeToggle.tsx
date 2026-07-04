import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center gap-2 px-4 py-2 border border-border rounded-full transition-all duration-300 hover:bg-secondary"
      aria-label="Toggle day/night mode"
    >
      <Sun
        className={`w-4 h-4 transition-all duration-300 ${
          isDark ? "text-muted-foreground" : "text-primary drop-shadow-[0_0_6px_hsl(var(--primary))]"
        }`}
      />
      <div className="relative w-10 h-5 bg-secondary rounded-full">
        <div
          className={`absolute top-0.5 w-4 h-4 bg-primary rounded-full transition-all duration-300 ${
            isDark ? "left-5" : "left-0.5"
          }`}
        />
      </div>
      <Moon
        className={`w-4 h-4 transition-all duration-300 ${
          isDark ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "text-muted-foreground"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
