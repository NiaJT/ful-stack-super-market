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
      {isPending && <LinearProgress sx={{ position: "fixed", top: 0, left: 0, right: 0 }} />}
      
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: 1200,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        {/* Welcome Section */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 4, md: 8 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
            color: "white",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <ShoppingCartIcon sx={{ fontSize: 60 }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome to Emart
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Your Premium Shopping Destination
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Discover thousands of products at unbeatable prices. Enjoy fast delivery, easy returns,
            and exclusive member benefits.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              gap: 2,
              mt: 2,
            }}
          >
            {[20, 40, 60].map((size) => (
              <Box
                key={size}
                sx={{
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: size - 10,
                    height: size - 10,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.3)",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Login Form Section */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 4, md: 8 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Sign In
            </Typography>
            <Typography color="text.secondary">Access your Emart account</Typography>
          </Box>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={userLoginSchema}
            onSubmit={(values: ILoginForm) => mutate(values)}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <FormHelperText error>{formik.errors.email}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    {...formik.getFieldProps("password")}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <FormHelperText error>{formik.errors.password}</FormHelperText>
                  )}
                </FormControl>

                <Box sx={{ textAlign: "right", mb: 3 }}>
                  <Link
                    href="/forgot-password"
                    style={{ color: theme.palette.primary.main, textDecoration: "none" }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isPending}
                  sx={{ py: 1.5, mb: 2 }}
                >
                  SIGN IN
                </Button>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography>
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
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;