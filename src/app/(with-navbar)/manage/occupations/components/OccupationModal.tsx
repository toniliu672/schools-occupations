import { Occupation, OccupationInput, OccupationUpdate } from '@/types/api';
import { Modal } from '@/components';
import OccupationForm from './OccupationForm';

interface OccupationModalProps {
  isOpen: boolean;
  onClose: () => void;
  occupation: Occupation | null;
  onSubmit: (data: OccupationInput | OccupationUpdate) => void;
}

const OccupationModal: React.FC<OccupationModalProps> = ({ isOpen, onClose, occupation, onSubmit }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={occupation ? 'Edit Occupation' : 'Add New Occupation'}
    >
      <OccupationForm
        occupation={occupation}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default OccupationModal;