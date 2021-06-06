import { IMenuAction } from "../reducers/menu.reducer";
import { EmailTemplate } from "../../models/EmailTemplate";
import { EmailTemplateRepository } from "../../repositories/EmailTemplateRepository";
import { AxiosResponse } from "axios";
import { Resource } from "../../interfaces/Resource";
import { EmailCampaign } from "../../models/EmailCampaign";

export const CAMPAIGN_SET_EMAIL_TEMPLATE = "[CAMPAIGN] SET EMAIL TEMPLATE";
export const CAMPAIGN_SET_DRAFT_EMAIL_CAMPAIGN =
  "[CAMPAIGN] SET DRAFT EMAIL CAMPAIGN";
export const CAMPAIGN_SET_LAST_STEP_EMAIL_CAMPAIGN =
  "[CAMPAIGN] SET LAST STEP EMAIL CAMPAIGN";

export const setCampaignEmailTemplate = (
  payload: EmailTemplate[]
): IMenuAction => {
  return {
    type: CAMPAIGN_SET_EMAIL_TEMPLATE,
    payload,
  };
};

export const setDraftEmailCampaign = (
  payload: EmailCampaign | null
): IMenuAction => {
  return {
    type: CAMPAIGN_SET_DRAFT_EMAIL_CAMPAIGN,
    payload,
  };
};

export const setLastStepEmailCampaign = (payload: number): IMenuAction => {
  return {
    type: CAMPAIGN_SET_LAST_STEP_EMAIL_CAMPAIGN,
    payload,
  };
};

export function loadEmailTemplate() {
  return async (dispatch: any) => {
    await EmailTemplateRepository.all({
      order_by: "email_template.updated_at",
      sorted_by: "desc",
    })
      .then((resp: AxiosResponse<Resource<EmailTemplate[]>>) => {
        const { data: templates } = resp.data;
        dispatch(setCampaignEmailTemplate(templates));
      })
      .catch();
  };
}
