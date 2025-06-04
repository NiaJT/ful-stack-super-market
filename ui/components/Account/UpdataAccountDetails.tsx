"use client";
import { IError } from "@/interface/error.interface";
import { IResponse } from "@/interface/response.interface";
import { axiosInstance } from "@/lib/axios.instance";
import { RegisterFormSchema } from "@/validationSchema/user.registerSchema";
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
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
interface IUpdateUserForm {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  address: string;
}
const UpdateAccountDetails = () => {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (values: IUpdateUserForm) => {
      return await axiosInstance.post("/user/update", values);
    },
    onSuccess: (res: IResponse) => {
      router.push("/login");
      toast.success(res.data.message);
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });
  if (isPending) {
    return <LinearProgress />;
  }
  return (
    <Box className="flex justify-center items-center min-h-screen mt-4">
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          gender: "",
          dob: "",
          role: "",
          address: "",
        }}
        validationSchema={RegisterFormSchema}
        onSubmit={async (values: IUpdateUserForm) => {
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
              onSubmit={() => (
                <Link
                  href="/login"
                  className="text-emerald-700 hover:text-emerald-950"
                ></Link>
              )}
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
