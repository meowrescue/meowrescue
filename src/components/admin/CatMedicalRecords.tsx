import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MedicalRecord {
  id: string;
  cat_id: string;
  procedure_type: string;
  description: string;
  veterinarian: string | null;
  cost: number | null;
  notes: string | null;
  record_date: string;
  created_at: string;
}

const CatMedicalRecords = ({ catId, editMode }: { catId: string; editMode: boolean }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newRecord, setNewRecord] = useState<Omit<MedicalRecord, 'id' | 'created_at'>>({
    cat_id: catId,
    procedure_type: '',
    description: '',
    veterinarian: '',
    cost: 0,
    notes: '',
    record_date: new Date().toISOString().split('T')[0],
  });

  const { data: medicalRecords, isLoading, refetch } = useQuery({
    queryKey: ['cat-medical-records', catId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cat_medical_records')
        .select('*')
        .eq('cat_id', catId)
        .order('record_date', { ascending: false });

      if (error) throw error;
      return data as MedicalRecord[];
    },
    enabled: !!catId,
  });

  const createRecordMutation = useMutation({
    mutationFn: async (record: Omit<MedicalRecord, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('cat_medical_records')
        .insert([record])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Medical Record Added",
        description: "The medical record has been successfully added."
      });
      refetch();
      setNewRecord({
        cat_id: catId,
        procedure_type: '',
        description: '',
        veterinarian: '',
        cost: 0,
        notes: '',
        record_date: new Date().toISOString().split('T')[0],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Medical Record",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const { data, error } = await supabase
        .from('cat_medical_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Medical Record Deleted",
        description: "The medical record has been successfully deleted."
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Medical Record",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewRecord({ ...newRecord, record_date: date.toISOString().split('T')[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMode) return;
    createRecordMutation.mutate(newRecord);
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!editMode) return; // Prevent deletion if not in edit mode
    
    if (!window.confirm("Are you sure you want to delete this medical record?")) return;
    deleteRecordMutation.mutate(recordId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Medical Records</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Procedure</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Veterinarian</TableHead>
            <TableHead>Cost</TableHead>
            {editMode && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicalRecords && medicalRecords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={editMode ? 6 : 5} className="text-center py-6">
                No medical records found for this cat.
              </TableCell>
            </TableRow>
          ) : (
            medicalRecords && medicalRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{format(new Date(record.record_date), 'MMM d, yyyy')}</TableCell>
                <TableCell>{record.procedure_type}</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell>{record.veterinarian || 'N/A'}</TableCell>
                <TableCell>{record.cost ? `$${record.cost.toFixed(2)}` : 'N/A'}</TableCell>
                {editMode && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editMode && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="text-lg font-semibold">Add New Record</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="record_date">Record Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newRecord.record_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newRecord.record_date ? (
                      format(new Date(newRecord.record_date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={new Date(newRecord.record_date)}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="procedure_type">Procedure Type</Label>
              <Input
                type="text"
                id="procedure_type"
                name="procedure_type"
                value={newRecord.procedure_type}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="veterinarian">Veterinarian</Label>
              <Input
                type="text"
                id="veterinarian"
                name="veterinarian"
                value={newRecord.veterinarian || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="cost">Cost</Label>
              <Input
                type="number"
                id="cost"
                name="cost"
                value={newRecord.cost?.toString() || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newRecord.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={newRecord.notes || ''}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <Button type="submit">Add Record</Button>
        </form>
      )}
    </div>
  );
};

export default CatMedicalRecords;
