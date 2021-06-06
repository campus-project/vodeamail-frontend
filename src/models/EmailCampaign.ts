import { Group } from "./Group";

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
}
