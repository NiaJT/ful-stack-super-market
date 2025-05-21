"use client";
import { IError } from "@/interface/error.interface";
import { axiosInstance } from "@/lib/axios.instance";
import { userLoginSchema } from "@/validationSchema/user.loginSchema";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
interface ILoginForm {
  email: string;
  password: string;
}
const LoginForm = () => {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationKey: ["user-login"],
    mutationFn: async (values: ILoginForm) => {
      return await axiosInstance.post("/user/login", values);
    },
    onSuccess: (res) => {
      const accessToken = res?.data?.accessToken;
      const firstName = res?.data?.userDetails?.firstName;
      const role = res?.data?.userDetails?.role;
      window.localStorage.setItem("accessToken", accessToken);
      window.localStorage.setItem("firstName", firstName);
      window.localStorage.setItem("role", role);
      toast.success(`Welcome ${firstName}!`);
      router.push("/");
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });

  return (
    <Box className="flex justify-center items-center h-screen">
      {isPending && <LinearProgress />}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={userLoginSchema}
        onSubmit={(values: ILoginForm) => {
          mutate(values);
        }}
      >
        {(formik) => {
          return (
            <form
              className="flex flex-col gap-6 items-center justify-center p-6 w-[300px] shadow-lg rounded-xl bg-white"
              onSubmit={formik.handleSubmit}
            >
              <Typography variant="h5">Login</Typography>
              <FormControl fullWidth>
                <TextField
                  label="Email"
                  {...formik.getFieldProps("email")}
                ></TextField>
                {formik.touched.email && formik.errors.email ? (
                  <FormHelperText error>{formik.errors.email}</FormHelperText>
                ) : null}
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="Password"
                  type="password"
                  {...formik.getFieldProps("password")}
                ></TextField>
                {formik.touched.password && formik.errors.password ? (
                  <FormHelperText error>
                    {formik.errors.password}
                  </FormHelperText>
                ) : null}
              </FormControl>
              <Button
                fullWidth
                type="submit"
                color="success"
                variant="contained"
                disabled={isPending}
              >
                SUBMIT
              </Button>
              <Link
                href="/register"
                className="text-emerald-700 hover:text-emerald-950"
              >
                New here? Create an account
              </Link>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};
export default LoginForm;
