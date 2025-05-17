// components/KanbanBoard.jsx
'use client'

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { SortableCard } from './SortableCard';
const generateUniqueId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};
const initialBoard = {
  id: 'board-1',
  title: 'تابلوی مدیریت وظایف',
  lists: [
    {
      id: generateUniqueId('list'),
      title: 'در حال انجام',
      cards: [
        { id: generateUniqueId('card'), content: 'تکمیل کامپوننت درگ‌اندروپ' },
        { id: generateUniqueId('card'), content: 'اضافه کردن قابلیت ویرایش' },
      ],
    },
    {
      id: generateUniqueId('list'),
      title: 'انجام شده',
      cards: [
        { id: generateUniqueId('card'), content: 'راه‌اندازی پروژه' },
      ],
    },
    {
      id: generateUniqueId('list'),
      title: 'بررسی شود',
      cards: [],
    },
  ],
};

export default function KanbanBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [activeId, setActiveId] = useState(null);
  const [activeType, setActiveType] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // نیاز به حرکت 5px برای شروع درگ
      },
    }),
    useSensor(KeyboardSensor)
  );

  const findContainer = (id) => {
    if (id in board.lists) return id;
    return board.lists.find((list) => list.cards.some((card) => card.id === id))?.id;
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    setActiveType(active.data.current?.type);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;

    const overId = over.id;
    const activeId = active.id;

    if (activeId === overId) return;

    const isActiveAList = active.data.current?.type === 'list';
    const isOverAList = over.data.current?.type === 'list';

    // جابجایی لیست‌ها
    if (isActiveAList && isOverAList) {
      setBoard((prevBoard) => {
        const oldIndex = prevBoard.lists.findIndex((list) => list.id === activeId);
        const newIndex = prevBoard.lists.findIndex((list) => list.id === overId);

        return {
          ...prevBoard,
          lists: arrayMove(prevBoard.lists, oldIndex, newIndex),
        };
      });
    }

    // جابجایی کارت‌ها
    if (!isActiveAList && !isOverAList) {
      const overContainer = findContainer(overId);
      const activeContainer = findContainer(activeId);

      if (!activeContainer || !overContainer || activeContainer !== overContainer) {
        return;
      }

      setBoard((prevBoard) => {
        const listIndex = prevBoard.lists.findIndex((list) => list.id === overContainer);
        if (listIndex === -1) return prevBoard;

        const list = { ...prevBoard.lists[listIndex] };
        const oldIndex = list.cards.findIndex((card) => card.id === activeId);
        const newIndex = list.cards.findIndex((card) => card.id === overId);

        const newCards = arrayMove(list.cards, oldIndex, newIndex);
        
        const newLists = [...prevBoard.lists];
        newLists[listIndex] = { ...list, cards: newCards };

        return {
          ...prevBoard,
          lists: newLists,
        };
      });
    }

    // انتقال کارت بین لیست‌ها
    if (!isActiveAList && isOverAList) {
      const activeContainer = findContainer(activeId);
      const overContainer = overId;

      if (!activeContainer || !overContainer || activeContainer === overContainer) {
        return;
      }

      setBoard((prevBoard) => {
        const sourceListIndex = prevBoard.lists.findIndex((list) => list.id === activeContainer);
        const targetListIndex = prevBoard.lists.findIndex((list) => list.id === overContainer);

        if (sourceListIndex === -1 || targetListIndex === -1) return prevBoard;

        const sourceList = { ...prevBoard.lists[sourceListIndex] };
        const targetList = { ...prevBoard.lists[targetListIndex] };

        const cardIndex = sourceList.cards.findIndex((card) => card.id === activeId);
        if (cardIndex === -1) return prevBoard;

        const [movedCard] = sourceList.cards.splice(cardIndex, 1);
        targetList.cards.push(movedCard);

        const newLists = [...prevBoard.lists];
        newLists[sourceListIndex] = sourceList;
        newLists[targetListIndex] = targetList;

        return {
          ...prevBoard,
          lists: newLists,
        };
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    setActiveType(null);
  };

  const addNewList = (e) => {
    e.stopPropagation();
    const newList = {
      id: generateUniqueId('list'),
      title: 'لیست جدید',
      cards: [],
    };
    setBoard(prev => ({ ...prev, lists: [...prev.lists, newList] }));
  };
  
  const addNewCard = (listId) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              cards: [...list.cards, { 
                id: generateUniqueId(), 
                content: 'کارت جدید' 
              }] 
            } 
          : list
      ),
    }));
  };
  const handleAddCardClick = (listId, e) => {
    e?.stopPropagation(); // استفاده از ? برای حالت optional
    e?.preventDefault();
    addNewCard(listId);
  };
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-right">{board.title}</h1>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={board.lists.map((list) => list.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto">
            {board.lists.map((list) => (
              <SortableItem
                key={list.id}
                id={list.id}
                data={{ type: 'list' }}
              >
                <div className="bg-white rounded-lg shadow-md w-72 flex-shrink-0">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h2 className="font-semibold">{list.title}</h2>
                    <button className="text-gray-500">...</button>
                  </div>
                  
                  <SortableContext items={list.cards.map((card) => card.id)}>
                    <div className="p-3 min-h-[100px]">
                      {list.cards.map((card) => (
                        <SortableCard
                          key={card.id}
                          id={card.id}
                          data={{ type: 'card', parent: list.id }}
                        >
                          <div className="bg-gray-50 p-3 mb-2 rounded shadow-sm hover:shadow-md transition-shadow">
                            {card.content}
                          </div>
                        </SortableCard>
                      ))}
                    </div>
                  </SortableContext>
                  
                  <div className="p-3 border-t">
                    <button
                      onClick={(e) => handleAddCardClick(list.id, e)}
                      className="text-blue-500 p-2"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      + افزودن کارت
                    </button>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={defaultDropAnimation}>
          {activeId && activeType === 'list' ? (
            <div className="bg-white rounded-lg shadow-md w-72 flex-shrink-0 opacity-80">
              <div className="p-3 border-b">
                <h2 className="font-semibold">
                  {board.lists.find((list) => list.id === activeId)?.title}
                </h2>
              </div>
            </div>
          ) : activeId && activeType === 'card' ? (
            <div className="bg-gray-50 p-3 mb-2 rounded shadow-md w-64 opacity-80">
              {board.lists
                .flatMap((list) => list.cards)
                .find((card) => card.id === activeId)?.content}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      <div className="mt-4">
        <button
          onClick={addNewList}
          className="bg-gray-200 rounded-lg px-4 py-2 text-gray-700"
        >
          + افزودن لیست جدید
        </button>
      </div>
    </div>
  );
}