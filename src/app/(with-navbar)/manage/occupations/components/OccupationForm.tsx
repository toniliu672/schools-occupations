import { useState, useEffect } from 'react';
import { Occupation, OccupationInput, OccupationUpdate } from '@/types/api';
import { TextInput, Button } from '@/components';

interface OccupationFormProps {
  occupation: Occupation | null;
  onSubmit: (data: OccupationInput | OccupationUpdate) => void;
  onCancel: () => void;
}

const OccupationForm: React.FC<OccupationFormProps> = ({ occupation, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<OccupationInput>({
    code: '',
    name: '',
  });

  useEffect(() => {
    if (occupation) {
      setFormData({
        code: occupation.code,
        name: occupation.name,
      });
    }
  }, [occupation]);

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
        label="Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        required
        disabled={!!occupation}
      />
      <TextInput
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <div className="flex space-x-2">
        <Button type="submit">{occupation ? 'Update' : 'Create'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default OccupationForm;