import React, { useState } from 'react';

const ExampleItemList = () => {
  const initialItems = [
    'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6',
    'Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12',
    'Item 13', 'Item 14', 'Item 15', 'Item 16', 'Item 17', 'Item 18',
    'Item 19', 'Item 20', 'Item 21', 'Item 22', 'Item 23', 'Item 24',
    'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6',
    'Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12',
    'Item 13', 'Item 14', 'Item 15', 'Item 16', 'Item 17', 'Item 18',
    'Item 19', 'Item 20', 'Item 21', 'Item 22', 'Item 23', 'Item 24','Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6',
    'Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12',
    'Item 13', 'Item 14', 'Item 15', 'Item 16', 'Item 17', 'Item 18',
    'Item 19', 'Item 20', 'Item 21', 'Item 22', 'Item 23', 
  ];

  const [visibleCount, setVisibleCount] = useState(12);

  const showMoreItems = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div>
      <h2>Danh sách các mục:</h2>
      <ul>
        {initialItems.slice(0, visibleCount).map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {visibleCount < initialItems.length && (
        <button onClick={showMoreItems}>Xem thêm</button>
      )}
    </div>
  );
};

export default ExampleItemList;
