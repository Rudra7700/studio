import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockFarmers, mockFields } from '@/lib/mock-data';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';

export function UserManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Management</CardTitle>
        <CardDescription>Manage farmer accounts and their details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Farmer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fields</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFarmers.map((farmer) => {
                const fieldCount = mockFields.filter(f => f.farmerId === farmer.id).length;
                return (
                    <TableRow key={farmer.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Image
                                    src={farmer.avatarUrl}
                                    alt={farmer.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                    data-ai-hint="person portrait"
                                />
                                <div>
                                    <div className="font-medium">{farmer.name}</div>
                                    <div className="text-sm text-muted-foreground">{farmer.email}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">Active</Badge>
                        </TableCell>
                        <TableCell>{fieldCount}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
