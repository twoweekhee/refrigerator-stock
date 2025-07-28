import React, { useState } from 'react';

function FridgeForm({ onAdd, categories }) {
  const [name, setName] = useState('');
  const [count, setCount] = useState(1);
  const [expiryDate, setExpiryDate] = useState('');
  const [useByDate, setUseByDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && category.trim()) {
      onAdd({ name, count, expiryDate, useByDate, category });
      setName('');
      setCount(1);
      setExpiryDate('');
      setUseByDate('');
      setCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        min="1"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="유통기한"
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => (e.target.type = 'text')}
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="소비기한"
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => (e.target.type = 'text')}
        value={useByDate}
        onChange={(e) => setUseByDate(e.target.value)}
      />
      <input
        list="categories"
        placeholder="카테고리 선택"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <datalist id="categories">
        {categories.map((cat, index) => (
          <option key={index} value={cat} />
        ))}
      </datalist>
      <button type="submit">식재료 추가</button>
    </form>
  );
}

export default FridgeForm;

