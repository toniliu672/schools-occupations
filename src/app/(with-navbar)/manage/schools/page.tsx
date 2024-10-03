"use client";

import { useState } from "react";
import { SchoolInput, SchoolUpdate } from "@/types/api";
import {
  Button,
  Notification,
  Loading,
  Pagination,
  SearchBarNoButton
} from "@/components";
import SchoolTable from "./components/SchoolTable";
import SchoolModal from "./components/SchoolModal";
import SchoolDetailModal from "./components/SchoolDetailModal";
import { useSchools } from "@/hooks/useSchools";

const SchoolManagementPage = () => {
  const {
    schools,
    loading,
    error,
    page,
    totalPages,
    viewSchool,
    currentSchool,
    isLoadingDetail,
    setPage,
    handleCreateSchool,
    handleUpdateSchool,
    handleDeleteSchool,
    handleSearch,
    handleView,
    handleEdit,
    setError,
    setViewSchool,
    setCurrentSchool,
    searchQuery, // Add this
  } = useSchools();

  const [modalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">School Management</h1>
      <div className="mb-4 flex justify-between items-center">
        <SearchBarNoButton 
          onSearch={handleSearch} 
          placeholder="Search schools..." 
          initialValue={searchQuery} // Add this
        />
        <Button onClick={() => setModalOpen(true)}>Add New School</Button>
      </div>
      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      <SchoolTable
        schools={schools}
        onEdit={(id) => {
          handleEdit(id);
          setModalOpen(true);
        }}
        onDelete={handleDeleteSchool}
        onView={(id) => {
          handleView(id);
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
      <SchoolModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCurrentSchool(null);
        }}
        school={currentSchool}
        onSubmit={(data) => {
          if (currentSchool) {
            handleUpdateSchool(currentSchool.id, data as SchoolUpdate);
          } else {
            handleCreateSchool(data as SchoolInput);
          }
          setModalOpen(false);
        }}
      />
      {viewSchool && (
        <SchoolDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewSchool(null);
          }}
          school={viewSchool}
          isLoading={isLoadingDetail}
        />
      )}
    </div>
  );
};

export default SchoolManagementPage;