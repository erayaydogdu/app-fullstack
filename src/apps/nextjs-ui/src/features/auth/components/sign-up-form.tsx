'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { selfRegisterUser } from '../actions/authActions';

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const result = await selfRegisterUser(
        {
          firstName: "",
          lastName: "",
          email: email,
          userName: email,
          password: password,
          confirmPassword: confirmPassword,
          phoneNumber: ""
        },
        organisation
      );

      if (result) {
        // Optionally, you could automatically sign them in here using:
        //await signIn('credentials', { email, password, organisation ,redirect: false });
        router.push('/dashboard'); // Or wherever you want them to go after sign-up/sign-in
      } else {
        // Handle errors from the backend API
        const errorData = {
          message: 'An unknown error occurred during sign up.'
        };
        setError(errorData.message || 'An error occurred while signing up');
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setError('An error occurred while signing up');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Sign Up</CardTitle>
          <CardDescription>Create an account to get started!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && <p className='text-red-500'>{error}</p>}
            <div className='grid gap-6'>
              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Organisation</Label>
                  <Input
                    id='organisation'
                    type='organisation'
                    placeholder='Sky Team'
                    required
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='m@example.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='********'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='password'>Confirm Password</Label>
                  <Input
                    id='confirmPassword'
                    type='password'
                    placeholder='********'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type='submit' className='w-full'>
                  Register
                </Button>
              </div>
              <div className='text-center text-sm'>
                Do you already have an account?{' '}
                <a
                  href='/auth/sign-in'
                  className='underline underline-offset-4'
                >
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className='text-muted-foreground [&_a]:hover:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4'>
        By clicking register, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
