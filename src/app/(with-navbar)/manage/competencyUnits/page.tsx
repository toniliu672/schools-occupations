"use client";

import { useState } from "react";
import {
  CompetencyUnitInput,
  CompetencyUnitUpdate,
} from "@/types/api";
import {
  Button,
  Notification,
  Loading,
  Pagination,
  SearchBarNoButton
} from "@/components";
import {
  CompetencyUnitDetailModal,
  CompetencyUnitModal,
  CompetencyUnitTable,
} from "./components";
import { useCompetencyUnits } from "@/hooks/useCompentecyUnits";

const CompetencyUnitManagementPage = () => {
  const {
    competencyUnits,
    loading,
    error,
    page,
    totalPages,
    viewCompetencyUnit,
    currentCompetencyUnit,
    isLoadingDetail,
    isViewLoading,
    isEditLoading,
    setPage,
    handleCreateCompetencyUnit,
    handleUpdateCompetencyUnit,
    handleDeleteCompetencyUnit,
    handleSearch,
    handleView,
    handleEdit,
    setError,
    setViewCompetencyUnit,
    setCurrentCompetencyUnit,
  } = useCompetencyUnits();

  const [modalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Competency Unit Management</h1>
      <div className="mb-4 flex justify-between items-center">
        <SearchBarNoButton
          onSearch={handleSearch}
          placeholder="Search competency units..."
        />
        <Button onClick={() => setModalOpen(true)}>
          Add New Competency Unit
        </Button>
      </div>
      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      <CompetencyUnitTable
        competencyUnits={competencyUnits}
        onEdit={(unitCode) => {
          handleEdit(unitCode);
          setModalOpen(true);
        }}
        onDelete={handleDeleteCompetencyUnit}
        onView={(unitCode) => {
          handleView(unitCode);
          setIsDetailModalOpen(true);
        }}
        currentPage={page}
        pageSize={10}
        isViewLoading={isViewLoading}
        isEditLoading={isEditLoading}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <CompetencyUnitModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCurrentCompetencyUnit(null);
        }}
        competencyUnit={currentCompetencyUnit}
        onSubmit={(data: CompetencyUnitInput | CompetencyUnitUpdate) => {
          if (currentCompetencyUnit) {
            handleUpdateCompetencyUnit(
              currentCompetencyUnit.unitCode,
              data as CompetencyUnitUpdate
            );
          } else {
            handleCreateCompetencyUnit(data as CompetencyUnitInput);
          }
          setModalOpen(false);
        }}
      />
      {viewCompetencyUnit && (
        <CompetencyUnitDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewCompetencyUnit(null);
          }}
          competencyUnit={viewCompetencyUnit}
          isLoading={isLoadingDetail}
        />
      )}
    </div>
  );
};

export default CompetencyUnitManagementPage;