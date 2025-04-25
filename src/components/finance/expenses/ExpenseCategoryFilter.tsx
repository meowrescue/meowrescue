
import React from "react";

interface ExpenseCategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
}

export const ExpenseCategoryFilter: React.FC<ExpenseCategoryFilterProps> = ({
  categories,
  value,
  onChange,
}) => (
  <div className="flex items-center space-x-2">
    <span className="font-medium">Filter:</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded px-2 py-1 h-10"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>
);
