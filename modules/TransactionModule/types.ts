// ===========================================================================
// Card transactions — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

export type TxType = "auth" | "purchase" | "refund";

export type TxStatus = "Authorized" | "Success" | "Pending" | "Failed";

export interface Transaction {
  id: string;
  refId: string;
  merchant: string;
  amount: number;
  currency: string;
  type: TxType;
  status: TxStatus;
  last4: string | null;
  createdAt: string;
}
