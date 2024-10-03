import { Modal, Button } from '@/components';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
    >
      <p>Are you sure you want to delete the competency unit: {itemName}?</p>
      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={onClose} variant="outline">Cancel</Button>
        <Button onClick={onConfirm} variant="primary">Delete</Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;