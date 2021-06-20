import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EmailCampaign } from "../../../../models/EmailCampaign";
import { useParams } from "react-router";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { EmailCampaignRepository } from "../../../../repositories/EmailCampaignRepository";
import { AxiosResponse } from "axios";
import { Resource } from "../../../../interfaces/Resource";
import {
  axiosErrorHandler,
  axiosErrorSaveHandler,
} from "../../../../utilities/helpers/axios.helper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Loading from "../../../../components/ui/Loading";
import {
  Box,
  Grid,
  Hidden,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  Typography,
  withStyles,
} from "@material-ui/core";
import MuiButtonIconRounded from "../../../../components/ui/button/MuiButtonIconRounded";
import { NavigateBefore } from "@material-ui/icons";
import clsx from "clsx";
import useStyles from "./style";
import FormSetting, { EmailCampaignSettingData } from "./FormStep/Setting";
import FormDesign, { EmailCampaignDesignData } from "./FormStep/Design";
import FormPreview, { EmailCampaignPreviewData } from "./FormStep/Preview";
import { useDispatch, useSelector } from "react-redux";
import {
  loadEmailTemplate,
  setCampaignEmailTemplate,
  setDraftEmailCampaign,
  setLastStepEmailCampaign,
} from "../../../../store/actions/campaign.action";
import { useQuerySearch } from "../../../../utilities/hooks/query-search.hook";
import { $clone } from "../../../../utilities/helpers/common.helper";
import moment from "moment";

const defaultValues: EmailCampaign = {
  name: "",
  subject: "",
  from_name: "",
  from: "",
  domain: "",
  send_at: "",
  send_date: new Date(),
  send_time: new Date(),
  is_directly_send: 1,
  email_template_id: "",
  email_template_html: "",
  email_template_image_url: "",
  group_ids: [],
};

const EmailCampaignForm: React.FC<any> = () => {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { from = null } = useQuerySearch();

  const { domain, draftEmailCampaign, lastStep } = useSelector(
    ({ campaign }: any) => ({
      domain: campaign.defaultDomain,
      draftEmailCampaign: campaign.draftEmailCampaign,
      lastStep: campaign.lastStep,
    })
  );

  const isUsingDraft = draftEmailCampaign !== null && from === "template";

  const [step, setStep] = useState(isUsingDraft ? lastStep : 0);
  const steps = ["Setting", "Design", "Preview"];

  const [data, setData] = useState<EmailCampaign>(
    isUsingDraft ? draftEmailCampaign : { ...defaultValues, domain }
  );
  const [onFetchData, setOnFetchData] = useState<boolean>(Boolean(id));
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    if (!id) {
      return;
    }

    if (isMounted.current) {
      setOnFetchData(true);
    }

    await EmailCampaignRepository.show(id, {
      relations: ["groups", "email_template"],
    })
      .then((resp: AxiosResponse<Resource<EmailCampaign>>) => {
        if (isMounted.current) {
          const { data: emailCampaign } = resp.data;

          setData({
            ...emailCampaign,
            send_date: moment(emailCampaign.send_at).toDate(),
            send_time: moment(emailCampaign.send_at).toDate(),
          });
          setOnFetchData(false);
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setOnFetchData(false);
          axiosErrorHandler(e, enqueueSnackbar);
        }
      });
  }, [false]);

  const { errors, setError, reset } = useForm<EmailCampaign>({
    mode: "onChange",
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required(),
      })
    ),
    defaultValues: useMemo(() => {
      (async () => {
        await loadData();
      })();

      return data;
    }, [id, loadData]),
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  useEffect(() => {
    dispatch(loadEmailTemplate());

    return () => {
      dispatch(setCampaignEmailTemplate([]));
    };
  }, []);

  useEffect(() => {
    if (isUsingDraft) {
      setDraftEmailCampaign(null);
      setLastStepEmailCampaign(0);
    }
  }, []);

  const onNextSetting = (emailCampaignSetting: EmailCampaignSettingData) => {
    setData((nodes) => ({
      ...nodes,
      ...emailCampaignSetting,
    }));
    setStep(1);
  };

  const onNextDesign = (emailCampaignDesign: EmailCampaignDesignData) => {
    setData((nodes) => ({
      ...nodes,
      ...emailCampaignDesign,
    }));
    setStep(2);
  };

  const onSubmitPreview = (emailCampaignPreview: EmailCampaignPreviewData) => {
    setData((nodes) => ({
      ...nodes,
      ...emailCampaignPreview,
    }));

    onSubmit().then(() => {});
  };

  const onSubmit = async () => {
    setLoading(true);

    const formData = $clone(data);

    Object.assign(formData, {
      is_directly_send: Boolean(formData.is_directly_send),
    });

    await (id
      ? EmailCampaignRepository.update(id, formData)
      : EmailCampaignRepository.create(formData)
    )
      .then(() => {
        if (isMounted.current) {
          setLoading(false);

          enqueueSnackbar(
            `Successfully ${id ? "update" : "create"} email campaign.`,
            {
              variant: "success",
            }
          );

          navigate("/apps/campaign/email-campaign");
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setLoading(false);

          axiosErrorSaveHandler(e, setError, enqueueSnackbar);
        }
      });
  };

  return (
    <>
      {onFetchData ? <Loading /> : null}
      <Box style={onFetchData ? { display: "none" } : {}}>
        <Box
          mb={3}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
        >
          <Box mr={1.5}>
            <MuiButtonIconRounded
              onClick={() => navigate("/apps/campaign/email-campaign")}
            >
              <NavigateBefore />
            </MuiButtonIconRounded>
          </Box>
          <Typography variant={"h5"}>
            {id ? "Update " : "Create "} Email Campaign
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Hidden smDown>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Stepper
                    activeStep={step}
                    className={classes.campaignStepperContainer}
                    connector={<CampaignStepIconConnector />}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel
                          StepIconComponent={CampaignStepIcon}
                          className={classes.campaignStepper}
                        >
                          <Typography variant={"subtitle2"}>{label}</Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
              </Grid>
            </Grid>
          </Hidden>

          <Grid item xs={12}>
            <Box style={step === 0 ? {} : { display: "none" }}>
              <FormSetting data={data} errors={errors} onNext={onNextSetting} />
            </Box>

            <Box style={step === 1 ? {} : { display: "none" }}>
              <FormDesign
                data={data}
                errors={errors}
                onPrevious={() => setStep(0)}
                onNext={onNextDesign}
              />
            </Box>

            <Box style={step === 2 ? {} : { display: "none" }}>
              <FormPreview
                data={data}
                onPrevious={() => setStep(1)}
                onNext={onSubmitPreview}
                loading={loading}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

const CampaignStepIconConnector = withStyles((theme) => ({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  completed: {
    "& $line": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  line: {
    height: 2,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}))(StepConnector);

const CampaignStepIcon: React.FC<StepIconProps & { icon: any }> = (props) => {
  const icons = ["vicon-new-document", "vicon-design", "vicon-inspection"];

  const { active, completed, icon } = props;
  const classes = useStyles();

  return (
    <i
      className={clsx(`icon ${icons[icon - 1]}`, {
        [classes.campaignStepperActive]: active,
        [classes.campaignStepperCompleted]: completed,
      })}
    />
  );
};

export default EmailCampaignForm;
