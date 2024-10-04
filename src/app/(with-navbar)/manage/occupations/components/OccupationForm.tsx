import { useState, useEffect } from 'react';
import { Occupation, OccupationInput, OccupationUpdate, CompetencyUnit } from '@/types/api';
import { TextInput, Button, SearchableMultiSelect } from '@/components';
import { useCompetencyUnits } from '@/hooks/useCompentecyUnits';

interface OccupationFormProps {
  occupation: Occupation | null;
  onSubmit: (data: OccupationInput | OccupationUpdate) => void;
  onCancel: () => void;
}

const OccupationForm: React.FC<OccupationFormProps> = ({ occupation, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<OccupationInput>({
    code: '',
    name: '',
    competencyUnits: [],
  });
  const [newCompetencyUnit, setNewCompetencyUnit] = useState({ unitCode: '', name: '' });

  const {
    competencyUnits,
    loading,
    error,
    handleSearch: handleCompetencyUnitSearch,
  } = useCompetencyUnits();

  useEffect(() => {
    if (occupation) {
      setFormData({
        code: occupation.code,
        name: occupation.name,
        competencyUnits: occupation.competencyUnits?.map(cu => cu.unitCode) || [],
      });
    }
  }, [occupation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      code: formData.code,
      name: formData.name,
      competencyUnits: formData.competencyUnits,
    });
  };
  const handleCompetencyUnitChange = (selectedUnits: string[]) => {
    setFormData(prev => ({
      ...prev,
      competencyUnits: selectedUnits,
    }));
  };

  const handleNewCompetencyUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompetencyUnit(prev => ({ ...prev, [name]: value }));
  };

  const addNewCompetencyUnit = () => {
    if (newCompetencyUnit.unitCode && newCompetencyUnit.name) {
      setFormData(prev => ({
        ...prev,
        competencyUnits: [...prev.competencyUnits, newCompetencyUnit.unitCode],
      }));
      setNewCompetencyUnit({ unitCode: '', name: '' });
    }
  };

  if (loading) return <div>Loading competency units...</div>;
  if (error) return <div>Error loading competency units: {error}</div>;

  const competencyUnitOptions = competencyUnits.map((cu: CompetencyUnit) => ({
    value: cu.unitCode,
    label: cu.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        required
        // disabled={!!occupation}
      />
      <TextInput
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      {occupation ? (
        <SearchableMultiSelect
          options={competencyUnitOptions}
          selectedValues={formData.competencyUnits}
          onChange={handleCompetencyUnitChange}
          label="Competency Units"
          placeholder="Search competency units..."
        />
      ) : (
        <div className="space-y-2">
          <h3 className="font-semibold">Add New Competency Units</h3>
          <div className="flex space-x-2">
            <TextInput
              label="Unit Code"
              name="unitCode"
              value={newCompetencyUnit.unitCode}
              onChange={handleNewCompetencyUnitChange}
              placeholder="Enter unit code"
            />
            <TextInput
              label="Unit Name"
              name="name"
              value={newCompetencyUnit.name}
              onChange={handleNewCompetencyUnitChange}
              placeholder="Enter unit name"
            />
            <Button type="button" onClick={addNewCompetencyUnit}>Add</Button>
          </div>
          <ul className="list-disc pl-5">
            {formData.competencyUnits.map((unitCode, index) => (
              <li key={index}>{unitCode}</li>
            ))}
          </ul>
        </div>
      )}
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