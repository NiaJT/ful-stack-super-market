"use client";
import { IError } from "@/interface/error.interface";
import { IResponse } from "@/interface/response.interface";
import { axiosInstance } from "@/lib/axios.instance";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from "@mui/icons-material/Cancel";

const RemoveCartItem = (props: { _id: string }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-cart-item"],
    mutationFn: async (cartId: string): Promise<IResponse> => {
      return await axiosInstance.delete(`/cart/item/delete/${cartId}`);
    },
    onSuccess: (response: IResponse) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      queryClient.invalidateQueries({queryKey:["get-cart-items-count"]});
    },
    onError: (error: IError) => {
      console.error(error);
      toast.error(error.response.data.message);
    },
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box className="flex w-full justify-center items-center b-4">
      <IconButton color="error" size="small" onClick={handleClickOpen}>
        <Tooltip title="Remove from cart" arrow>
          <CancelIcon />
        </Tooltip>
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {isPending && <LinearProgress color="error" />}
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to remove this product from the cart?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Product once deleted cannot be restored. This action is{" "}
            <span className="font-semibold">irreversible</span>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="success">
            No
          </Button>
          <Button
            onClick={() => {
              mutate(props._id);
              handleClose();
            }}
            variant="contained"
            color="error"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RemoveCartItem;
