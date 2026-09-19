export type IntegrationStatus = 'Not Connected' | 'Connected' | 'Paused';

export interface ChannelAdapter {
  provider: string;
  status: IntegrationStatus;
  receiveMessage(): Promise<string | null>;
  sendMessage(message: string, to: string): Promise<boolean>;
  markAsRead(conversationId: string): Promise<boolean>;
  getConversation(conversationId: string): Promise<Record<string, unknown> | null>;
  handleWebhook(payload: unknown): Promise<boolean>;
}

export class DemoModeAdapter implements ChannelAdapter {
  provider = 'Demo Chat';
  status: IntegrationStatus = 'Connected';

  async receiveMessage(): Promise<string | null> {
    return 'Demo customer message received inside the app.';
  }

  async sendMessage(message: string): Promise<boolean> {
    return Boolean(message && message.trim());
  }

  async markAsRead(): Promise<boolean> {
    return true;
  }

  async getConversation(): Promise<Record<string, unknown> | null> {
    return { mode: 'demo', connected: true };
  }

  async handleWebhook(): Promise<boolean> {
    return true;
  }
}

export const channelCatalog = [
  { provider: 'Instagram', status: 'Not Connected', requiresCredentials: true },
  { provider: 'WhatsApp', status: 'Not Connected', requiresCredentials: true },
  { provider: 'Messenger', status: 'Not Connected', requiresCredentials: true },
  { provider: 'Telegram', status: 'Not Connected', requiresCredentials: true },
  { provider: 'Website Chat', status: 'Connected', requiresCredentials: false }
] as const;

export function integrationRequirements(provider: string): string {
  switch (provider) {
    case 'Instagram':
      return 'App ID, App Secret, Page Access Token, Instagram Business Account permissions.';
    case 'WhatsApp':
      return 'WhatsApp Business Account ID, webhook secret, phone number, access token.';
    case 'Messenger':
      return 'Page access token and verification token.';
    case 'Telegram':
      return 'Bot token and webhook URL.';
    case 'Website Chat':
      return 'Embed script and chat domain.';
    default:
      return 'No credentials configured yet.';
  }
}
