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
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

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
      (unit.unitCode?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (unit.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [allCompetencyUnits, searchQuery]);

  const totalPages = Math.ceil(filteredCompetencyUnits.length / pageSize);

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

  const handleUpdateCompetencyUnit = async (unitCode: string, unitData: CompetencyUnitUpdate) => {
    try {
      const updatedUnit = await updateCompetencyUnit(unitCode, unitData);
      setAllCompetencyUnits(prev => prev.map(unit => unit.unitCode === unitCode ? updatedUnit : unit));
    } catch (err) {
      setError("Failed to update competency unit");
    }
  };

  const handleDeleteCompetencyUnit = async (unitCode: string) => {
    try {
      await deleteCompetencyUnit(unitCode);
      setAllCompetencyUnits(prev => prev.filter(unit => unit.unitCode !== unitCode));
    } catch (err) {
      setError("Failed to delete competency unit");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleView = async (unitCode: string) => {
    try {
      setIsViewLoading(true);
      const unit = await getCompetencyUnitById(unitCode); 
      setViewCompetencyUnit(unit);
    } catch (error) {
      console.error('Failed to fetch competency unit details:', error);
      setError('Failed to fetch competency unit details');
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleEdit = (unitCode: string) => {
    setIsEditLoading(true);
    const unit = allCompetencyUnits.find((u) => u.unitCode === unitCode);
    if (unit) {
      setCurrentCompetencyUnit(unit);
    }
    setIsEditLoading(false);
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
    isViewLoading,
    isEditLoading,
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