// ===========================================================================
// Settings — profile + organization cards
// ===========================================================================
import type { OrganizationInfo, ProfileInfo } from "@/types/global";
import { webhookConfig } from "./webhookDeliveries";

export const profileInfo: ProfileInfo = {
  name: "Travls.io",
  email: "service@travls.io",
  role: "Owner",
  environment: "Live",
};

export const organizationInfo: OrganizationInfo = {
  tenant: "Travls Live",
  slug: "travls-live",
  rateLimit: "120/min",
  webhookUrl: webhookConfig.url,
};

export default { profileInfo, organizationInfo };
