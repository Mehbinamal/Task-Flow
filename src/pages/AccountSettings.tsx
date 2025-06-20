import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Camera, Save, User, Lock } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';

interface ProfileForm {
  name: string;
  bio: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      name: 'John Doe',
      bio: 'Productivity enthusiast and task management expert.',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    console.log('Profile update:', data);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // TODO: Implement actual profile update
    }, 1000);
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    
    setIsLoading(true);
    console.log('Password update');
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      passwordForm.reset();
      // TODO: Implement actual password update
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Account Settings</h1>
          </div>
          <ModeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=face" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">{localStorage.getItem('email')}</p>
                </div>
                
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant={activeTab === 'password' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('password')}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Password
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        rules={{
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters',
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your full name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Tell us a bit about yourself..."
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'password' && (
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        rules={{
                          required: 'Current password is required',
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Enter current password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        rules={{
                          required: 'New password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Enter new password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        rules={{
                          required: 'Please confirm your new password',
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Confirm new password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isLoading}>
                        <Lock className="h-4 w-4 mr-2" />
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
