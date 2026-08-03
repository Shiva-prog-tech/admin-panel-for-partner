// ===========================================================================
// Webhooks — owned by WebhooksModule.
//
// Endpoint configuration (URL + signing secret) and the delivery log, plus the
// two actions the Configuration card exposes.
// ===========================================================================
import http from "@/utils/axios";
import { Config } from "@/utils/Config";
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { webhookEndpoints } from "@/mockData/webhooks";
import {
  webhookConfig,
  webhookDeliveries,
} from "@/mockData/webhookDeliveries";
import type { Paginated } from "@/types/global";
import type { WebhookConfig, WebhookDelivery, WebhookEndpoint } from "../types";

export const webhooksService = {
  async config(): Promise<WebhookConfig> {
    if (Config.features.mockData) return webhookConfig;
    const { data } = await http.get<WebhookConfig>("/webhooks/config");
    return data;
  },

  async saveUrl(url: string): Promise<WebhookConfig> {
    if (Config.features.mockData) return { ...webhookConfig, url };
    const { data } = await http.put<WebhookConfig>("/webhooks/config", { url });
    return data;
  },

  /** Issues a new signing secret; the previous one stays valid for 24h. */
  async rotateSecret(): Promise<WebhookConfig> {
    if (Config.features.mockData) return webhookConfig;
    const { data } = await http.post<WebhookConfig>("/webhooks/config/rotate");
    return data;
  },

  endpoints: (query: ListQuery = {}): Promise<Paginated<WebhookEndpoint>> =>
    fetchList<WebhookEndpoint>("/webhooks", webhookEndpoints, query),

  deliveries: (query: ListQuery = {}): Promise<Paginated<WebhookDelivery>> =>
    fetchList<WebhookDelivery>("/webhooks/deliveries", webhookDeliveries, query, {
      searchFields: (row) => [row.event, row.refId, row.status, row.error],
      statusOf: (row) => row.status,
      filterFields: { status: (row) => row.status },
      sortValue: (row, key) =>
        (row as unknown as Record<string, string | number | null>)[key] ?? null,
    }),

  async replay(deliveryId: string): Promise<void> {
    if (Config.features.mockData) return;
    await http.post(`/webhooks/deliveries/${deliveryId}/replay`);
  },

  async sendTest(event: string): Promise<void> {
    if (Config.features.mockData) return;
    await http.post("/webhooks/test", { event });
  },

  exportCsv: (query: ListQuery = {}) => exportUrl("webhooks/deliveries", query),
};

export default webhooksService;
