import React, { useState, useEffect } from 'react';
import FridgeForm from './FridgeForm';
import FridgeList from './FridgeList';
import CategoryForm from './CategoryForm';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('fridgeItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('fridgeCategories');
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [addingItemCategory, setAddingItemCategory] = useState(null); // New state to track which category is adding an item

  useEffect(() => {
    localStorage.setItem('fridgeItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('fridgeCategories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (category) => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
      setShowCategoryForm(false); // Hide form after adding
    }
  };

  const deleteCategory = (categoryToDelete) => {
    setCategories(categories.filter(cat => cat !== categoryToDelete));
    setItems(items.map(item => 
      item.category === categoryToDelete ? { ...item, category: '기타' } : item
    ));
  };

  const addItem = (item) => {
    const category = item.category.trim() === '' ? '기타' : item.category;
    if (!categories.includes(category)) {
      addCategory(category);
    }
    const newItem = { ...item, id: uuidv4(), category };
    setItems([...items, newItem]);
    setAddingItemCategory(null); // Hide inline form after adding
  };

  const removeItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  const editItem = (id, updatedFields) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updatedFields } : item
    ));
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceCategory = source.droppableId;
    const destinationCategory = destination.droppableId;

    if (destinationCategory === 'trash-can') {
      removeItem(draggableId);
    } else if (sourceCategory === destinationCategory) {
      const itemsInSameCategory = items.filter(item => item.category === sourceCategory);
      const otherItems = items.filter(item => item.category !== sourceCategory);
      const [movedItem] = itemsInSameCategory.splice(source.index, 1);
      itemsInSameCategory.splice(destination.index, 0, movedItem);

      setItems([...otherItems, ...itemsInSameCategory]);
    } else {
      const movedItem = items.find(item => item.id === draggableId);
      if (movedItem) {
        const newItems = items.map(item => 
          item.id === draggableId ? { ...item, category: destinationCategory } : item
        );
        setItems(newItems);
      }
    }
  };

  const handleAddItemToCategory = (category) => {
    setAddingItemCategory(category);
  };

  const handleCancelAddItem = () => {
    setAddingItemCategory(null);
  };

  return (
    <div className="container">
      <h1> 냉장고 재고 🍅 </h1>
      <div className="form-toggle-buttons">
        <button onClick={() => setShowCategoryForm(!showCategoryForm)}>
          카테고리 추가
        </button>
      </div>
      {showCategoryForm && <CategoryForm onAddCategory={addCategory} onCancel={() => setShowCategoryForm(false)} />}
      <FridgeList 
        items={items} 
        categories={categories} 
        onRemove={removeItem} 
        onDragEnd={handleDragEnd} 
        onDeleteCategory={deleteCategory}
        onEdit={editItem}
        onAddItemToCategory={handleAddItemToCategory}
        addingItemCategory={addingItemCategory}
        onCancelAddItem={handleCancelAddItem}
        onAdd={addItem}
      />
      <footer className="app-footer">
        <p>
          <a href="https://github.com/twoweekhee" target="_blank" rel="noopener noreferrer">🐙 GitHub</a> |
          <a href="https://www.instagram.com/200.dorahee" target="_blank" rel="noopener noreferrer">🐠 Instagram</a>
        </p>
        <p> 🚀 Built by twoweekhee </p>
      </footer>
    </div>
  );
}

export default App;
