
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon, ArchiveIcon, RotateCcw, Trash2 } from "lucide-react";
import { LostFoundPost } from "@/types/getSupabaseClient()";

interface PostsTableProps {
  posts: LostFoundPost[];
  onView: (post: LostFoundPost) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

const PostsTable: React.FC<PostsTableProps> = ({
  posts,
  onView,
  onArchive,
  onRestore,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pet Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date Posted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="font-medium">{post.title}</div>
                <div className="text-sm text-gray-500">
                  by {post.profiles?.first_name} {post.profiles?.last_name}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={
                  post.status === 'lost' ? 'destructive' :
                  post.status === 'found' ? 'outline' :
                  post.status === 'reunited' ? 'default' :
                  'secondary'
                }>
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{post.pet_type}</TableCell>
              <TableCell>{post.location}</TableCell>
              <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    title="View Details"
                    onClick={() => onView(post)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  
                  {post.status !== 'archived' ? (
                    <Button
                      variant="outline"
                      size="icon"
                      title="Archive Post"
                      onClick={() => onArchive(post.id)}
                    >
                      <ArchiveIcon className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      title="Restore Post"
                      onClick={() => onRestore(post.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    title="Delete Post"
                    onClick={() => onDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PostsTable;
