import React, { createContext, useState, useContext } from 'react';

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [lists, setLists] = useState({
    'favorites': { id: 'favorites', name: 'Favorites', coins: [] },
    'watching': { id: 'watching', name: 'Watching', coins: [] }
  });
  const [activeListId, setActiveListId] = useState('favorites');
  const [isLoading, setIsLoading] = useState(false); // No async load needed

  const addCoinToList = (listId, coinId) => {
    setLists(prev => {
        const list = prev[listId];
        if (!list) return prev; 
        if (list.coins.includes(coinId)) return prev;
        
        const newLists = {
            ...prev,
            [listId]: { ...list, coins: [...list.coins, coinId] }
        };
        return newLists;
    });
  };

  const removeCoinFromList = (listId, coinId) => {
    setLists(prev => {
        const list = prev[listId];
        if (!list) return prev;
        
        const newLists = {
            ...prev,
            [listId]: { ...list, coins: list.coins.filter(id => id !== coinId) }
        };
        return newLists;
    });
  };
  
  const toggleCoinInList = (listId, coinId) => {
      const list = lists[listId];
      if (!list) return;

      if (list.coins.includes(coinId)) {
          removeCoinFromList(listId, coinId);
      } else {
          addCoinToList(listId, coinId);
      }
  };
  
  const isInWatchlist = (coinId) => {
      // Check if coin is in the *active* list
      return lists[activeListId]?.coins.includes(coinId);
  }

  const createList = (name) => {
      const id = Date.now().toString();
      setLists(prev => {
          const newLists = {
              ...prev,
              [id]: { id, name, coins: [] }
          };
          return newLists;
      });
      return id;
  };

  const deleteList = (listId) => {
      if (listId === 'favorites' || listId === 'watching') return; // Prevent deleting default lists
      
      setLists(prev => {
          const newLists = { ...prev };
          delete newLists[listId];
          return newLists;
      });
      if (activeListId === listId) setActiveListId('favorites');
  };
  
  const renameList = (listId, newName) => {
      setLists(prev => {
         const list = prev[listId];
         if (!list) return prev;
         const newLists = {
             ...prev,
             [listId]: { ...list, name: newName }
         };
         return newLists;
      });
  }

  return (
    <WatchlistContext.Provider value={{ 
        lists, 
        activeListId, 
        setActiveListId, 
        addCoinToList, 
        removeCoinFromList,
        toggleCoinInList,
        isInWatchlist,
        createList,
        deleteList,
        renameList,
        isLoading
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};