import { Roles } from '@/constants/roles';

export function filterItemsByRole<T extends { roles: Roles[] }>(items: T[], role: Roles): T[] {
  return items.filter((item) => item.roles.includes(Roles.All) || item.roles.includes(role));
}
