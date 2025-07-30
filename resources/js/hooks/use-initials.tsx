import type { User } from '@/types';


export function useInitials() {
  return (user?: { firstName?: string; middleName?: string; lastName?: string }): string => {
    if (!user) return '';

    const { firstName, middleName, lastName } = user;

    const first = firstName?.[0]?.toUpperCase() || '';
    const middle = middleName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';

    return `${first}${middle}${last}` || '';
  };
}
