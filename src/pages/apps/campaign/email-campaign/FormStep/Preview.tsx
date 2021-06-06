import React from "react";
import { EmailCampaign } from "../../../../../models/EmailCampaign";
import { Grid, Typography } from "@material-ui/core";
import MuiCard from "../../../../../components/ui/card/MuiCard";
import MuiCardHead from "../../../../../components/ui/card/MuiCardHead";
import MuiCardBody from "../../../../../components/ui/card/MuiCardBody";
import DateDateTime from "../../../../../components/data/Datetime";
import MuiFormAction from "../../../../../components/ui/form/MuiFormAction";

export interface EmailCampaignPreviewData extends Partial<EmailCampaign> {}

interface FormPreviewProps {
  data: EmailCampaign;
  onPrevious: () => void;
  onNext: (data: EmailCampaignPreviewData) => void;
  loading: boolean;
}

const FormPreview: React.FC<FormPreviewProps> = (props) => {
  const { onPrevious, onNext, data, loading } = props;

  const onSubmit = () => onNext(data);

  return (
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <MuiCard>
          <MuiCardHead>
            <Typography variant={"h6"}>Preview</Typography>
          </MuiCardHead>

          <MuiCardBody>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.email_template_html || "",
                  }}
                />
              </Grid>
            </Grid>
          </MuiCardBody>
        </MuiCard>
      </Grid>

      <Grid item md={4} xs={12}>
        <MuiCard>
          <MuiCardHead>
            <Typography variant={"h6"}>Summary</Typography>
          </MuiCardHead>

          <MuiCardBody>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant={"caption"}>Name</Typography>
                <Typography variant={"subtitle2"}>{data.name}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant={"caption"}>Subject</Typography>
                <Typography variant={"subtitle2"}>{data.subject}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant={"caption"}>Email From</Typography>
                <Typography variant={"subtitle2"}>
                  {data.from_name} {`(${data.from}@${data.domain})`}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant={"caption"}>Schedule</Typography>
                <Typography variant={"subtitle2"}>
                  {data.is_directly_send ? (
                    "Send Immediately"
                  ) : (
                    <DateDateTime data={data.send_at || ""} />
                  )}
                </Typography>
              </Grid>

              {Array.isArray(data.groups) && data.groups.length ? (
                <Grid item xs={12}>
                  <Typography variant={"caption"}>Group</Typography>

                  {data.groups.map((group) => (
                    <Typography variant={"subtitle2"} key={group.id}>
                      {group.name}
                    </Typography>
                  ))}
                </Grid>
              ) : null}
            </Grid>
          </MuiCardBody>
        </MuiCard>
      </Grid>

      <Grid item xs={12}>
        <MuiFormAction
          title={"Save changes?"}
          cancel={"Cancel"}
          save={"Save"}
          onCancel={onPrevious}
          onSave={onSubmit}
          saveDisable={loading}
          saveLoading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default FormPreview;
