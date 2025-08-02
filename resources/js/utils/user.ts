import type { User } from '@/types';

export function getDisplayName(user: User): string {
    return [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(' ') || 'Unnamed User';
}

export function getFirstName(user: User): string {
    return user.firstName || 'Unnamed';
}

export function getMiddleName(user: User): string {
    return user.middleName ?? '';
}

export function getLastName(user: User): string {
    return user.lastName || 'Unnamed';
}
