export type Permission =
  | 'read_products'
  | 'read_stock'
  | 'read_prices'
  | 'calculate_delivery'
  | 'create_orders'
  | 'schedule_follow_ups'
  | 'change_prices'
  | 'give_discounts'
  | 'cancel_orders';

export type Role = 'owner' | 'manager' | 'support' | 'agent' | 'customer';

const rolePermissions: Record<Role, Permission[]> = {
  owner: [
    'read_products',
    'read_stock',
    'read_prices',
    'calculate_delivery',
    'create_orders',
    'schedule_follow_ups',
    'change_prices',
    'give_discounts',
    'cancel_orders'
  ],
  manager: [
    'read_products',
    'read_stock',
    'read_prices',
    'calculate_delivery',
    'create_orders',
    'schedule_follow_ups'
  ],
  support: ['read_products', 'read_stock', 'read_prices', 'calculate_delivery', 'create_orders'],
  agent: ['read_products', 'read_stock', 'read_prices', 'calculate_delivery', 'create_orders'],
  customer: []
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function assertTenantAccess(userStoreId: string, requestedStoreId: string): boolean {
  return userStoreId === requestedStoreId;
}

export function getAccessiblePermissions(role: Role): Permission[] {
  return rolePermissions[role] ?? [];
}
