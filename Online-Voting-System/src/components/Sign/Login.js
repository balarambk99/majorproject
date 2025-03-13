import "./SignUtils/CSS/Sign.css";
import "./SignUtils/CSS/style.css.map";
import "./SignUtils/fonts/material-icon/css/material-design-iconic-font.min.css";
import signinimage from "./SignUtils/images/signin-image.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";
import Nav_bar from "../Navbar/Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../helper";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const loginSuccess = () => toast.success("Login Success", { className: "toast-message" });
    const loginFailed = () => toast.error("Invalid Details or User Doesn't Exist", { className: "toast-message" });

    const sendOtp = async () => {
        if (!username) {
            toast.error("Please enter your email to receive OTP");
            return;
        }
        try {
            await axios.post(`${BASE_URL}/auth/send-otp`, { email: username });
            toast.success("OTP sent to your email");
            setOtpSent(true);
        } catch (error) {
            toast.error("Failed to send OTP");
            console.error(error);
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/auth/verify-otp`, { email: username, otp });
            if (response.data.success) {
                toast.success("OTP Verified");
                setOtpVerified(true);
            } else {
                toast.error("Invalid OTP");
            }
        } catch (error) {
            toast.error("OTP verification failed");
            console.error(error);
        }
    };

    const handleLogin = async () => {
        if (!username || !password || !otpVerified) {
            toast.error("All fields are required and OTP must be verified");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { username, password });
            const voterst = response.data.voterObject;
            console.log(voterst);

            if (response.data.success) {
                loginSuccess();
                setTimeout(() => {
                    localStorage.setItem("authToken", voterst.token);
                    localStorage.setItem("voterid", voterst.voterid);
                    navigate("/User", { state: { voterst } });
                }, 2000);
            } else {
                loginFailed();
            }
        } catch (error) {
            console.error("Login failed:", error);
            loginFailed();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Nav_bar />
            <section className="sign-in">
                <div className="container">
                    <div className="signin-content">
                        <div className="signin-image">
                            <figure>
                                <img src={signinimage} alt="sign up image" />
                            </figure>
                            <Link to="/Signup" className="signup-image-link">
                                Create an account
                            </Link>
                        </div>

                        <div className="signin-form">
                            <h2 className="form-title">Sign In</h2>
                            <ToastContainer />
                            <div className="form-group">
                                <label htmlFor="email">
                                    <i className="zmdi zmdi-account material-icons-name"></i>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter Email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pass">
                                    <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="pass"
                                    id="pass"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            
                            {/* OTP Section */}
                            {otpSent && (
                                <div className="form-group">
                                    <label htmlFor="otp">
                                        <i className="zmdi zmdi-key"></i>
                                    </label>
                                    <input
                                        type="text"
                                        name="otp"
                                        id="otp"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            )}
                            
                            <div className="form-group form-button">
                                {!otpSent ? (
                                    <button onClick={sendOtp}>Send OTP</button>
                                ) : !otpVerified ? (
                                    <button onClick={verifyOtp}>Verify OTP</button>
                                ) : (
                                    <button onClick={handleLogin} disabled={loading}>
                                        {loading ? <div className="spinner"></div> : "Login"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default Login;
