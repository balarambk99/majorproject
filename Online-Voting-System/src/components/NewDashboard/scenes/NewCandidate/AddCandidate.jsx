import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../newComponents/Header";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../helper";
import { useNavigate } from 'react-router-dom';

const AddCandidate = () => {
    const [theme, colorMode] = useMode();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Function to convert a file to Base64
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); // Full Base64 string
            reader.onerror = error => reject(error);
        });
    };

    const CreationSuccess = () => toast.success("Candidate Created Successfully!");
    const CreationFailed = () => toast.error("Invalid Details. Please Try Again!");

    const handleSubmit = async (values, { setSubmitting }) => {
        setLoading(true);

        try {
            const token = localStorage.getItem("authToken");  // Retrieve JWT token

            const dataToSend = {
                fullName: values.fullName,
                age: values.age,
                party: values.party,
                bio: values.bio,
                image: values.image,   // Base64 format
                symbol: values.symbol  // Base64 format
            };
          //  alert(token)
  //alert(dataToSend.symbol);
  //alert(dataToSend.image);
            const response = await axios.post(`${BASE_URL}/admin/createCandidate`, dataToSend, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.data.success) {
                CreationSuccess();
                setTimeout(() => navigate('/Candidate'), 500);
            } else {
                CreationFailed();
            }
        } catch (error) {
            CreationFailed();
            console.error(error);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="appNew">
                    <Sidebar />
                    <main className="content">
                        <Topbar />
                        <ToastContainer />
                        <Box m="0px 20px">
                            <Header title="CREATE NEW CANDIDATE" subtitle="Create a New Candidate Profile" />
                            <br />

                            <Formik
                                initialValues={{
                                    fullName: "",
                                    age: "",
                                    party: "",
                                    bio: "",
                                    image: "",
                                    symbol: ""
                                }}
                                validationSchema={yup.object().shape({
                                    fullName: yup.string().required("Required"),
                                    age: yup.string().required("Required"),
                                    party: yup.string().required("Required"),
                                    bio: yup.string().required("Required"),
                                    image: yup.string().required("Image is required"),
                                    symbol: yup.string().required("Symbol is required"),
                                })}
                                onSubmit={handleSubmit}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    setFieldValue,
                                    handleSubmit
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Box
                                            display="grid"
                                            gap="20px"
                                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                            sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
                                        >
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Candidate Name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.fullName}
                                                name="fullName"
                                                error={!!touched.fullName && !!errors.fullName}
                                                helperText={touched.fullName && errors.fullName}
                                                sx={{ gridColumn: "span 4" }}
                                            />
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Candidate Age"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.age}
                                                name="age"
                                                error={!!touched.age && !!errors.age}
                                                helperText={touched.age && errors.age}
                                                sx={{ gridColumn: "span 2" }}
                                            />
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Candidate Party"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.party}
                                                name="party"
                                                error={!!touched.party && !!errors.party}
                                                helperText={touched.party && errors.party}
                                                sx={{ gridColumn: "span 2" }}
                                            />
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Candidate Bio"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.bio}
                                                name="bio"
                                                error={!!touched.bio && !!errors.bio}
                                                helperText={touched.bio && errors.bio}
                                                sx={{ gridColumn: "span 4" }}
                                            />
                                            
                                            <input
                                                accept="image/*"
                                                type="file"
                                                name="image"
                                                onChange={(event) => {
                                                    const file = event.currentTarget.files[0];
                                                    if (file) {
                                                        convertFileToBase64(file).then((base64) => {
                                                            setFieldValue("image", base64);
                                                            console.log("Image Base64:", base64); 
                                                        });
                                                    }
                                                }}
                                                style={{ gridColumn: "span 2", padding: "10px", border: "1px solid #ccc" }}
                                            />
                                            {touched.image && errors.image && <p style={{ color: "red" }}>{errors.image}</p>}

                                            <input
                                                accept="image/*"
                                                type="file"
                                                name="symbol"
                                                onChange={(event) => {
                                                    const file = event.currentTarget.files[0];
                                                    if (file) {
                                                        convertFileToBase64(file).then((base64) => {
                                                            setFieldValue("symbol", base64);
                                                            console.log("Symbol Base64:", base64); 
                                                        });
                                                    }
                                                }}
                                                style={{ gridColumn: "span 2", padding: "10px", border: "1px solid #ccc" }}
                                            />
                                            {touched.symbol && errors.symbol && <p style={{ color: "red" }}>{errors.symbol}</p>}
                                        </Box>
                                        <Box display="flex" justifyContent="end" mt="20px">
                                            <Button type="submit" disabled={loading} color="secondary" variant="contained">
                                                {loading ? <div className="spinner"></div> : 'Create Candidate'}
                                            </Button>
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default AddCandidate;
