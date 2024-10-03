import { CompetencyUnit, CompetencyUnitInput, CompetencyUnitUpdate } from '@/types/api';
import { Modal } from '@/components';
import CompetencyUnitForm from './ComptencyUnitForm';

interface CompetencyUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  competencyUnit: CompetencyUnit | null;
  onSubmit: (data: CompetencyUnitInput | CompetencyUnitUpdate) => void;
}

const CompetencyUnitModal: React.FC<CompetencyUnitModalProps> = ({ 
  isOpen, 
  onClose, 
  competencyUnit, 
  onSubmit 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={competencyUnit ? 'Edit Competency Unit' : 'Add New Competency Unit'}
    >
      <CompetencyUnitForm
        competencyUnit={competencyUnit}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default CompetencyUnitModal;