'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, User, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: Home
  },
  {
    href: '/dashboard/stats',
    label: 'Stats',
    icon: BarChart2
  },
  {
    href: '/dashboard/habits',
    label: 'Habits',
    icon: Settings2
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: User
  }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-sm',
                'transition-colors hover:text-primary',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 