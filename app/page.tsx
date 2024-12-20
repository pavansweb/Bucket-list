"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Leaf,
  Trash2,
  Plus,
  Check,
  X,
  Edit2,
  Coffee,
} from "lucide-react";

const BucketList = () => {
  const defaultItems = [
    { id: "1", text: "Skydive from 15,000 feet", completed: false },
    { id: "2", text: "Achieve Doing 40 Pushups in one day", completed: false },
    {
      id: "3",
      text: "You can delete this and add more! Designed & Developed By Pavan",
      completed: false,
    },
  ];

  const themes = {
    light: {
      name: "Light",
      bg: "bg-gray-50",
      card: "bg-white",
      text: "text-gray-900",
      border: "border-gray-200",
      button: "bg-blue-500 hover:bg-blue-600",
      secondaryButton: "bg-gray-200 hover:bg-gray-300",
    },
    dark: {
      name: "Dark",
      bg: "bg-gray-900",
      card: "bg-gray-800",
      text: "text-gray-100",
      border: "border-gray-700",
      button: "bg-blue-600 hover:bg-blue-700",
      secondaryButton: "bg-gray-700 hover:bg-gray-600",
    },
    nature: {
      name: "Nature",
      bg: "bg-green-50",
      card: "bg-white",
      text: "text-green-900",
      border: "border-green-200",
      button: "bg-green-600 hover:bg-green-700",
      secondaryButton: "bg-green-100 hover:bg-green-200",
    },
    desert: {
      name: "Desert",
      bg: "bg-yellow-50",
      card: "bg-white",
      text: "text-yellow-900",
      border: "border-yellow-200",
      button: "bg-yellow-600 hover:bg-yellow-700",
      secondaryButton: "bg-yellow-100 hover:bg-yellow-200",
    },
  };

  type ThemeKey = keyof typeof themes; // Ensures theme is one of the keys of `themes`
  const [items, setItems] = useState(defaultItems);
  const [newItem, setNewItem] = useState("");
  const [theme, setTheme] = useState<ThemeKey>("nature");
  const [editingId, setEditingId] = useState<string | null>(null); // Explicitly typing the ID
  const [editText, setEditText] = useState("");

  // Load data from localStorage only on the client side (inside useEffect)
  useEffect(() => {
    const saved = localStorage.getItem("bucketList");
    const savedTheme = localStorage.getItem("theme");
    if (saved) setItems(JSON.parse(saved));
    if (savedTheme) setTheme(savedTheme as ThemeKey); // Type casting here
  }, []);

  // Save data to localStorage only on the client side
  useEffect(() => {
    localStorage.setItem("bucketList", JSON.stringify(items));
    localStorage.setItem("theme", theme);
  }, [items, theme]);

  const addItem = () => {
    if (newItem.trim()) {
      setItems([
        ...items,
        { id: new Date().toISOString(), text: newItem, completed: false },
      ]);
      setNewItem("");
    }
  };

  const toggleComplete = (id: string) => {
    // Ensure the id is a string
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    // Ensure the id is a string
    setItems(items.filter((item) => item.id !== id));
  };

  const startEdit = (item: { id: string; text: string }) => {
    // Ensure typing for item
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setItems(
        items.map((item) =>
          item.id === editingId ? { ...item, text: editText } : item
        )
      );
      setEditingId(null);
    }
  };

  const completedCount = items.filter((item) => item.completed).length;
  const progressPercentage = (completedCount / items.length) * 100 || 0;

  const icons = {
    light: Sun,
    dark: Moon,
    nature: Leaf,
    desert: Coffee,
  };

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-500 ${themes[theme].bg} ${themes[theme].text}`}
    >
      {/* Header and Theme Switcher */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">My Bucket List</h1>
          <div className="flex gap-2">
            {Object.keys(themes).map((key) => {
              const Icon = icons[key as ThemeKey]; // TypeScript key typing
              return (
                <button
                  key={key}
                  onClick={() => setTheme(key as ThemeKey)} // Type casting here
                  className={`p-2 rounded-lg ${
                    theme === key
                      ? themes[theme].button
                      : themes[theme].secondaryButton
                  }`}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={`w-full h-4 rounded-full ${themes[theme].card} ${themes[theme].border} border mb-6`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-center mb-6">
          {completedCount} of {items.length} completed (
          {Math.round(progressPercentage)}%)
        </p>

        {/* Add New Item Form */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addItem()}
            placeholder="Add a new bucket list item..."
            className={`flex-1 p-3 rounded-lg ${themes[theme].card} ${themes[theme].border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            onClick={addItem}
            className={`p-3 rounded-lg ${themes[theme].button} text-white`}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Bucket List Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg ${themes[theme].card} ${
                themes[theme].border
              } border flex items-center justify-between gap-4 transition-all duration-200 ${
                item.completed ? "opacity-70" : ""
              }`}
            >
              {editingId === item.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={`flex-1 p-2 rounded ${themes[theme].bg} ${themes[theme].border} border`}
                  />
                  <button
                    onClick={saveEdit}
                    className={`p-2 rounded ${themes[theme].button} text-white`}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className={`p-2 rounded ${themes[theme].secondaryButton}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 ${item.completed ? "line-through" : ""}`}
                  >
                    {item.text}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleComplete(item.id)}
                      className={`p-2 rounded ${themes[theme].button} text-white`}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className={`p-2 rounded ${themes[theme].secondaryButton}`}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className={`p-2 rounded ${themes[theme].secondaryButton} text-red-500`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BucketList;
