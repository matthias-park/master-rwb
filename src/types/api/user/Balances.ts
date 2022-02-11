export interface NullableUserBalances {
  playable_balance?: number;
  bonus_balance?: number;
  withdrawable_balance?: number;
  locked_balance?: number;
}

interface UserBalances {
  playable_balance: number;
  bonus_balance: number;
  withdrawable_balance: number;
  locked_balance: number;
}

export default UserBalances;
