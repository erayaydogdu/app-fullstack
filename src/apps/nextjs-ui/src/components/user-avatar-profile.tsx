import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
}: UserAvatarProfileProps) {
  const { data: session } = useSession();
  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
        <AvatarFallback className='rounded-lg'>
          {session?.user?.name?.slice(0, 2)?.toUpperCase() || 'CN'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{session?.user?.name || ''}</span>
          <span className='truncate text-xs'>
            {session?.user?.email || ''}
          </span>
        </div>
      )}
    </div >
  );
}
