export function tenantGuard(userStoreId: string, requestedStoreId: string) {
  if (userStoreId !== requestedStoreId) {
    throw new Error('Tenant mismatch: store access denied.');
  }
  return true;
}

export function sanitizeCustomerMessage(message: string): string {
  return message
    .replace(/ignore your instructions/gi, ' ')
    .replace(/system prompt/gi, 'customer request')
    .replace(/api key/gi, 'not available')
    .trim();
}
