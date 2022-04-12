interface AvailableBanks {
  bank_id: number;
  code: string;
  icon: string;
  id: number;
  max_deposit: number;
  min_deposit: number;
  name: string;
  prefill: boolean;
  transfer_time: string;
}

export default AvailableBanks;
