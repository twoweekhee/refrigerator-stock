import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function FridgeForm({ onAdd, categories, onCancel, preselectedCategory }) {
  const [name, setName] = useState('');
  const [count, setCount] = useState(1);
  const [expiryDate, setExpiryDate] = useState(null);
  const [useByDate, setUseByDate] = useState(null);
  const [category, setCategory] = useState(preselectedCategory || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && category.trim()) {
      onAdd({
        name,
        count,
        expiryDate: expiryDate ? expiryDate.toISOString().split('T')[0] : '',
        useByDate: useByDate ? useByDate.toISOString().split('T')[0] : '',
        category,
      });
      setName('');
      setCount(1);
      setExpiryDate(null);
      setUseByDate(null);
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
      <DatePicker
        selected={expiryDate}
        onChange={(date) => setExpiryDate(date)}
        dateFormat="yyyy/MM/dd"
        placeholderText="냉장고 들어간 날짜"
        className="form-control"
      />
      <DatePicker
        selected={useByDate}
        onChange={(date) => setUseByDate(date)}
        dateFormat="yyyy/MM/dd"
        placeholderText="소비기한"
        className="form-control"
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
      <button type="button" onClick={onCancel} className="x-btn">X</button>
    </form>
  );
}

export default FridgeForm;

