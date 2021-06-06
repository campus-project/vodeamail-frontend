import { EmailTemplate } from "../../models/EmailTemplate";
import {
  CAMPAIGN_SET_DRAFT_EMAIL_CAMPAIGN,
  CAMPAIGN_SET_EMAIL_TEMPLATE,
  CAMPAIGN_SET_LAST_STEP_EMAIL_CAMPAIGN,
} from "../actions/campaign.action";
import { EmailCampaign } from "../../models/EmailCampaign";

const defaultDomain = () =>
  process.env.REACT_APP_CAMPAIGN_DEFAULT_DOMAIN || "vodeacloud.com";

export interface ICampaignState {
  defaultDomain: string;
  emailTemplates: EmailTemplate[];
  draftEmailCampaign: EmailCampaign | null;
  lastStep: number;
}

export interface ICampaignAction {
  type: string;
  payload: any;
}

const initialState: ICampaignState = {
  defaultDomain: defaultDomain(),
  emailTemplates: [],
  draftEmailCampaign: null,
  lastStep: 0,
};

export const campaign = function (
  state: ICampaignState = initialState,
  action: ICampaignAction
) {
  switch (action.type) {
    case CAMPAIGN_SET_EMAIL_TEMPLATE:
      return {
        ...state,
        emailTemplates: action.payload,
      };
    case CAMPAIGN_SET_DRAFT_EMAIL_CAMPAIGN:
      return {
        ...state,
        draftEmailCampaign: action.payload,
      };
    case CAMPAIGN_SET_LAST_STEP_EMAIL_CAMPAIGN:
      return {
        ...state,
        lastStep: action.payload,
      };
    default:
      return state;
  }
};
