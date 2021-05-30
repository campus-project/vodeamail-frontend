import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import { useIsMounted } from "./mounted.hook";

export const useDeleteResource = (repository: any) => {
  const isMounted = useIsMounted();
  const confirm = useConfirm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleDelete = (id: string) => {
    return new Promise(async (resolve, reject) => {
      let isDeleteConfirmed = 0;

      await confirm({
        title: "Are you sure want to delete?",
        description: "This action is cannot be undo.",
        confirmationText: "Yes",
        cancellationText: "No",
        cancellationButtonProps: { color: "primary" },
        confirmationButtonProps: { color: "default" },
      })
        .then(() => (isDeleteConfirmed = 1))
        .catch(() => (isDeleteConfirmed = 0));

      if (isDeleteConfirmed) {
        deleteResource(id)
          .then((resp) => resolve(resp))
          .catch((e) => reject(e));
      }
    });
  };

  const deleteResource = (id: string) => {
    return new Promise((resolve, reject) => {
      const loadingKey = enqueueSnackbar("Please wait...", {
        variant: "default",
        autoHideDuration: 5000,
        preventDuplicate: true,
      });

      repository
        .delete(id)
        .then((resp: any) => {
          if (isMounted.current) {
            closeSnackbar(loadingKey);
            enqueueSnackbar("Successfully delete data.", {
              variant: "success",
            });
          }

          resolve(resp);
        })
        .catch((e: any) => {
          if (isMounted.current && e?.response?.data?.errors) {
            closeSnackbar(loadingKey);
            enqueueSnackbar("Failed to delete data.", {
              variant: "error",
            });
          }

          reject(e);
        });
    });
  };

  return { handleDelete, deleteResource };
};
