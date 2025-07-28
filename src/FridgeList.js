import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function FridgeList({ items, categories, onRemove, onDragEnd, onDeleteCategory }) {
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
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
              {category !== '기타' && (
                <button onClick={() => onDeleteCategory(category)} className="delete-category-btn">카테고리 삭제</button>
              )}
            </h2>
            <Droppable droppableId={category}>
              {(provided, snapshot) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  {(itemsByCategory[category] || []).map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`list-item ${getExpiryClass(item.useByDate)}`}
                        >
                          <div className="item-info">
                            <span className="item-name">{item.name} ({item.count}개)</span>
                            <div className="item-dates">
                              <span className="expiry-text">유통기한: {formatDate(item.expiryDate)}</span>
                              <span className="use-by-text">소비기한: {formatDate(item.useByDate)}</span>
                            </div>
                          </div>
                          <button onClick={() => onRemove(item.id)}>삭제</button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {(itemsByCategory[category] || []).length === 0 && (
                    <div className="empty-list-message">항목을 추가하세요.</div>
                  )}
                </ul>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

export default FridgeList;
