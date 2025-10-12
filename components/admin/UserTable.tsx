'use client';

/**
 * Table component for displaying and managing users
 * Includes team level management and sorting
 */

import { useState } from 'react';
import { User } from '@/lib/types/database.types';
import { TeamLevel, UserRole } from '@/lib/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, Eye } from 'lucide-react';

interface UserTableProps {
  users: User[];
  currentUserRole: UserRole;
  onTeamLevelChange: (userId: string, teamLevel: TeamLevel | null) => Promise<void>;
  onUserClick: (user: User) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function UserTable({
  users,
  currentUserRole,
  onTeamLevelChange,
  onUserClick,
  onSelectionChange,
}: UserTableProps) {
  const [sortField, setSortField] = useState<keyof User>('last_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const canEditTeamLevel = currentUserRole === UserRole.COACH;

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const comparison = String(aValue).localeCompare(String(bValue));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  };

  const toggleAllUsers = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
      onSelectionChange?.([]);
    } else {
      const allIds = new Set(users.map(u => u.id));
      setSelectedUsers(allIds);
      onSelectionChange?.(Array.from(allIds));
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.COACH:
        return 'default';
      case UserRole.CAPTAIN:
        return 'secondary';
      case UserRole.PLAYER:
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {canEditTeamLevel && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.size === users.length && users.length > 0}
                  onCheckedChange={toggleAllUsers}
                />
              </TableHead>
            )}
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('last_name')}
                className="flex items-center gap-1"
              >
                Name
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('email')}
                className="flex items-center gap-1"
              >
                Email
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('gender')}
                className="flex items-center gap-1"
              >
                Gender
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('role')}
                className="flex items-center gap-1"
              >
                Role
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Team Level</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              {canEditTeamLevel && (
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.has(user.id)}
                    onCheckedChange={() => toggleUserSelection(user.id)}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.gender}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {canEditTeamLevel ? (
                  <Select
                    value={user.team_level || 'none'}
                    onValueChange={(val) =>
                      onTeamLevelChange(user.id, val === 'none' ? null : (val as TeamLevel))
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value={TeamLevel.JV}>JV</SelectItem>
                      <SelectItem value={TeamLevel.VARSITY}>Varsity</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="capitalize">{user.team_level || 'None'}</span>
                )}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onUserClick(user)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {sortedUsers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={canEditTeamLevel ? 7 : 6}
                className="text-center py-8 text-gray-500"
              >
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
