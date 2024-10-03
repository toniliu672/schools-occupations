import { Modal, Loading } from '@/components';
import { Occupation } from '@/types/api';

interface OccupationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  occupation: Occupation;
  isLoading: boolean;
}

const OccupationDetailModal: React.FC<OccupationDetailModalProps> = ({ isOpen, onClose, occupation, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Occupation Details">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{occupation.name}</h2>
          <p><strong>Code:</strong> {occupation.code}</p>
          
          {occupation.competencyUnits && occupation.competencyUnits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Competency Units:</h3>
              <ul className="list-disc pl-5">
                {occupation.competencyUnits.map(unit => (
                  <li key={unit.id}>{unit.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default OccupationDetailModal;