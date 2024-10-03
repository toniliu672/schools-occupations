import { Modal, Loading } from '@/components';
import { CompetencyUnit } from '@/types/api';

interface CompetencyUnitDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    competencyUnit: CompetencyUnit;
    isLoading: boolean;
  }
  
  const CompetencyUnitDetailModal: React.FC<CompetencyUnitDetailModalProps> = ({ 
    isOpen, 
    onClose, 
    competencyUnit, 
    isLoading 
  }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Competency Unit Details">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Nama Kompetensi : {competencyUnit.name}</h2>
          {/* <p><strong>ID:</strong> {competencyUnit.id}</p> */}
          
          {competencyUnit.occupations && competencyUnit.occupations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Related Occupations:</h3>
              <ul className="list-disc pl-5">
                {competencyUnit.occupations.map(occupation => (
                  <li key={occupation.code}>{occupation.name} (Code: {occupation.code})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default CompetencyUnitDetailModal;