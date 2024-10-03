import { Table, Button } from '@/components';
import { CompetencyUnit } from '@/types/api';
import { useTheme } from 'next-themes';
import { Column } from '@/types/components';

interface CompetencyUnitTableProps {
  competencyUnits: CompetencyUnit[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onView: (id: string) => void;
  currentPage: number;
  pageSize: number;
  isViewLoading: boolean;  
  isEditLoading: boolean;  
}

const CompetencyUnitTable: React.FC<CompetencyUnitTableProps> = ({ 
  competencyUnits, 
  onEdit, 
  onDelete, 
  onView, 
  currentPage, 
  pageSize 
}) => {
  const { theme } = useTheme();

  const columns: Column[] = [
    { 
      header: 'No.', 
      accessor: 'index',
      cell: (_, index) => {
        if (index === undefined) return '-';
        const globalIndex = (currentPage - 1) * pageSize + index + 1;
        return globalIndex;
      }
    },
    // { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { 
      header: 'Occupations', 
      accessor: 'occupations',
      cell: (value: any[]) => value.length
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
  ];

  const tableClassName = `min-w-full divide-y divide-gray-200 ${
    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  }`;

  return (
    <div className="overflow-x-auto">
      <Table
        data={competencyUnits}
        columns={columns}
        className={tableClassName}
      />
    </div>
  );
};

export default CompetencyUnitTable;