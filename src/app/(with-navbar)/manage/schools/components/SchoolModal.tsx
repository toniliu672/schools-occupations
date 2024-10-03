import { School, SchoolInput, SchoolUpdate } from '@/types/api';
import { Modal } from '@/components';
import SchoolForm from './SchoolForm';

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School | null;
  onSubmit: (data: SchoolInput | SchoolUpdate) => void;
}

const SchoolModal: React.FC<SchoolModalProps> = ({ isOpen, onClose, school, onSubmit }) => {
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={school ? 'Edit Sekolah' : 'Tambah Sekolah Baru'}
    >
      <div onClick={handleModalClick}>
        <SchoolForm
          school={school}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};

export default SchoolModal;