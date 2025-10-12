'use client';

/**
 * Admin users management page
 * Allows coaches to manage team members and assign team levels
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserTable } from '@/components/admin/UserTable';
import { UserDetailsDialog } from '@/components/admin/UserDetailsDialog';
import { useTeamManagement } from '@/lib/hooks/useTeamManagement';
import { useUser } from '@/lib/hooks/useUser';
import { User } from '@/lib/types/database.types';
import { Gender, TeamLevel, UserRole } from '@/lib/constants';
import { Search, Filter, Users as UsersIcon, Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const { profile } = useUser();
  const {
    users,
    loading,
    filters,
    updateTeamLevel,
    bulkAssignTeamLevel,
    getUserDetails,
    applyFilters,
    clearFilters,
  } = useTeamManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<Gender | 'all'>('all');
  const [teamLevelFilter, setTeamLevelFilter] = useState<TeamLevel | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleSearch = () => {
    applyFilters({
      search: searchTerm,
      gender: genderFilter === 'all' ? undefined : genderFilter,
      teamLevel: teamLevelFilter === 'all' ? undefined : teamLevelFilter,
      role: roleFilter === 'all' ? undefined : roleFilter,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setGenderFilter('all');
    setTeamLevelFilter('all');
    setRoleFilter('all');
    clearFilters();
  };

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    const details = await getUserDetails(user.id);
    setUserDetails(details);
    setDetailsDialogOpen(true);
  };

  const handleBulkAssign = async (teamLevel: TeamLevel) => {
    if (selectedUserIds.length === 0) return;
    await bulkAssignTeamLevel(selectedUserIds, teamLevel);
    setSelectedUserIds([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#800000]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-gray-600 mt-1">Manage team members and assign team levels</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={genderFilter} onValueChange={(val) => setGenderFilter(val as Gender | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value={Gender.MEN}>Men</SelectItem>
                <SelectItem value={Gender.WOMEN}>Women</SelectItem>
              </SelectContent>
            </Select>
            <Select value={teamLevelFilter} onValueChange={(val) => setTeamLevelFilter(val as TeamLevel | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Team Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value={TeamLevel.JV}>JV</SelectItem>
                <SelectItem value={TeamLevel.VARSITY}>Varsity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val as UserRole | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={UserRole.PLAYER}>Player</SelectItem>
                <SelectItem value={UserRole.CAPTAIN}>Captain</SelectItem>
                <SelectItem value={UserRole.COACH}>Coach</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSearch}>Apply Filters</Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedUserIds.length > 0 && profile?.role === UserRole.COACH && (
        <Card className="border-[#800000]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleBulkAssign(TeamLevel.JV)}>
                  Assign to JV
                </Button>
                <Button size="sm" onClick={() => handleBulkAssign(TeamLevel.VARSITY)}>
                  Assign to Varsity
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Team Members
            </div>
            <span className="text-sm font-normal text-gray-600">{users.length} users</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <UserTable
              users={users}
              currentUserRole={profile?.role || UserRole.PLAYER}
              onTeamLevelChange={updateTeamLevel}
              onUserClick={handleUserClick}
              onSelectionChange={setSelectedUserIds}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">No users found</div>
          )}
        </CardContent>
      </Card>

      <UserDetailsDialog
        user={selectedUser}
        userDetails={userDetails}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        currentUserRole={profile?.role || UserRole.PLAYER}
        onTeamLevelChange={updateTeamLevel}
      />
    </div>
  );
}
