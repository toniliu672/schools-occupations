import { useState, useEffect, useCallback, useMemo } from 'react';
import { CompetencyUnit, CompetencyUnitInput, CompetencyUnitUpdate } from "@/types/api";
import {
  getCompetencyUnits,
  getCompetencyUnitById,
  createCompetencyUnit,
  updateCompetencyUnit,
  deleteCompetencyUnit,
} from "@/lib/api/competencyUnits";

export const useCompetencyUnits = () => {
  const [allCompetencyUnits, setAllCompetencyUnits] = useState<CompetencyUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewCompetencyUnit, setViewCompetencyUnit] = useState<CompetencyUnit | null>(null);
  const [currentCompetencyUnit, setCurrentCompetencyUnit] = useState<CompetencyUnit | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const pageSize = 10;

  const fetchCompetencyUnits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCompetencyUnits({ pageSize: 1000 }); // Fetch all competency units
      setAllCompetencyUnits(response.items);
    } catch (err) {
      setError("Failed to fetch competency units");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompetencyUnits();
  }, [fetchCompetencyUnits]);

  const filteredCompetencyUnits = useMemo(() => {
    return allCompetencyUnits.filter(unit => 
      unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCompetencyUnits, searchQuery]);

  const totalPages = Math.ceil(filteredCompetencyUnits.length / pageSize);

  // Ensure page is within valid range
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedCompetencyUnits = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredCompetencyUnits.slice(startIndex, startIndex + pageSize);
  }, [filteredCompetencyUnits, page]);

  const handleCreateCompetencyUnit = async (unitData: CompetencyUnitInput) => {
    try {
      const newUnit = await createCompetencyUnit(unitData);
      setAllCompetencyUnits(prev => [...prev, newUnit]);
    } catch (err) {
      setError("Failed to create competency unit");
    }
  };

  const handleUpdateCompetencyUnit = async (id: string, unitData: CompetencyUnitUpdate) => {
    try {
      const updatedUnit = await updateCompetencyUnit(id, unitData);
      setAllCompetencyUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit));
    } catch (err) {
      setError("Failed to update competency unit");
    }
  };

  const handleDeleteCompetencyUnit = async (id: string) => {
    try {
      await deleteCompetencyUnit(id);
      setAllCompetencyUnits(prev => prev.filter(unit => unit.id !== id));
    } catch (err) {
      setError("Failed to delete competency unit");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Don't reset page here
  };

  const handleView = async (id: string) => {
    try {
      setIsLoadingDetail(true);
      const unit = await getCompetencyUnitById(id);
      setViewCompetencyUnit(unit);
    } catch (error) {
      console.error('Failed to fetch competency unit details:', error);
      setError('Failed to fetch competency unit details');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleEdit = (id: string) => {
    const unit = allCompetencyUnits.find((u) => u.id === id);
    if (unit) {
      setCurrentCompetencyUnit(unit);
    }
  };

  return {
    competencyUnits: paginatedCompetencyUnits,
    loading,
    error,
    page,
    setPage,
    totalPages,
    viewCompetencyUnit,
    currentCompetencyUnit,
    isLoadingDetail,
    handleCreateCompetencyUnit,
    handleUpdateCompetencyUnit,
    handleDeleteCompetencyUnit,
    handleSearch,
    handleView,
    handleEdit,
    setError,
    setViewCompetencyUnit,
    setCurrentCompetencyUnit,
    searchQuery,
  };
};