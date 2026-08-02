// ===========================================================================
// Custody — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

export interface CustodyAssetTile {
  id: string;
  asset: string;
  balance: string;
  clients: number;
}

export interface PoolBalance {
  id: string;
  asset: string;
  chain: string;
  balance: string;
  updatedAt: string;
}

export type WithdrawalStatus =
  | "Pending"
  | "Processing"
  | "Approved"
  | "Completed"
  | "Failed";

export interface CustodyWithdrawal {
  id: string;
  createdAt: string;
  refId: string;
  asset: string;
  amount: string;
  status: WithdrawalStatus;
  reason: string | null;
  /** destination address */
  to: string;
}

export interface FeeSchedule {
  deposit: string;
  withdrawal: string;
  monthly: string;
  approvalRequired: string;
}
