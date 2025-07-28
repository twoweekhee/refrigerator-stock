import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import FridgeForm from './FridgeForm'; // Import FridgeForm

function FridgeList({ items, categories, onRemove, onDragEnd, onDeleteCategory, onEdit, onAddItemToCategory, addingItemCategory, onCancelAddItem, onAdd }) {
  const getExpiryClass = (useByDate) => {
    if (!useByDate) return '';
    const today = new Date();
    const useBy = new Date(useByDate);
    const diffTime = useBy.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return 'expiring-soon urgent';
    if (diffDays <= 3) return 'expiring-soon';
    return '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null; // Return null for DatePicker if no dateString
    const date = new Date(dateString);
    return date;
  };

  const handleCountChange = (itemId, currentCount, delta) => {
    const newCount = Math.max(1, currentCount + delta); // Ensure count is at least 1
    onEdit(itemId, { count: newCount });
  };

  const handleDateChange = (itemId, field, date) => {
    const dateString = date ? date.toISOString().split('T')[0] : '';
    onEdit(itemId, { [field]: dateString });
  };

  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.category || '기타';
    (acc[category] = acc[category] || []).push(item);
    return acc;
  }, {});

  if (categories.length === 0) {
    return <div className="empty-list-message">새로운 카테고리를 먼저 추가해주세요.</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="list-container">
        {categories.map((category) => (
          <div key={category} className="category-group">
            <h2>
              {category}
              <div className="category-actions">
                <button onClick={() => onAddItemToCategory(category)} className="add-item-btn"> + 식재료 추가</button>
                {category !== '기타' && (
                  <button onClick={() => onDeleteCategory(category)} className="delete-category-btn">카테고리 삭제</button>
                )}
              </div>
            </h2>
            <Droppable droppableId={category}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`card-list-wrapper ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  <div className="item-cards-container">
                    {(itemsByCategory[category] || []).map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            className={`item-card ${getExpiryClass(item.useByDate)}`}
                          >
                            <div className="card-header">
                              <span className="item-name">{item.name}</span>
                              <button onClick={() => onRemove(item.id)} className="delete-item-btn">삭제</button>
                            </div>
                            <div className="card-body">
                              <div className="card-row">
                                <span className="card-label">수량:</span>
                                <div className="item-count-controls">
                                  <button onClick={() => handleCountChange(item.id, item.count, -1)}>-</button>
                                  <span>{item.count}</span>
                                  <button onClick={() => handleCountChange(item.id, item.count, 1)}>+</button>
                                </div>
                              </div>
                              <div className="card-row">
                                <span className="card-label">냉장고에 넣은 날짜:</span>
                                <DatePicker
                                  selected={formatDate(item.expiryDate)}
                                  onChange={(date) => handleDateChange(item.id, 'expiryDate', date)}
                                  dateFormat="yyyy/MM/dd"
                                  placeholderText="냉장고에 넣은 날짜"
                                  className="date-picker-input"
                                />
                              </div>
                              <div className="card-row">
                                <span className="card-label">소비기한:</span>
                                <DatePicker
                                  selected={formatDate(item.useByDate)}
                                  onChange={(date) => handleDateChange(item.id, 'useByDate', date)}
                                  dateFormat="yyyy/MM/dd"
                                  placeholderText="소비기한"
                                  className="date-picker-input"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {addingItemCategory === category && (
                      <div className="item-card new-item-form-card">
                        <FridgeForm 
                          onAdd={onAdd} 
                          categories={categories} 
                          preselectedCategory={category} 
                          onCancel={onCancelAddItem} 
                        />
                      </div>
                    )}
                  </div>
                  {(itemsByCategory[category] || []).length === 0 && addingItemCategory !== category && (
                    <div className="empty-category-state">
                      <p className="empty-message">아직 식재료가 없습니다</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

export default FridgeList;
