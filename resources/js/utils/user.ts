import type { User } from '@/types';

export function getDisplayName(user: User): string {
    return [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(' ') || 'Unnamed User';
}
