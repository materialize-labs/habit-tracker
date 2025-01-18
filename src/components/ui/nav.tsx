'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

export function MainNav() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const links = [
    {
      href: '/dashboard',
      label: 'Overview',
    },
    {
      href: '/dashboard/tracker',
      label: 'Habit Tracker',
    },
    {
      href: '/dashboard/stats',
      label: 'Statistics',
    },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === link.href
              ? 'text-black dark:text-white'
              : 'text-muted-foreground'
          )}
        >
          {link.label}
        </Link>
      ))}
      <button
        onClick={handleSignOut}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-red-500 ml-auto"
      >
        Sign Out
      </button>
    </nav>
  );
} 