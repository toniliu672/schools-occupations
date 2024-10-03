"use client";

import { useState } from "react";
import { OccupationInput, OccupationUpdate } from "@/types/api";
import {
  Button,
  Notification,
  Loading,
  Pagination,
  SearchBarNoButton
} from "@/components";
import { useOccupations } from "@/hooks/useOccupations";
import { OccupationDetailModal, OccupationModal, OccupationTable } from "./components";

const OccupationManagementPage = () => {
  const {
    occupations,
    loading,
    error,
    page,
    totalPages,
    viewOccupation,
    currentOccupation,
    isLoadingDetail,
    setPage,
    handleCreateOccupation,
    handleUpdateOccupation,
    handleDeleteOccupation,
    handleSearch,
    handleView,
    handleEdit,
    setError,
    setViewOccupation,
    setCurrentOccupation,
    searchQuery, // Add this
  } = useOccupations();

  const [modalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Occupation Management</h1>
      <div className="mb-4 flex justify-between items-center">
        <SearchBarNoButton 
          onSearch={handleSearch} 
          placeholder="Search occupations..." 
          initialValue={searchQuery} // Add this
        />
        <Button onClick={() => setModalOpen(true)}>Add New Occupation</Button>
      </div>
      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      <OccupationTable
        occupations={occupations}
        onEdit={(code) => {
          handleEdit(code);
          setModalOpen(true);
        }}
        onDelete={handleDeleteOccupation}
        onView={(code) => {
          handleView(code);
          setIsDetailModalOpen(true);
        }}
        currentPage={page}
        pageSize={10}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <OccupationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCurrentOccupation(null);
        }}
        occupation={currentOccupation}
        onSubmit={(data) => {
          if (currentOccupation) {
            handleUpdateOccupation(currentOccupation.code, data as OccupationUpdate);
          } else {
            handleCreateOccupation(data as OccupationInput);
          }
          setModalOpen(false);
        }}
      />
      {viewOccupation && (
        <OccupationDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewOccupation(null);
          }}
          occupation={viewOccupation}
          isLoading={isLoadingDetail}
        />
      )}
    </div>
  );
};

export default OccupationManagementPage;