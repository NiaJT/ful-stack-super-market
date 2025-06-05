"use client";
import { IError } from "@/interface/error.interface";
import { IResponse } from "@/interface/response.interface";
import { axiosInstance } from "@/lib/axios.instance";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateUserSchema } from "./../../../Backend/user/user.validation";

interface IUpdateUserForm {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  address: string;
}

const UpdateAccountDetails = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending: isInfoPending, data } = useQuery<IUpdateUserForm>({
    queryKey: ["get-user-info"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/info");
      return response.data.userInfo;
    },
  });

  const { isPending: isUpdatePending, mutate } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (values: IUpdateUserForm) => {
      const response = await axiosInstance.post("/user/update", values);
      window.localStorage.setItem("firstName", values.firstName);
      queryClient.invalidateQueries();
      return response;
    },

    onSuccess: (res: IResponse) => {
      toast.success(res.data.message);
      router.push("/");
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });

  if (isInfoPending || !data) {
    return <LinearProgress />;
  }

  return (
    <Box className="flex justify-center items-center min-h-screen mt-4">
      <Formik
        enableReinitialize
        initialValues={{
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          gender: data?.gender || "",
          dob: data?.dob.split("T")[0] || "",
          address: data?.address || "",
        }}
        validationSchema={updateUserSchema}
        onSubmit={(values: IUpdateUserForm) => {
          console.log("Formik submitted values:", values);
          mutate(values);
        }}
      >
        {(formik) => (
          <form
            className="flex flex-col gap-2 items-center justify-center p-4 min-w-[350px] shadow-lg rounded-xl bg-white"
            onSubmit={formik.handleSubmit}
          >
            <Typography variant="h5">Update Account Form</Typography>

            <FormControl fullWidth>
              <TextField
                label="First Name"
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <FormHelperText error>{formik.errors.firstName}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Last Name"
                {...formik.getFieldProps("lastName")}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <FormHelperText error>{formik.errors.lastName}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="gender"
                name="gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {formik.touched.gender && formik.errors.gender ? (
                <FormHelperText error>{formik.errors.gender}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Date of Birth"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                {...formik.getFieldProps("dob")}
              />
              {formik.touched.dob && formik.errors.dob ? (
                <FormHelperText error>{formik.errors.dob}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl fullWidth>
              <TextField label="Address" {...formik.getFieldProps("address")} />
              {formik.touched.address && formik.errors.address ? (
                <FormHelperText error>{formik.errors.address}</FormHelperText>
              ) : null}
            </FormControl>

            <Button
              fullWidth
              type="submit"
              color="success"
              variant="contained"
              disabled={isUpdatePending}
            >
              SUBMIT
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default UpdateAccountDetails;
