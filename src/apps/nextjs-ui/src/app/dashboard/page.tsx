import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect('/auth/sign-in');
  }

  redirect('/dashboard/overview');
}
