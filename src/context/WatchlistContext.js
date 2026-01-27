import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WatchlistContext = createContext();

const WATCHLIST_STORAGE_KEY = '@tsunami_watchlist_lists';
const DEBOUNCE_DELAY = 500; // ms

const DEFAULT_LISTS = {
  'favorites': { id: 'favorites', name: 'Favorites', coins: [] },
  'watching': { id: 'watching', name: 'Watching', coins: [] }
};

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [lists, setLists] = useState(DEFAULT_LISTS);
  const [activeListId, setActiveListId] = useState('favorites');
  const [isLoading, setIsLoading] = useState(true);

  // Ref to track if initial load is complete (to avoid saving during load)
  const isInitialLoadComplete = useRef(false);
  // Ref for debounce timeout
  const saveTimeoutRef = useRef(null);

  // Load saved watchlist data on mount
  useEffect(() => {
    const loadWatchlistData = async () => {
      try {
        const savedLists = await AsyncStorage.getItem(WATCHLIST_STORAGE_KEY);
        if (savedLists !== null) {
          const parsedLists = JSON.parse(savedLists);
          // Ensure default lists always exist
          setLists({
            ...DEFAULT_LISTS,
            ...parsedLists,
          });
        }
      } catch (error) {
        console.error('Failed to load watchlist data:', error);
      } finally {
        setIsLoading(false);
        isInitialLoadComplete.current = true;
      }
    };

    loadWatchlistData();
  }, []);

  // Debounced save function
  const debouncedSave = useCallback((listsToSave) => {
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(listsToSave));
      } catch (error) {
        console.error('Failed to save watchlist data:', error);
      }
    }, DEBOUNCE_DELAY);
  }, []);

  // Save lists whenever they change (after initial load)
  useEffect(() => {
    if (isInitialLoadComplete.current) {
      debouncedSave(lists);
    }
  }, [lists, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
