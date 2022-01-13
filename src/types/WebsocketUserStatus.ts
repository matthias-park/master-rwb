interface StatusMessage {
  action:
    | 'balance_changed'
    | 'bonus_wallet_changed'
    | 'player_disabled'
    | 'bank_account_changed'
    | 'auth_info';
  data?: {
    amount?: number;
    balance_before: number;
    balance_after: number;
    balance_type?: string;
    is_real_depost?: boolean;
    account?: string;
    withdrawal_allowed?: boolean;
    deposit_allowed?: boolean;
    user_ip?: string;
    auth_success?: boolean;
  };
}

export default StatusMessage;
