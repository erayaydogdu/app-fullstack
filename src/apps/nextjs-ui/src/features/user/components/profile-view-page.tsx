import { getProfile } from '@/features/user/actions/usersActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

export default async function ProfileViewPage() {
  try {
    const profile = await getProfile();

    if (!profile) {
      return <div className="p-4 md:p-8">No profile data found.</div>;
    }

    const profileName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unnamed Profile';

    return (
      <div className="p-4 md:p-8 space-y-4">
        <div className="flex items-center gap-4">
          <Heading title="Profile Details" description="View information about your profile." />
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>{profileName}</CardTitle>
            <CardDescription>Profile ID: {profile.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{profile.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Username</p>
              <p>{profile.userName || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <p>{profile.phoneNumber || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p>{profile.isActive ? 'Active' : 'Inactive'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email Confirmed</p>
              <p>{profile.emailConfirmed ? 'Yes' : 'No'}</p>
            </div>
            {/* Add other relevant fields here */}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return <div className="p-4 md:p-8">Error fetching profile data.</div>;
  }
}
