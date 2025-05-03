import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  File,
  FileText,
  FileImage,
  FileArchive,
  FilePlus,
  Trash2,
  Download,
  PawPrint,
  Package,
  DollarSign,
  Plus,
  Search,
} from 'lucide-react';
import SEO from '@/components/SEO';

interface DocumentCategory {
  id: string;
  name: string;
  description: string | null;
}

interface Document {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_type: string;
  file_size: number | null;
  category_id: string | null;
  cat_id: string | null;
  supply_id: string | null;
  donation_id: string | null;
  expense_id: string | null;
  created_at: string;
  category?: DocumentCategory;
  cat?: { name: string };
  supply?: { name: string };
}

interface Cat {
  id: string;
  name: string;
}

interface Supply {
  id: string;
  name: string;
}

const FILE_TYPES = {
  'image/jpeg': { icon: FileImage, color: 'text-blue-500' },
  'image/png': { icon: FileImage, color: 'text-blue-500' },
  'image/gif': { icon: FileImage, color: 'text-blue-500' },
  'application/pdf': { icon: FileText, color: 'text-red-500' },
  'application/msword': { icon: FileText, color: 'text-blue-500' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, color: 'text-blue-500' },
  'application/vnd.ms-excel': { icon: FileText, color: 'text-green-500' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileText, color: 'text-green-500' },
  'text/plain': { icon: FileText, color: 'text-gray-500' },
};

