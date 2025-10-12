'use client';

/**
 * Profile page
 * Displays user profile information (read-only for now)
 */

import { useUser } from '@/lib/hooks/useUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { BRAND_COLORS, UserRole, Gender } from '@/lib/constants';
import { User, Mail, Smartphone, Shield, Users } from 'lucide-react';

export default function ProfilePage() {
  const { profile } = useUser();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${BRAND_COLORS.PRIMARY} transparent ${BRAND_COLORS.PRIMARY} ${BRAND_COLORS.PRIMARY}` }}
          aria-label="Loading"
        />
      </div>
    );
  }

  const getInitials = () => {
    return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.COACH:
        return 'Coach';
      case UserRole.CAPTAIN:
        return 'Team Captain';
      case UserRole.PLAYER:
        return 'Player';
      default:
        return role;
    }
  };

  const getGenderLabel = (gender?: Gender) => {
    if (!gender) return 'Not specified';
    return gender === Gender.MEN ? "Men's Team" : "Women's Team";
  };


  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          My Profile
        </h1>
        <p className="mt-2 text-gray-600">
          View and manage your account information
        </p>
      </div>

      {/* Profile header card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback
                className="text-2xl"
                style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}20`, color: BRAND_COLORS.PRIMARY }}
              >
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-gray-600 mt-1">{profile.email}</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}20`, color: BRAND_COLORS.PRIMARY }}
                >
                  {getRoleLabel(profile.role)}
                </span>
                {profile.gender && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {getGenderLabel(profile.gender)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your account details and team information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Email</span>
              </div>
              <p className="text-gray-900">{profile.email}</p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                <span>Phone Number</span>
              </div>
              <p className="text-gray-900">
                {profile.phone || 'Not provided'}
              </p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Role</span>
              </div>
              <p className="text-gray-900">{getRoleLabel(profile.role)}</p>
            </div>

            {/* Team */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Users className="h-4 w-4" aria-hidden="true" />
                <span>Team</span>
              </div>
              <p className="text-gray-900">{getGenderLabel(profile.gender)}</p>
            </div>

            {/* Member Since */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <User className="h-4 w-4" aria-hidden="true" />
                <span>Member Since</span>
              </div>
              <p className="text-gray-900">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account settings and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1"
              disabled
              aria-label="Edit profile (coming soon)"
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled
              aria-label="Change password (coming soon)"
            >
              Change Password
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Profile editing and password management coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
