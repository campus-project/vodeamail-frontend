export interface SummaryEmailCampaign {
  email_campaign_id: string;
  from_email: string;
  total_group: number;
  total_audience: number;
  total_delivered: number;
  total_clicked: number;
  total_opened: number;
  total_unsubscribe: number;
  last_opened: string;
  last_clicked: string;
  avg_open_duration: number | null;
}
