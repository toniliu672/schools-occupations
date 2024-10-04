import { useState, useEffect, useCallback, useMemo } from 'react';
import { Occupation, OccupationInput, OccupationUpdate } from "@/types/api";
import {
  getOccupations,
  getOccupationByCode,
  createOccupation,
  updateOccupation,
  deleteOccupation,
} from "@/lib/api/occupations";

export const useOccupations = () => {
  const [allOccupations, setAllOccupations] = useState<Occupation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewOccupation, setViewOccupation] = useState<Occupation | null>(null);
  const [currentOccupation, setCurrentOccupation] = useState<Occupation | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const pageSize = 10;

  const fetchOccupations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOccupations({ pageSize: 1000 }); // Fetch all occupations
      setAllOccupations(response.items);
    } catch (err) {
      setError("Failed to fetch occupations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOccupations();
  }, [fetchOccupations]);

  const filteredOccupations = useMemo(() => {
    return allOccupations.filter(occupation => 
      occupation.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      occupation.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allOccupations, searchQuery]);

  const totalPages = Math.ceil(filteredOccupations.length / pageSize);

  // Ensure page is within valid range
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedOccupations = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredOccupations.slice(startIndex, startIndex + pageSize);
  }, [filteredOccupations, page]);

  const handleCreateOccupation = async (occupationData: OccupationInput) => {
    try {
      const newOccupation = await createOccupation(occupationData);
      setAllOccupations(prev => [...prev, newOccupation]);
    } catch (err) {
      setError("Failed to create occupation");
    }
  };

  const handleUpdateOccupation = async (oldCode: string, occupationData: OccupationUpdate) => {
    try {
      const updatedOccupation = await updateOccupation(oldCode, occupationData);
      setAllOccupations(prev => prev.map(occ => occ.code === oldCode ? updatedOccupation : occ));
    } catch (err) {
      setError("Failed to update occupation");
    }
  };

  const handleDeleteOccupation = async (code: string) => {
    try {
      await deleteOccupation(code);
      setAllOccupations(prev => prev.filter(occ => occ.code !== code));
    } catch (err) {
      setError("Failed to delete occupation");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Don't reset page here
  };

  const handleView = async (code: string) => {
    try {
      setIsLoadingDetail(true);
      const occupation = await getOccupationByCode(code);
      setViewOccupation(occupation);
    } catch (error) {
      console.error('Failed to fetch occupation details:', error);
      setError('Failed to fetch occupation details');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleEdit = (code: string) => {
    const occupation = allOccupations.find((o) => o.code === code);
    if (occupation) {
      setCurrentOccupation(occupation);
    }
  };

  return {
    occupations: paginatedOccupations,
    loading,
    error,
    page,
    setPage,
    totalPages,
    viewOccupation,
    currentOccupation,
    isLoadingDetail,
    handleCreateOccupation,
    handleUpdateOccupation,
    handleDeleteOccupation,
    handleSearch,
    handleView,
    handleEdit,
    setError,
    setViewOccupation,
    setCurrentOccupation,
    searchQuery,
  };
};