const AdminDocuments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    category_id: '',
    cat_id: '',
    supply_id: '',
    file_path: ''
  });
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  // Fetch documents
  const { data: documents, isLoading: loadingDocuments } = useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('documents')
        .select(`
          *,
          category:category_id (name, description),
          cat:cat_id (name),
          supply:supply_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Document[];
    }
  });

  // Fetch categories
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['document-categories'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('document_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as DocumentCategory[];
    }
  });

  // Fetch cats
  const { data: cats } = useQuery({
    queryKey: ['cats-list'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('cats')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data as Cat[];
    }
  });

  // Fetch supplies
  const { data: supplies } = useQuery({
    queryKey: ['supplies-list'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('supplies')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data as Supply[];
    }
  });

  // Add document mutation
  const addDocumentMutation = useMutation({
    mutationFn: async (document: typeof newDocument) => {
      // Upload the file first if needed
      let filePath = document.file_path;
      
      // Prepare the document data
      const documentData = {
        title: document.title,
        description: document.description || null,
        file_path: filePath,
        file_type: getFileTypeFromPath(filePath),
        category_id: document.category_id || null,
        cat_id: document.cat_id || null,
        supply_id: document.supply_id || null
      };
      
      // Insert into the database
      const { data, error } = await getSupabaseClient()
        .from('documents')
        .insert([documentData])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Document Added",
        description: "The document was added successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
      resetNewDocumentForm();
      setIsAddDocumentOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add document",
        variant: "destructive"
      });
    }
  });

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (category: typeof newCategory) => {
      const { data, error } = await getSupabaseClient()
        .from('document_categories')
        .insert([category])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Category Added",
        description: "The category was added successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['document-categories'] });
      setNewCategory({
        name: '',
        description: ''
      });
      setIsAddCategoryOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add category",
        variant: "destructive"
      });
    }
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      // Get the document to find the file path
      const { data: document, error: getError } = await getSupabaseClient()
        .from('documents')
        .select('file_path')
        .eq('id', documentId)
        .single();
      
      if (getError) throw getError;
      
      // Delete from storage if needed
      if (document.file_path.startsWith('documents/')) {
        const { error: storageError } = await getSupabaseClient().storage
          .from('documents')
          .remove([document.file_path.replace('documents/', '')]);
        
        if (storageError) throw storageError;
      }
      
      // Delete from database
      const { error } = await getSupabaseClient()
        .from('documents')
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
      return documentId;
    },
    onSuccess: () => {
      toast({
        title: "Document Deleted",
        description: "The document was deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive"
      });
    }
  });

  // Filter documents based on search query and selected tab
  const filteredDocuments = documents?.filter(doc => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.category?.name && doc.category.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.cat?.name && doc.cat.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.supply?.name && doc.supply.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Tab filter
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'cats' && doc.cat_id) return matchesSearch;
    if (selectedTab === 'supplies' && doc.supply_id) return matchesSearch;
    if (selectedTab === 'finances' && (doc.donation_id || doc.expense_id)) return matchesSearch;
    if (selectedTab === 'other' && !doc.cat_id && !doc.supply_id && !doc.donation_id && !doc.expense_id) return matchesSearch;
    
    // Category filter
    if (categories?.some(cat => cat.id === selectedTab) && doc.category_id === selectedTab) return matchesSearch;
    
    return false;
  });

  // Helper functions
  const getFileTypeFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'txt':
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
  };

  const getFileIcon = (fileType: string) => {
    const fileConfig = FILE_TYPES[fileType as keyof typeof FILE_TYPES];
    if (fileConfig) {
      const Icon = fileConfig.icon;
      return <Icon className={`h-6 w-6 ${fileConfig.color}`} />;
    }
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const formatFileSize = (sizeInBytes: number | null) => {
    if (sizeInBytes === null) return 'Unknown size';
    
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const confirmDelete = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocumentMutation.mutate(documentId);
    }
  };

  const resetNewDocumentForm = () => {
    setNewDocument({
      title: '',
      description: '',
      category_id: '',
      cat_id: '',
      supply_id: '',
      file_path: ''
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;
    
    // Upload to Supabase storage
    getSupabaseClient().storage
      .from('documents')
      .upload(filePath, file)
      .then(({ data, error }) => {
        if (error) throw error;
        
        // Get the public URL
        const { data: urlData } = getSupabaseClient().storage
          .from('documents')
          .getPublicUrl(filePath);
        
        setNewDocument({
          ...newDocument,
          file_path: urlData.publicUrl
        });
        
        toast({
          title: "File Uploaded",
          description: "Your file has been uploaded successfully."
        });
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        toast({
          title: "Upload Failed",
          description: error.message || "There was an error uploading your file.",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <AdminLayout title="Documents">
      <SEO title="Documents | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Document Management</h1>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 md:w-80"
              />
            </div>
            <Button onClick={() => setIsAddDocumentOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex overflow-x-auto pb-2 mb-6">
            <TabsList className="mr-2">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="cats">
                <PawPrint className="h-4 w-4 mr-1" />
                Cats
              </TabsTrigger>
              <TabsTrigger value="supplies">
                <Package className="h-4 w-4 mr-1" />
                Supplies
              </TabsTrigger>
              <TabsTrigger value="finances">
                <DollarSign className="h-4 w-4 mr-1" />
                Finances
              </TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            
            {categories && categories.length > 0 && (
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 whitespace-nowrap"
              onClick={() => setIsAddCategoryOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </Button>
          </div>
          
          <TabsContent value={selectedTab}>
            {loadingDocuments ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : filteredDocuments && filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <Card key={document.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="p-3 bg-gray-100 rounded-lg mr-4">
                              {getFileIcon(document.file_type)}
                            </div>
                            <div>
                              <h3 className="font-medium">{document.title}</h3>
                              <p className="text-sm text-gray-500">
                                {document.category?.name || 'Uncategorized'}
                              </p>
                              {document.cat?.name && (
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <PawPrint className="h-3 w-3 mr-1" />
                                  {document.cat.name}
                                </div>
                              )}
                              {document.supply?.name && (
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <Package className="h-3 w-3 mr-1" />
                                  {document.supply.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {document.description && (
                          <p className="mt-3 text-sm text-gray-600">{document.description}</p>
                        )}
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {format(new Date(document.created_at), 'MMM d, yyyy')}
                          </span>
                          <span>
                            {formatFileSize(document.file_size)}
                          </span>
                        </div>
                      </div>
                      <div className="flex border-t">
                        <a
                          href={document.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 text-center text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Download className="h-4 w-4 inline mr-1" />
                          Download
                        </a>
                        <button
                          onClick={() => confirmDelete(document.id)}
                          className="flex-1 py-2 text-center text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No documents found. Upload your first document to get started.</p>
                <Button className="mt-4" onClick={() => setIsAddDocumentOpen(true)}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Document Dialog */}
      <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FilePlus className="mr-2 h-5 w-5" />
              Add New Document
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            addDocumentMutation.mutate(newDocument);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={newDocument.description}
                  onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select
                  value={newDocument.category_id}
                  onValueChange={(value) => setNewDocument({ ...newDocument, category_id: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cat" className="text-right">Related Cat</Label>
                <Select
                  value={newDocument.cat_id}
                  onValueChange={(value) => setNewDocument({ ...newDocument, cat_id: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select cat (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {cats?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supply" className="text-right">Related Supply</Label>
                <Select
                  value={newDocument.supply_id}
                  onValueChange={(value) => setNewDocument({ ...newDocument, supply_id: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select supply (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {supplies?.map((supply) => (
                      <SelectItem key={supply.id} value={supply.id}>
                        {supply.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">File</Label>
                <div className="col-span-3">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    required={!newDocument.file_path}
                  />
                  {isUploading && (
                    <div className="mt-2 flex items-center">
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent border-meow-primary rounded-full"></div>
                      <span className="text-sm text-gray-500">Uploading...</span>
                    </div>
                  )}
                  {newDocument.file_path && (
                    <div className="mt-2">
                      <a
                        href={newDocument.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View uploaded file
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetNewDocumentForm();
                  setIsAddDocumentOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newDocument.title || !newDocument.file_path || addDocumentMutation.isPending}
              >
                {addDocumentMutation.isPending ? 'Adding...' : 'Add Document'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Add New Category
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            addCategoryMutation.mutate(newCategory);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoryDescription" className="text-right">Description</Label>
                <Textarea
                  id="categoryDescription"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewCategory({ name: '', description: '' });
                  setIsAddCategoryOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newCategory.name || addCategoryMutation.isPending}
              >
                {addCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDocuments;
