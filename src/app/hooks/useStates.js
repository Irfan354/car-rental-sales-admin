import { useState, useEffect } from 'react';
import { stateService } from '../lib/stateService';

export const useStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStates = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading states from API...');
      
      const data = await stateService.getAllStates();
      console.log('📦 States API Response:', data);
      
      setStates(data);
    } catch (err) {
      console.error('❌ Error loading states:', err);
      setError(err.response?.data?.message || 'Failed to load states');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStates();
  }, []);

  return {
    states,
    loading,
    error,
    loadStates,
  };
};