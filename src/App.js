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

  useEffect(() => {
    localStorage.setItem('fridgeItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('fridgeCategories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (category) => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
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
  };

  const removeItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceCategory = source.droppableId;
    const destinationCategory = destination.droppableId;

    if (sourceCategory === destinationCategory) {
      const reorderedItems = Array.from(items.filter(item => item.category === sourceCategory));
      const [movedItem] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, movedItem);

      setItems(prevItems => [
        ...prevItems.filter(item => item.category !== sourceCategory),
        ...reorderedItems
      ]);
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

  return (
    <div className="container">
      <h1> 냉장고 재고 🍅 </h1>
      <CategoryForm onAddCategory={addCategory} />
      <FridgeForm onAdd={addItem} categories={categories} />
      <FridgeList 
        items={items} 
        categories={categories} 
        onRemove={removeItem} 
        onDragEnd={handleDragEnd} 
        onDeleteCategory={deleteCategory} // Pass deleteCategory
      />
    </div>
  );
}

export default App;
