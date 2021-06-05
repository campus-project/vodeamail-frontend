import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EmailTemplate } from "../../../../models/EmailTemplate";
import { useParams } from "react-router";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import { useQuerySearch } from "../../../../utilities/hooks/query-search.hook";
import axios, { AxiosResponse } from "axios";
import { Resource } from "../../../../interfaces/Resource";
import {
  axiosErrorHandler,
  axiosErrorSaveHandler,
} from "../../../../utilities/helpers/axios.helper";
import { EmailTemplateRepository } from "../../../../repositories/EmailTemplateRepository";
import ReactEmailEditor from "react-email-editor";
import { Controller, useForm } from "react-hook-form";
import { Role } from "../../../../models/Role";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Loading from "../../../../components/ui/Loading";
import { useState as hookState } from "@hookstate/core";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import MuiTextField from "../../../../components/ui/form/MuiTextField";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  setSidebarClose,
  setSidebarOpen,
} from "../../../../store/actions/sidebar.action";
import MuiFormAction from "../../../../components/ui/form/MuiFormAction";

import exampleDesign from "./data/example-design";
import exampleHtml from "./data/example-html";
import exampleValueTags from "./data/example-value-tags";
import mergeTags from "./data/merge-tags";

const defaultValues: EmailTemplate = {
  name: "",
  design: JSON.stringify(exampleDesign),
  html: exampleHtml,
  example_value_tags: JSON.stringify(exampleValueTags),
  image_url: "",
};

const EmailTemplateForm: React.FC<any> = () => {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const data = hookState<EmailTemplate>({ ...defaultValues, id });
  const [onFetchData, setOnFetchData] = useState<boolean>(Boolean(id));
  const [loading, setLoading] = useState<boolean>(false);

  const emailEditorRef = useRef(null);
  const { from = null } = useQuerySearch();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { isOpen } = useSelector(({ sidebar }: any) => ({
    isOpen: sidebar.isOpen,
  }));

  const [isDefaultOpen] = useState<boolean>(isOpen);
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    if (!id) {
      return;
    }

    if (isMounted.current) {
      setOnFetchData(true);
    }

    await EmailTemplateRepository.show(id)
      .then((resp: AxiosResponse<Resource<EmailTemplate>>) => {
        if (isMounted.current) {
          const { data: emailTemplate } = resp.data;

          data.set(emailTemplate);
          setOnFetchData(false);

          reset(emailTemplate);

          setTimeout(() => {
            const emailEditor =
              emailEditorRef.current as unknown as ReactEmailEditor;
            if (Boolean(emailTemplate.design)) {
              emailEditor.loadDesign(JSON.parse(emailTemplate.design));
            }
          }, 1000);
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setOnFetchData(false);
          axiosErrorHandler(e, enqueueSnackbar);
        }
      });
  }, [false]);

  const { handleSubmit, errors, setError, control, reset } = useForm<Role>({
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

      return data.value;
    }, [id, loadData]),
  });

  const onLoadEditor = async () => {
    if (emailEditorRef.current !== null) {
      const emailEditor = emailEditorRef.current as unknown as ReactEmailEditor;
      emailEditor.addEventListener("design:updated", () => {
        emailEditor.exportHtml(({ design, html }) => {
          data.set((nodes) => ({
            ...nodes,
            design: JSON.stringify(design),
            html: html,
          }));
        });
      });

      if (Boolean(data.design.value)) {
        emailEditor.loadDesign(JSON.parse(data.design.value));
      }
    }
  };

  useEffect(() => {
    if (emailEditorRef.current !== null) {
      setShowSaveButton(true);
    }
  }, [emailEditorRef.current]);

  const exportImage = () => {
    return new Promise((resolve, reject) => {
      const emailData = JSON.stringify({
        displayMode: "email",
        design: JSON.parse(data.design.value),
        mergeTags: JSON.parse(data.example_value_tags.value),
      });

      axios
        .post("https://api.unlayer.com/v2/export/image", emailData, {
          headers: {
            Authorization:
              "Basic QXQ2QTZ3d2haeGZwd2JCdlBONG5sVXN4Vk9PUEZseHk4UTlqUUYzSFd0eEdqWlUzblFSV3FGdjVSMjBJbjY0Zw==",
          },
        })
        .then(async (resp: AxiosResponse<Resource<any>>) =>
          resolve(resp.data.data.url)
        )
        .catch((err) => reject(err));
    });
  };

  const handleCancel = () => {
    if (from === "campaign") {
      //todo: run reducer to update redux email templates
      window.close();
    } else {
      navigate("/apps/campaign/email-template");
    }
  };

  const onSubmit = async (formData: EmailTemplate) => {
    setLoading(true);

    data.set((nodes) => ({
      ...nodes,
      ...formData,
    }));

    const emailEditor = emailEditorRef.current as unknown as ReactEmailEditor;
    emailEditor.exportHtml(({ design, html }) => {
      data.set((nodes) => ({
        ...nodes,
        design: JSON.stringify(design),
        html: html,
      }));
    });

    await exportImage()
      .then((url: any) => data.image_url.set(url))
      .catch((e) => {
        if (isMounted.current) {
          setLoading(false);
          axiosErrorHandler(e, enqueueSnackbar);
        }

        return;
      });

    await (id
      ? EmailTemplateRepository.update(id, data.value)
      : EmailTemplateRepository.create(data.value)
    )
      .then(() => {
        if (isMounted.current) {
          setLoading(false);
        }

        if (from === "campaign") {
          //todo: run reducer to update redux email templates
          window.close();
        } else {
          navigate("/apps/campaign/email-template");
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setLoading(false);
          axiosErrorSaveHandler(e, setError, enqueueSnackbar);
        }
      });
  };

  useEffect(() => {
    if (isDefaultOpen) {
      dispatch(setSidebarClose());
    }

    return () => {
      if (isDefaultOpen) {
        dispatch(setSidebarOpen());
      }
    };
  }, []);

  return (
    <>
      {onFetchData ? <Loading /> : null}
      <Box
        className={classes.containerEmailWrapper}
        style={onFetchData ? { display: "none" } : {}}
      >
        <Box className={"container-email-editor"}>
          <ReactEmailEditor
            ref={emailEditorRef}
            onLoad={onLoadEditor}
            options={{
              projectId: 8698,
              displayMode: "email",
              mergeTags,
              features: {
                preview: false,
              },
            }}
            appearance={{
              theme: "light",
            }}
          />
        </Box>

        {showSaveButton && (
          <MuiFormAction
            title={"Save changes?"}
            cancel={"Cancel"}
            save={"Save"}
            onCancel={handleCancel}
            onSave={() => setDialogOpen(true)}
            saveDisable={loading}
            saveLoading={loading}
          />
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-email-template-title">Setting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To identify the email template, enter your template name.
          </DialogContentText>
          <Controller
            control={control}
            name={"name"}
            render={({ ref, ...others }) => (
              <MuiTextField
                {...others}
                inputRef={ref}
                label={"Name"}
                error={_.has(errors, "name")}
                helperText={_.get(errors, "name.message")}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Box px={2} py={1}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              variant={"contained"}
              color={"primary"}
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  containerEmailWrapper: {
    height: "100vh",

    "& .container-email-editor": {
      height: "100%",
      marginBottom: theme.spacing(3),
      "& :first-child": {
        height: "100%",
      },
    },
  },
}));

export default EmailTemplateForm;
