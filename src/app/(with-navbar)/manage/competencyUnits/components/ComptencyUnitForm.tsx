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
    unitCode: '',
    name: '',
  });

  useEffect(() => {
    if (competencyUnit) {
      setFormData({
        unitCode: competencyUnit.unitCode,
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
        label="Unit Code"
        name="unitCode"
        value={formData.unitCode}
        onChange={handleChange}
        required
        disabled={!!competencyUnit} // Disable editing of unitCode for existing competency units
      />
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