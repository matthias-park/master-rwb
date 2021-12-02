export interface Message {
  id: number;
  opened: 0 | 1;
  clicked: 0 | 1;
  create_time: number;
  expiration_time: number;
  message: {
    // Data to render the message
    title: string;
    alert: string;
    icon?: string;
    style?: any;
    url_mode?: 'outside';
    url_blank?: boolean;
    deeplink?: string;
    url?: string;
  };
}
export interface MessageList {
  items: Message[];
  more: boolean;
  badge: number;
}
