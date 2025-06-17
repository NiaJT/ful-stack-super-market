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
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface IRegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  role: string;
  address: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const theme = useTheme();

  const { isPending, mutate } = useMutation({
    mutationKey: ["register-user"],
    mutationFn: async (values: IRegisterForm) => {
      return await axiosInstance.post("/user/register", values);
    },
    onSuccess: (res: IResponse) => {
      router.push("/login");
      toast.success(res.data.message);
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
          maxWidth: 1000,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 2,
        }}
      >
        {/* Welcome Section */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 50, mb: 2, mx: "auto" }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Join Emart Today
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Create your account to access exclusive deals and faster checkout
          </Typography>
          <Box sx={{ textAlign: "left", mt: 2 }}>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <span style={{ marginRight: 8 }}>✓</span> Personalized
              recommendations
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <span style={{ marginRight: 8 }}>✓</span> Order tracking history
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <span style={{ marginRight: 8 }}>✓</span> Exclusive member
              discounts
            </Typography>
          </Box>
        </Box>

        {/* Registration Form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 4 },
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
            Create Account
          </Typography>

          <Formik
            initialValues={{
              email: "",
              password: "",
              firstName: "",
              lastName: "",
              gender: "",
              dob: "",
              role: "",
              address: "",
            }}
            validationSchema={RegisterFormSchema}
            onSubmit={(values: IRegisterForm) => mutate(values)}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                  <FormControl fullWidth>
                    <TextField
                      label="First Name"
                      size="small"
                      {...formik.getFieldProps("firstName")}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <FormHelperText error>
                        {formik.errors.firstName}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      label="Last Name"
                      size="small"
                      {...formik.getFieldProps("lastName")}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <FormHelperText error>
                        {formik.errors.lastName}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>

                <FormControl fullWidth sx={{ mb: 1.5 }}>
                  <TextField
                    label="Email"
                    size="small"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <FormHelperText error>{formik.errors.email}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 1.5 }}>
                  <TextField
                    label="Password"
                    type="password"
                    size="small"
                    {...formik.getFieldProps("password")}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <FormHelperText error>
                      {formik.errors.password}
                    </FormHelperText>
                  )}
                </FormControl>

                <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select label="Gender" {...formik.getFieldProps("gender")}>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                    {formik.touched.gender && formik.errors.gender && (
                      <FormHelperText error>
                        {formik.errors.gender}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      label="Date of Birth"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      {...formik.getFieldProps("dob")}
                    />
                    {formik.touched.dob && formik.errors.dob && (
                      <FormHelperText error>{formik.errors.dob}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                  <InputLabel>Role</InputLabel>
                  <Select label="Role" {...formik.getFieldProps("role")}>
                    <MenuItem value="seller">Seller</MenuItem>
                    <MenuItem value="buyer">Buyer</MenuItem>
                  </Select>
                  {formik.touched.role && formik.errors.role && (
                    <FormHelperText error>{formik.errors.role}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label="Address"
                    size="small"
                    {...formik.getFieldProps("address")}
                  />
                  {formik.touched.address && formik.errors.address && (
                    <FormHelperText error>
                      {formik.errors.address}
                    </FormHelperText>
                  )}
                </FormControl>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={isPending}
                  sx={{ py: 1, mb: 1.5 }}
                >
                  CREATE ACCOUNT
                </Button>

                <Typography variant="body2" textAlign="center">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    style={{
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    Sign In
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

export default RegisterForm;
