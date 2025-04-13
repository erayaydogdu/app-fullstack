import { Metadata } from 'next';
import { GalleryVerticalEnd } from "lucide-react"
import { SignInForm } from "@/features/auth/components/sign-in-form"

export const metadata: Metadata = {
    title: 'Authentication | Sign In',
    description: 'Sign In page for authentication.'
  };

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          The App
        </a>
        <SignInForm />
      </div>
    </div>
  )
}