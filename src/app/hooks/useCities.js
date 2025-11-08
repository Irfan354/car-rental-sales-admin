import { useState, useEffect } from 'react';
import { cityService } from '../lib/cityService';

export const useCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCities = async (stateId = null) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading cities from API...');
      
      let data;
      if (stateId) {
        data = await cityService.getCitiesByState(stateId);
        console.log(`📦 Cities for state ${stateId}:`, data);
      } else {
        data = await cityService.getAllCities();
        console.log('📦 All cities API Response:', data);
      }
      
      setCities(data);
    } catch (err) {
      console.error('❌ Error loading cities:', err);
      setError(err.response?.data?.message || 'Failed to load cities');
    } finally {
      setLoading(false);
    }
  };

  // Load all cities on mount (optional)
  useEffect(() => {
    loadCities();
  }, []);

  return {
    cities,
    loading,
    error,
    loadCities,
  };
};