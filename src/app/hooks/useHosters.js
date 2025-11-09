import { useState, useEffect } from 'react';
import hosterService from '../lib/hosterService';

export const useHosters = () => {
  const [hosters, setHosters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all hosters
  const loadHosters = async () => {
    // debugger
    try {
      setLoading(true);
      setError(null);
      
      const data = await hosterService.getAllHosters();
      console.log(" Loaded hosters:", data);
      

      setHosters(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hosters');
      console.error('Error loading hosters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new hoster
  const addHoster = async (hosterData) => {
    try {
      setLoading(true);
      const newHoster = await hosterService.createHoster(hosterData);
      setHosters(prev => [...prev, newHoster]);
      return newHoster;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create hoster');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update hoster
  const updateHoster = async (id, hosterData) => {
    try {
      setLoading(true);
      const updatedHoster = await hosterService.updateHoster(id, hosterData);
      setHosters(prev => prev.map(hoster => 
        hoster.id === id ? updatedHoster : hoster
      ));
      return updatedHoster;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update hoster');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update hoster status (validation)
  const updateHosterStatus = async (id, statusData) => {
    try {
      setLoading(true);
      const updatedHoster = await hosterService.updateHosterStatus(id, statusData);
      setHosters(prev => prev.map(hoster => 
        hoster.id === id ? updatedHoster : hoster
      ));
      return updatedHoster;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update hoster status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete hoster
  const deleteHoster = async (id) => {
    try {
      setLoading(true);
      await hosterService.deleteHoster(id);
      setHosters(prev => prev.filter(hoster => hoster.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete hoster');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload document
  const uploadDocument = async (hosterId, documentType, file) => {
    try {
      setLoading(true);
      const result = await hosterService.uploadDocument(hosterId, documentType, file);
      // Reload hosters to get updated document status
      await loadHosters();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load hosters on component mount
  useEffect(() => {
    loadHosters();
  }, []);

  return {
    hosters,
    setHosters,
    loading,
    error,
    loadHosters,
    addHoster,
    updateHoster,
    updateHosterStatus,
    deleteHoster, 
    uploadDocument,
  };
};