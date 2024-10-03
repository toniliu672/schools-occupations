import { Modal, Loading } from '@/components';
import { School } from '@/types/api';

interface SchoolDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School;
  isLoading: boolean;
}

const SchoolDetailModal: React.FC<SchoolDetailModalProps> = ({ isOpen, onClose, school, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="School Details">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{school.name}</h2>
          <p><strong>City:</strong> {school.city}</p>
          <p><strong>Address:</strong> {school.address}</p>
          
          {school.description && (
            <div>
              <h3 className="text-lg font-semibold">Description:</h3>
              <p>{school.description}</p>
            </div>
          )}
          
          <p><strong>Student Count:</strong> {school.studentCount}</p>
          <p><strong>Graduate Count:</strong> {school.graduateCount}</p>
          <p><strong>Graduate Percent:</strong> {school.graduatePercent.toFixed(2)}%</p>
          
          {school.externalLinks && school.externalLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">External Links:</h3>
              <ul className="list-disc pl-5">
                {school.externalLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {school.occupations && school.occupations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Occupations:</h3>
              <ul className="list-disc pl-5">
                {school.occupations.map(occ => (
                  <li key={occ.code}>{occ.name} (Code: {occ.code})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default SchoolDetailModal;