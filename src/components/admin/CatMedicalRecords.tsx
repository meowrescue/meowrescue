
import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, File, FileText, Download, FileSymlink, FileCheck } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/ImageUploader';

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
  const [documentFile, setDocumentFile] = React.useState<File | null>(null);

  const { data: medicalRecords, isLoading } = useQuery({
    queryKey: ['cat-medical-records', catId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cat_medical_records')
        .select('*, documents:documents(id, title, file_path)')
        .eq('cat_id', catId)
        .order('record_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // This effect will run whenever medicalRecords changes
  useEffect(() => {
    console.log('Medical records loaded:', medicalRecords);
  }, [medicalRecords]);

  const addMedicalRecord = useMutation({
    mutationFn: async (record: typeof newRecord) => {
      console.log('Adding medical record:', record);
      
      // First insert the medical record
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
      console.log('Medical record created:', data);
      
      // If there's a document and we successfully created a medical record, upload the document
      if (documentFile && data?.[0]?.id) {
        const fileName = `${Date.now()}_${documentFile.name}`;
        const filePath = `medical-records/${catId}/${fileName}`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, documentFile);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
          
        // Create document record in the database
        const { error: docError } = await supabase
          .from('documents')
          .insert([{
            title: `Medical Record: ${record.procedure_type}`,
            file_path: urlData.publicUrl,
            file_type: documentFile.type,
            file_size: documentFile.size,
            description: record.description,
            cat_id: catId
          }]);
          
        if (docError) throw docError;
      }
      
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
      setDocumentFile(null);
      toast({
        title: "Medical Record Added",
        description: "The medical record has been successfully added."
      });
    },
    onError: (error: any) => {
      console.error('Error adding medical record:', error);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleDocumentUploaded = (url: string) => {
    console.log("Document uploaded:", url);
    // This function can be expanded if needed
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-meow-primary border-t-transparent rounded-full"></div>
          </div>
        ) : medicalRecords && medicalRecords.length > 0 ? (
          <>
            <h3 className="text-xl font-semibold text-meow-primary mb-4 flex items-center">
              <FileCheck className="mr-2 h-5 w-5" />
              Existing Medical Records
            </h3>
            {medicalRecords.map((record) => (
              <Card key={record.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-meow-primary">{record.procedure_type}</h4>
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
                      
                      {/* Display any linked documents */}
                      {record.documents && record.documents.length > 0 && (
                        <div className="mt-2">
                          {record.documents.map((doc: any) => (
                            <a 
                              key={doc.id}
                              href={doc.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-600 hover:underline"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {doc.title || 'Medical Document'}
                            </a>
                          ))}
                        </div>
                      )}
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
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No medical records found for this cat.
          </div>
        )}
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-meow-primary/10 to-transparent">
          <CardTitle className="flex items-center text-meow-primary">
            <FileSymlink className="mr-2 h-5 w-5" />
            Add Medical Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              value={newRecord.procedure_type}
              onValueChange={(value) => setNewRecord(prev => ({ ...prev, procedure_type: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select procedure type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spay/Neuter">Spay/Neuter</SelectItem>
                <SelectItem value="Rabies Vaccination">Rabies Vaccination</SelectItem>
                <SelectItem value="FVRCP Vaccination">FVRCP Vaccination</SelectItem>
                <SelectItem value="Feline Leukemia Vaccination">Feline Leukemia Vaccination</SelectItem>
                <SelectItem value="Microchipping">Microchipping</SelectItem>
                <SelectItem value="Deworming">Deworming</SelectItem>
                <SelectItem value="Flea/Tick Treatment">Flea/Tick Treatment</SelectItem>
                <SelectItem value="Dental Cleaning">Dental Cleaning</SelectItem>
                <SelectItem value="Injury Treatment">Injury Treatment</SelectItem>
                <SelectItem value="Surgery">Surgery</SelectItem>
                <SelectItem value="Emergency Care">Emergency Care</SelectItem>
                <SelectItem value="Euthanasia">Euthanasia</SelectItem>
                <SelectItem value="Wellness Exam">Wellness Exam</SelectItem>
                <SelectItem value="Bloodwork">Bloodwork</SelectItem>
                <SelectItem value="X-Ray/Imaging">X-Ray/Imaging</SelectItem>
                <SelectItem value="Medication">Medication</SelectItem>
                <SelectItem value="Grooming">Grooming</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Description"
              value={newRecord.description}
              onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
              required
              className="w-full"
            />

            <Input
              placeholder="Veterinarian"
              value={newRecord.veterinarian}
              onChange={(e) => setNewRecord(prev => ({ ...prev, veterinarian: e.target.value }))}
              className="w-full"
            />

            <Input
              type="number"
              step="0.01"
              placeholder="Cost"
              value={newRecord.cost}
              onChange={(e) => setNewRecord(prev => ({ ...prev, cost: e.target.value }))}
              className="w-full"
            />

            <Input
              placeholder="Notes"
              value={newRecord.notes}
              onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full"
            />

            <div className="space-y-2">
              <p className="text-sm font-medium">Upload Medical Document (Optional)</p>
              <ImageUploader
                onImageUploaded={handleDocumentUploaded}
                bucketName="documents"
                folderPath={`medical-records/${catId}`}
              />
            </div>

            <Button type="submit" className="w-full bg-meow-primary hover:bg-meow-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CatMedicalRecords;
