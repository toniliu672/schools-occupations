import { useState, useEffect } from 'react';
import { CompetencyUnit, CompetencyUnitInput, CompetencyUnitUpdate } from '@/types/api';
import { TextInput, Button } from '@/components';

interface CompetencyUnitFormProps {
  competencyUnit: CompetencyUnit | null;
  onSubmit: (data: CompetencyUnitInput | CompetencyUnitUpdate) => void;
  onCancel: () => void;
}

const CompetencyUnitForm: React.FC<CompetencyUnitFormProps> = ({ 
  competencyUnit, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<CompetencyUnitInput>({
    name: '',
  });

  useEffect(() => {
    if (competencyUnit) {
      setFormData({
        name: competencyUnit.name,
      });
    }
  }, [competencyUnit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <div className="flex space-x-2">
        <Button type="submit">{competencyUnit ? 'Update' : 'Create'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CompetencyUnitForm;