// components/SchoolForm.tsx
import { useState, useEffect } from 'react';
import { School, SchoolInput, SchoolUpdate, Occupation } from '@/types/api';
import { TextInput, Button, DynamicInput, SearchableMultiSelect } from '@/components';
import { useOccupations } from '@/hooks/useOccupations';

interface SchoolFormProps {
  school: School | null;
  onSubmit: (data: SchoolInput | SchoolUpdate) => void;
  onCancel: () => void;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ school, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<SchoolInput>({
    name: '',
    city: '',
    address: '',
    description: '',
    studentCount: 0,
    graduateCount: 0,
    externalLinks: [],
    occupations: [],
  });

  const { occupations, loading, error } = useOccupations();

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name,
        city: school.city,
        address: school.address,
        description: school.description || '',
        studentCount: school.studentCount,
        graduateCount: school.graduateCount,
        externalLinks: school.externalLinks || [],
        occupations: school.occupations.map(o => ({ code: o.code })),
      });
    }
  }, [school]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOccupationChange = (selectedOccupations: string[]) => {
    setFormData(prev => ({
      ...prev,
      occupations: selectedOccupations.map(code => ({ code })),
    }));
  };

  if (loading) return <div>Loading occupations...</div>;
  if (error) return <div>Error loading occupations: {error}</div>;

  const occupationOptions = occupations.map((occ: Occupation) => ({
    value: occ.code,
    label: `${occ.name} (${occ.code})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Nama Sekolah"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Kota"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Alamat"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Deskripsi"
        name="description"
        value={formData.description || ''}
        onChange={handleChange}
      />
      <TextInput
        label="Jumlah Siswa"
        name="studentCount"
        type="number"
        value={formData.studentCount?.toString() || '0'}
        onChange={handleNumberChange}
      />
      <TextInput
        label="Total Lulusan"
        name="graduateCount"
        type="number"
        value={formData.graduateCount?.toString() || '0'}
        onChange={handleNumberChange}
      />
      <DynamicInput
        label="Link Pranata Luar"
        values={formData.externalLinks || []}
        onChange={(newLinks) => setFormData(prev => ({ ...prev, externalLinks: newLinks }))}
      />
      <SearchableMultiSelect
        options={occupationOptions}
        selectedValues={formData.occupations?.map(o => o.code) || []}
        onChange={handleOccupationChange}
        label="Kode Okupasi"
        placeholder="Cari okupasi..."
      />
      <div className="flex space-x-2">
        <Button type="submit">{school ? 'Perbarui' : 'Buat'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
};

export default SchoolForm;