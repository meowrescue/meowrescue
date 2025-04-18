
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CatMedicalRecordsProps {
  catId: string;
}

const CatMedicalRecords: React.FC<CatMedicalRecordsProps> = ({ catId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newRecord, setNewRecord] = React.useState({
    procedure_type: '',
    description: '',
    veterinarian: '',
    cost: '',
    notes: ''
  });

  const { data: medicalRecords, isLoading } = useQuery({
    queryKey: ['cat-medical-records', catId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cat_medical_records')
        .select('*')
        .eq('cat_id', catId)
        .order('record_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const addMedicalRecord = useMutation({
    mutationFn: async (record: typeof newRecord) => {
      const { data, error } = await supabase
        .from('cat_medical_records')
        .insert([{
          cat_id: catId,
          procedure_type: record.procedure_type,
          description: record.description,
          veterinarian: record.veterinarian,
          cost: record.cost ? parseFloat(record.cost) : null,
          notes: record.notes
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cat-medical-records', catId] });
      setNewRecord({
        procedure_type: '',
        description: '',
        veterinarian: '',
        cost: '',
        notes: ''
      });
      toast({
        title: "Medical Record Added",
        description: "The medical record has been successfully added."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteMedicalRecord = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('cat_medical_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cat-medical-records', catId] });
      toast({
        title: "Medical Record Deleted",
        description: "The medical record has been successfully deleted."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicalRecord.mutate(newRecord);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Medical Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              value={newRecord.procedure_type}
              onValueChange={(value) => setNewRecord(prev => ({ ...prev, procedure_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select procedure type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vaccination">Vaccination</SelectItem>
                <SelectItem value="Surgery">Surgery</SelectItem>
                <SelectItem value="Check-up">Check-up</SelectItem>
                <SelectItem value="Medication">Medication</SelectItem>
                <SelectItem value="Test">Test</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Description"
              value={newRecord.description}
              onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
              required
            />

            <Input
              placeholder="Veterinarian"
              value={newRecord.veterinarian}
              onChange={(e) => setNewRecord(prev => ({ ...prev, veterinarian: e.target.value }))}
            />

            <Input
              type="number"
              step="0.01"
              placeholder="Cost"
              value={newRecord.cost}
              onChange={(e) => setNewRecord(prev => ({ ...prev, cost: e.target.value }))}
            />

            <Input
              placeholder="Notes"
              value={newRecord.notes}
              onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
            />

            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {medicalRecords?.map((record) => (
          <Card key={record.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{record.procedure_type}</h4>
                  <p className="text-sm text-gray-600">{record.description}</p>
                  {record.veterinarian && (
                    <p className="text-sm text-gray-600">Vet: {record.veterinarian}</p>
                  )}
                  {record.cost && (
                    <p className="text-sm text-gray-600">Cost: ${record.cost}</p>
                  )}
                  {record.notes && (
                    <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(record.record_date), 'PPP')}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this record?')) {
                      deleteMedicalRecord.mutate(record.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CatMedicalRecords;
