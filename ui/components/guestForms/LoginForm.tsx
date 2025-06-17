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
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface ILoginForm {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const theme = useTheme();
  const { isPending, mutate } = useMutation({
    mutationKey: ["user-login"],
    mutationFn: async (values: ILoginForm) => {
      return await axiosInstance.post("/user/login", values);
    },
    onSuccess: (res) => {
      const { accessToken, userDetails } = res.data;
      window.localStorage.setItem("accessToken", accessToken);
      window.localStorage.setItem("firstName", userDetails?.firstName);
      window.localStorage.setItem("role", userDetails?.role);
      toast.success(`Welcome ${userDetails?.firstName}!`);
      router.push("/");
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.grey[100],
        p: 2,
      }}
    >
      {isPending && (
        <LinearProgress sx={{ position: "fixed", top: 0, left: 0, right: 0 }} />
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: 900,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 2,
        }}
      >
        {/* Welcome Section */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #4caf50, #2e7d32)",
            color: "white",
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Welcome to Emart
          </Typography>
          <Typography variant="body2" textAlign="center" mt={1}>
            Your Premium Shopping Destination
          </Typography>
        </Box>

        {/* Login Form */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access your Emart account
            </Typography>
          </Box>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={userLoginSchema}
            onSubmit={(values: ILoginForm) => mutate(values)}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label="Email"
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <FormHelperText error>{formik.errors.email}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 1 }}>
                  <TextField
                    label="Password"
                    type="password"
                    {...formik.getFieldProps("password")}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                  />
                  {formik.touched.password && formik.errors.password && (
                    <FormHelperText error>
                      {formik.errors.password}
                    </FormHelperText>
                  )}
                </FormControl>

                <Box sx={{ textAlign: "right", mb: 2 }}>
                  <Link
                    href="/forgot-password"
                    style={{
                      color: theme.palette.primary.main,
                      fontSize: "0.875rem",
                      textDecoration: "none",
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="medium"
                  disabled={isPending}
                  sx={{ py: 1, mb: 2 }}
                >
                  SIGN IN
                </Button>

                <Typography variant="body2" textAlign="center">
                  New here?{" "}
                  <Link
                    href="/register"
                    style={{
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    Create an account
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
