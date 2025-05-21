"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { IResponse } from "@/interface/response.interface";
import toast from "react-hot-toast";
import { IError } from "@/interface/error.interface";
import { axiosInstance } from "@/lib/axios.instance";
import { useMutation } from "@tanstack/react-query";
import { LinearProgress } from "@mui/material";
interface IProps {
  id: string;
}
const DeleteProductDialog = (props: IProps) => {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationKey: ["add-product"],
    mutationFn: async () => {
      return await axiosInstance.delete(`/product/delete/${props.id}`);
    },
    onSuccess: (res: IResponse) => {
      toast.success(res.data.message);
      router.push("/");
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        className="md:w-auto px-8 py-2"
        onClick={handleClickOpen}
      >
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {isPending && <LinearProgress color="error" />}
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this product?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Product once delete cannot be restored. This action is{" "}
            <span className="font-semibold">irreversible</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="success">
            No
          </Button>
          <Button
            onClick={() => {
              mutate();
              handleClose();
            }}
            variant="contained"
            color="error"
            autoFocus
          >
            yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default DeleteProductDialog;
