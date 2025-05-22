"use client";
import { IError } from "@/interface/error.interface";
import { IResponse } from "@/interface/response.interface";
import { axiosInstance } from "@/lib/axios.instance";
import { Box, Button, LinearProgress } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";

const FlushCart = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["flush-cart"],
    mutationFn: async (): Promise<IResponse> => {
      return await axiosInstance.delete("/cart/flush");
    },
    onSuccess: (response: IResponse) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
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
    <Box className="flex w-full justify-start items-center b-4">
      <Button
        
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        className="md:w-auto px-8 py-2"
        onClick={handleClickOpen}
        disabled={isPending}
      >
        {isPending ? "Flushing..." : "Flush Cart"}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {isPending && <LinearProgress color="error" />}
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to flush the cart?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Cart once deleted cannot be restored. This action is{" "}
            <span className="font-semibold">irreversible</span>.
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
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlushCart;
