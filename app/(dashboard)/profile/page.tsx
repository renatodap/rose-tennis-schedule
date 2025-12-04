'use client';

/**
 * Profile page
 * Premium, personalized profile experience
 */

import { useUser } from '@/lib/hooks/useUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserRole, Gender } from '@/lib/constants';
import { User, Mail, Smartphone, Shield, Users, Calendar, Edit2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getClient } from '@/lib/supabase/client';
import { useToast } from '@/lib/hooks/use-toast';
import { gradients } from '@/lib/design-tokens';

export default function ProfilePage() {
  const { profile } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = getClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Signed out successfully',
        description: 'See you next time!',
      });
      router.push('/sign-in');
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-maroon-700 border-t-transparent rounded-full animate-spin" />
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
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Hero Section */}
      <div
        className="relative rounded-2xl p-8 sm:p-10 overflow-hidden"
        style={{ background: gradients.maroon }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar size="2xl" ring="default" className="shadow-xl">
            <AvatarFallback className="text-3xl font-bold bg-white text-maroon-700">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-white/80 mt-2 text-sm sm:text-base">{profile.email}</p>

            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              <Badge variant="primary" badgeStyle="solid" size="default">
                {getRoleLabel(profile.role)}
              </Badge>
              {profile.gender && (
                <Badge variant="default" badgeStyle="soft" size="default" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {getGenderLabel(profile.gender)}
                </Badge>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="default"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
            disabled
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Profile Information */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-maroon-700" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Your account details and team information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Email Address</span>
              </div>
              <p className="text-neutral-900 font-medium">{profile.email}</p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                <span>Phone Number</span>
              </div>
              <p className="text-neutral-900 font-medium">
                {profile.phone || (
                  <span className="text-neutral-400 italic">Not provided</span>
                )}
              </p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Role</span>
              </div>
              <p className="text-neutral-900 font-medium">{getRoleLabel(profile.role)}</p>
            </div>

            {/* Team */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
                <Users className="h-4 w-4" aria-hidden="true" />
                <span>Team</span>
              </div>
              <p className="text-neutral-900 font-medium">{getGenderLabel(profile.gender)}</p>
            </div>

            {/* Member Since */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Member Since</span>
              </div>
              <p className="text-neutral-900 font-medium">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>
            Security settings and account actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="h-11 font-semibold"
              disabled
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="h-11 font-semibold"
              disabled
            >
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>

          <div className="pt-4 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 mb-3">
              Need to sign out?
            </p>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full sm:w-auto h-11 font-semibold border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-900">
              Profile editing and password management features coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
