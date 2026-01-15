import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DailyVerse {
  verse: string;
  reference: string;
  reflection: string;
}

const STORAGE_KEY_VERSE = 'zealous_daily_verse';
const STORAGE_KEY_DATE = 'zealous_verse_date';
const STORAGE_KEY_FEELINGS = 'zealous_user_feelings';

const fallbackVerse: DailyVerse = {
  verse: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.",
  reference: "Psalm 23:1-3",
  reflection: "May you find peace and restoration in God's loving care today."
};

export function useDailyVerse() {
  const [verse, setVerse] = useState<DailyVerse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get today's date string
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get stored feelings from localStorage
  const getStoredFeelings = (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FEELINGS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Add a new feeling to storage
  const addFeeling = (feeling: string) => {
    try {
      const feelings = getStoredFeelings();
      // Keep last 10 feelings
      const updated = [...feelings, feeling].slice(-10);
      localStorage.setItem(STORAGE_KEY_FEELINGS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to store feeling:', error);
    }
  };

  // Fetch a new verse from the AI
  const fetchNewVerse = async () => {
    const today = getTodayDate();
    const feelings = getStoredFeelings();

    try {
      console.log('Fetching new daily verse...');
      
      const { data, error } = await supabase.functions.invoke('get-daily-verse', {
        body: { userFeelings: feelings, date: today }
      });

      if (error) {
        console.error('Error fetching verse:', error);
        return fallbackVerse;
      }

      return data as DailyVerse;
    } catch (error) {
      console.error('Failed to fetch daily verse:', error);
      return fallbackVerse;
    }
  };

  useEffect(() => {
    const loadVerse = async () => {
      const today = getTodayDate();
      
      try {
        // Check if we already have a verse for today - show immediately
        const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
        const storedVerse = localStorage.getItem(STORAGE_KEY_VERSE);

        if (storedDate === today && storedVerse) {
          // Use cached verse for today - instant load
          setVerse(JSON.parse(storedVerse));
          setIsLoading(false);
          return;
        }

        // Show fallback immediately while fetching
        setVerse(fallbackVerse);
        setIsLoading(false);

        // Fetch new verse in background
        const newVerse = await fetchNewVerse();
        
        // Cache and update
        localStorage.setItem(STORAGE_KEY_DATE, today);
        localStorage.setItem(STORAGE_KEY_VERSE, JSON.stringify(newVerse));
        
        setVerse(newVerse);
      } catch (error) {
        console.error('Error loading verse:', error);
        setVerse(fallbackVerse);
        setIsLoading(false);
      }
    };

    loadVerse();
  }, []);

  // Force refresh the verse (useful for testing)
  const refreshVerse = async () => {
    setIsLoading(true);
    const newVerse = await fetchNewVerse();
    const today = getTodayDate();
    
    localStorage.setItem(STORAGE_KEY_DATE, today);
    localStorage.setItem(STORAGE_KEY_VERSE, JSON.stringify(newVerse));
    
    setVerse(newVerse);
    setIsLoading(false);
  };

  return { verse, isLoading, addFeeling, refreshVerse };
}
