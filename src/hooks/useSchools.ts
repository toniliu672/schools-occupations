import { useState, useEffect, useCallback, useMemo } from "react";
import { School, SchoolInput, SchoolUpdate } from "@/types/api";
import {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} from "@/lib/api/schools";

export const useSchools = () => {
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewSchool, setViewSchool] = useState<School | null>(null);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const pageSize = 10;

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSchools({ pageSize: 1000 }); // Fetch all schools
      setAllSchools(response.items);
    } catch (err) {
      setError("Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const filteredSchools = useMemo(() => {
    return allSchools.filter((school) => {
      const schoolName = school?.name?.toLowerCase() ?? "";
      const schoolCity = school?.city?.toLowerCase() ?? "";
      const query = searchQuery.toLowerCase();

      return schoolName.includes(query) || schoolCity.includes(query);
    });
  }, [allSchools, searchQuery]);

  const totalPages = Math.ceil(filteredSchools.length / pageSize);

  // Ensure page is within valid range
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedSchools = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredSchools.slice(startIndex, startIndex + pageSize);
  }, [filteredSchools, page]);

  const handleCreateSchool = async (schoolData: SchoolInput) => {
    try {
      const newSchool = await createSchool(schoolData);
      setAllSchools((prev) => [...prev, newSchool]);
    } catch (err) {
      setError("Failed to create school");
    }
  };

  const handleUpdateSchool = async (id: string, schoolData: SchoolUpdate) => {
    try {
      await updateSchool(id, schoolData);
      window.location.reload(); // Memaksa refresh halaman
    } catch (err) {
      setError("Failed to update school");
    }
  };

  const handleDeleteSchool = async (id: string) => {
    try {
      await deleteSchool(id);
      setAllSchools((prev) => prev.filter((school) => school.id !== id));
    } catch (err) {
      setError("Failed to delete school");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Don't reset page here
  };

  const handleView = async (id: string) => {
    try {
      setIsLoadingDetail(true);
      const school = await getSchoolById(id);
      setViewSchool(school);
    } catch (error) {
      console.error("Failed to fetch school details:", error);
      setError("Failed to fetch school details");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleEdit = (id: string) => {
    const school = allSchools.find((s) => s.id === id);
    if (school) {
      setCurrentSchool(school);
    }
  };

  return {
    schools: paginatedSchools,
    loading,
    error,
    page,
    setPage,
    totalPages,
    viewSchool,
    currentSchool,
    isLoadingDetail,
    handleCreateSchool,
    handleUpdateSchool,
    handleDeleteSchool,
    handleSearch,
    handleView,
    handleEdit,
    setError,
    setViewSchool,
    setCurrentSchool,
    searchQuery,
  };
};