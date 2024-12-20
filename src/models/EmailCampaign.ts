import { Group } from "./Group";
import { SummaryEmailCampaign } from "./SummaryEmailCampaign";
import { SummaryEmailCampaignAnalytic } from "./SummaryEmailCampaignAnalytic";

export interface EmailCampaign {
  id?: string;
  name: string;
  subject: string;
  from_name: string;
  from: string;
  domain: string;
  send_at: string;
  send_date: string | Date;
  send_time: string | Date;
  is_directly_send: number;
  email_template_id: string;
  email_template_html: string;
  email_template_image_url: string;

  group_ids?: string[];
  groups?: Group[];

  summary?: SummaryEmailCampaign;
  summary_email_campaign_analytics?: SummaryEmailCampaignAnalytic[];
}
