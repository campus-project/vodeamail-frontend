import React, { useEffect, useState } from "react";
import { EmailCampaign } from "../../../../../models/EmailCampaign";
import useStyles from "../style";
import { Controller, useForm } from "react-hook-form";
import { EmailCampaignSettingData } from "./Setting";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import _ from "lodash";
import { EmailTemplate } from "../../../../../models/EmailTemplate";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import MuiCard from "../../../../../components/ui/card/MuiCard";
import MuiCardHead from "../../../../../components/ui/card/MuiCardHead";
import MuiCardBody from "../../../../../components/ui/card/MuiCardBody";
import MuiTextField from "../../../../../components/ui/form/MuiTextField";
import { Alert } from "@material-ui/lab";
import MuiFormAction from "../../../../../components/ui/form/MuiFormAction";
import { useNavigate } from "react-router-dom";
import {
  setDraftEmailCampaign,
  setLastStepEmailCampaign,
} from "../../../../../store/actions/campaign.action";

export interface EmailCampaignDesignData extends Partial<EmailCampaign> {}

interface FormDesignProps {
  data: EmailCampaign;
  errors: { [key: string]: any };
  onPrevious: () => void;
  onNext: (data: EmailCampaignDesignData) => void;
}

const FormDesign: React.FC<FormDesignProps> = (props) => {
  const { onPrevious, onNext, errors: feedBackErrors, data } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailTemplateSearch, setEmailTemplateSearch] = useState<string>("");
  const { emailTemplates } = useSelector(({ campaign }: any) => ({
    emailTemplates: campaign.emailTemplates,
  }));

  const { handleSubmit, errors, control, reset } =
    useForm<EmailCampaignSettingData>({
      mode: "onChange",
      resolver: yupResolver(
        yup.object().shape({
          email_template_id: yup.string().required().label("design"),
        })
      ),
      defaultValues: data,
    });

  useEffect(() => {
    reset(data);
  }, [data]);

  const handleChangeEmailTemplateSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailTemplateSearch(event.target.value);
  };

  const realEmailTemplates = (): EmailTemplate[] => {
    return !emailTemplateSearch
      ? emailTemplates
      : emailTemplates.filter(
          (emailTemplate: EmailTemplate) =>
            emailTemplate.name.indexOf(emailTemplateSearch) !== -1
        );
  };

  const handleCreateDesign = () => {
    dispatch(setDraftEmailCampaign(data));
    dispatch(setLastStepEmailCampaign(1));

    navigate("/apps/campaign/email-template/create?from=campaign");
  };

  const getError = (key: string) =>
    _.get(errors, key) || _.get(feedBackErrors, key);

  const hasError = (key: string) =>
    _.has(errors, key) || _.has(feedBackErrors, key);

  const onSubmit = (formData: EmailCampaignDesignData) => {
    const selectedEmailTemplate = emailTemplates.find(
      (emailTemplate: EmailTemplate) =>
        emailTemplate.id === formData.email_template_id
    );

    Object.assign(formData, {
      email_template_html: selectedEmailTemplate?.html || "",
    });

    onNext(formData);
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={6} xs={12}>
        <MuiCard>
          <MuiCardHead>
            <Typography variant={"h6"}>Design</Typography>
          </MuiCardHead>

          <MuiCardBody>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {hasError("email_template_id") ? (
                    <Grid item xs={12}>
                      <Alert severity="error">
                        {getError("email_template_id.message")}
                      </Alert>
                    </Grid>
                  ) : null}

                  <Grid item md={6} xs={12}>
                    <Box mb={3}>
                      <MuiTextField
                        value={emailTemplateSearch}
                        onChange={handleChangeEmailTemplateSearch}
                        placeholder={"Search"}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Box className={classes.templateItemGroupContainer}>
                  <Controller
                    control={control}
                    name={"email_template_id"}
                    defaultValue={data.email_template_id}
                    render={({ value, onChange, ...others }) => (
                      <RadioGroup
                        {...others}
                        onChange={(event, newValue: string) =>
                          onChange(newValue)
                        }
                        value={value}
                        className={classes.templateItemGroup}
                      >
                        {realEmailTemplates().map(
                          (emailTemplate: EmailTemplate) => (
                            <FormControlLabel
                              value={emailTemplate.id}
                              control={<Radio color="primary" />}
                              key={emailTemplate.id}
                              checked={value === emailTemplate.id}
                              label={
                                <TemplateItem
                                  name={emailTemplate.name}
                                  url={emailTemplate.image_url}
                                />
                              }
                            />
                          )
                        )}
                      </RadioGroup>
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </MuiCardBody>
        </MuiCard>
      </Grid>

      <Grid item md={6} xs={12}>
        <Box className={classes.templateCreate}>
          <Typography variant={"body1"}>Or Create Design</Typography>
          <Box mt={1}>
            <Button
              variant="contained"
              color={"primary"}
              onClick={handleCreateDesign}
            >
              Create Design
            </Button>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <MuiFormAction
          title={"Next"}
          cancel={"Previous"}
          save={"Continue"}
          onCancel={onPrevious}
          onSave={handleSubmit(onSubmit)}
        />
      </Grid>
    </Grid>
  );
};

const TemplateItem: React.FC<any> = ({ url, name }) => {
  return (
    <Box className={"template-item"}>
      <Typography className={"name"} variant={"body2"}>
        {name}
      </Typography>
      <img src={url} alt={name} />
    </Box>
  );
};

export default FormDesign;
