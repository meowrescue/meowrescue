
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface LostFoundPost {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contact: string;
  image: string;
  status: 'open' | 'closed';
}

const AdminLostFound: React.FC = () => {
  const [lostFoundPosts, setLostFoundPosts] = useState<LostFoundPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch lost and found posts from API
    const fetchLostFoundPosts = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('https://api.example.com/lost-found');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: LostFoundPost[] = await response.json();
        setLostFoundPosts(data);
      } catch (error) {
        console.error("Could not fetch lost and found posts:", error);
        toast({
          title: "Error",
          description: "Failed to load lost and found posts.",
          variant: "destructive",
        });
      }
    };

    fetchLostFoundPosts();
  }, []);

  // Convert Set to Array before iteration using Array.from instead of spread
  const categories: string[] = Array.from(new Set(lostFoundPosts.map(post => post.category)));

  const filteredPosts = lostFoundPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/admin/lost-found/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    // Implement delete logic here
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`https://api.example.com/lost-found/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setLostFoundPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      toast({
        title: "Success",
        description: "Post deleted successfully.",
      });
    } catch (error) {
      console.error("Could not delete post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Manage Lost & Found Posts</h1>
          <Link to="/admin/lost-found/new">
            <Button>Create New Post</Button>
          </Link>
        </div>

        <div className="mb-4">
          <Label htmlFor="search">Search Posts:</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search by title, description, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of your recent lost and found posts.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.location}</TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === 'open' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/20">
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the post from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(post.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLostFound;
