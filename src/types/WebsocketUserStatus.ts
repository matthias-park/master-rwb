interface StatusMessage {
  action: 'balance_changed' | 'bonus_wallet_changed' | 'player_disabled';
  data?: {
    amount?: number;
    balance_before: number;
    balance_after: number;
    balance_type?: string;
    is_real_depost?: boolean;
  };
}

export default StatusMessage;
