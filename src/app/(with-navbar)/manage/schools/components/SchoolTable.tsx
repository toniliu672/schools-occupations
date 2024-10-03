import { Table, Button } from '@/components';
import { School } from '@/types/api';
import { useTheme } from 'next-themes';
import { Column } from '@/types/components';
import { useMemo } from 'react';

interface SchoolTableProps {
  schools: School[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  currentPage: number;
  pageSize: number;
}

const SchoolTable: React.FC<SchoolTableProps> = ({ schools, onEdit, onDelete, onView, currentPage, pageSize }) => {
  const { theme } = useTheme();

  const truncateText = useMemo(() => (text: string | null | undefined, maxLength: number) => {
    if (!text) return ''; // Return empty string for null or undefined
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }, []);

  const formatPercentage = useMemo(() => (value: number | null | undefined) => {
    if (value == null || isNaN(value)) return '-'; // Return dash for null, undefined or NaN
    return `${Number(value.toFixed(2))}%`;
  }, []);

  const columns: Column[] = useMemo(() => [
    { 
      header: 'No.', 
      accessor: 'index',
      cell: (_, index) => {
        if (index === undefined) return '-';
        const globalIndex = (currentPage - 1) * pageSize + index + 1;
        return globalIndex;
      }
    },
    { 
      header: 'Name', 
      accessor: 'name',
      cell: (value: string) => truncateText(value, 50)
    },
    { 
      header: 'City', 
      accessor: 'city',
      cell: (value: string) => truncateText(value, 50)
    },
    { 
      header: 'Address', 
      accessor: 'address',
      cell: (value: string) => truncateText(value, 50)
    },
    { 
      header: 'Student Count', 
      accessor: 'studentCount',
      cell: (value: number) => value ?? '-'
    },
    { 
      header: 'Graduate Count', 
      accessor: 'graduateCount',
      cell: (value: number) => value ?? '-'
    },
    { 
      header: 'Graduate Percent', 
      accessor: 'graduatePercent',
      cell: (value: number) => formatPercentage(value)
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value: string) => (
        <div className="space-x-2">
          <Button onClick={() => onView(value)} variant="primary" size="small">
            View
          </Button>
          <Button onClick={() => onEdit(value)} variant="secondary" size="small">
            Edit
          </Button>
          <Button onClick={() => onDelete(value)} variant="outline" size="small">
            Delete
          </Button>
        </div>
      ),
    },
  ], [currentPage, pageSize, onView, onEdit, onDelete, truncateText, formatPercentage]);

  const tableClassName = `min-w-full divide-y divide-gray-200 ${
    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  }`;

  return (
    <div className="overflow-x-auto">
      <Table
        data={schools}
        columns={columns}
        className={tableClassName}
      />
    </div>
  );
};

export default SchoolTable;