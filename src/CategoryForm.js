import React, { useState } from 'react';

function CategoryForm({ onAddCategory }) {
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category.trim()) {
      onAddCategory(category.trim());
      setCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <input
        type="text"
        placeholder="새 카테고리 이름 (예: 과일 🍅)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <button type="submit">카테고리 추가</button>
    </form>
  );
}

export default CategoryForm;
