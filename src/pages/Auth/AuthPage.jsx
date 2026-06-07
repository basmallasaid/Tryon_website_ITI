import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginApi, registerApi, sendVerificationApi, forgotPasswordApi, otpVerifyApi, resetPasswordApi } from "../../api/authApi";
import { getUserApi, updateProfileApi } from "../../api/userApi";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import OtpVerification from "./OtpVerification";
import ResetPassword from "./ResetPassword";
import SlidingOverlay from "../../components/SlidingOverlay";
export default function AuthPage({ initialIsLogin = true, inModal = false, onClose }) {
    const [view, setView] = useState(initialIsLogin ? "login" : "register");
    const [forgotEmail, setForgotEmail] = useState("");
    const { login } = useAuth();

    const toggleAuth = () => setView(view === "login" ? "register" : "login");

    const handleForgot = () => setView("forgot");
    const handleBackToLogin = () => setView("login");

    const handleGoogleLogin = () => {
        if (window.googleAuthPopup && !window.googleAuthPopup.closed) {
            window.googleAuthPopup.focus();
            return;
        }
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;
        window.googleAuthPopup = window.open(
            "http://localhost:5000/api/auth/google",
            "google-auth",
            `width=${width},height=${height},left=${left},top=${top}`
        );
    };

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.origin) return;
            if (event.data?.type !== "GOOGLE_AUTH_SUCCESS") return;
            const userData = event.data.payload;
            console.log("Google OAuth login successful", userData);
            login(userData);
            onClose?.();
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [login, onClose]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const res = await loginApi({ email, password });
            console.log("Login successful", { response: res.data, email, timestamp: new Date().toISOString() });
            login({ id: res.data._id, email: res.data.email, token: res.data.token });
            const userRes = await getUserApi(res.data._id);
            console.log("User profile data", { user: userRes.data, timestamp: new Date().toISOString() });
            login({ id: res.data._id, email: res.data.email, token: res.data.token, ...userRes.data });
            onClose?.();
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = {
            fname: e.target.fname.value.trim(),
            lname: e.target.lname.value.trim(),
            email: e.target.email.value.trim(),
            password: e.target.password.value,
            confirmPassword: e.target.confirmPassword.value,
        };

        if (formData.password !== formData.confirmPassword) return alert("Passwords do not match");

        try {
            const res = await registerApi({
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });
            const token = res.data.token;
            const userId = JSON.parse(atob(token.split('.')[1])).id;
            console.log("Registration successful", { response: res.data, ...formData, password: undefined, confirmPassword: undefined, timestamp: new Date().toISOString() });
            login({ id: userId, email: formData.email, token });
            await updateProfileApi({ firstName: formData.fname, lastName: formData.lname });
            await sendVerificationApi();
            const userRes = await getUserApi(userId);
            console.log("User profile data after signup", { user: userRes.data, timestamp: new Date().toISOString() });
            login({ id: userId, email: formData.email, token, ...userRes.data });
            onClose?.();
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        try {
            await forgotPasswordApi({ email });
            setForgotEmail(email);
            setView("otp");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send reset link");
        }
    };

    const handleOtpVerify = async (otp) => {
        try {
            await otpVerifyApi({ email: forgotEmail, otp });
            setView("reset");
        } catch (error) {
            alert(error.response?.data?.message || "Verification failed");
        }
    };

    const handleResetPassword = async (password, confirmPassword) => {
        if (password !== confirmPassword) return alert("Passwords do not match");
        try {
            await resetPasswordApi({ email: forgotEmail, password, confirmPassword });
            alert("Password reset successfully! Please login with your new password.");
            setView("login");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className={`flex ${inModal ? '' : 'min-h-screen'} items-center justify-center ${inModal ? '' : 'bg-gray-100 p-4'} font-sans`}>
            <div className={`relative ${inModal ? 'h-[600px]' : 'h-[750px]'} w-full ${inModal ? '' : 'max-w-6xl'} overflow-hidden rounded-[40px] bg-white shadow-2xl`}>
                
                <Login isVisible={view === "login"} onLogin={handleLogin} onForgot={handleForgot} onGoogleLogin={handleGoogleLogin} inModal={inModal} />
                
                <Register isVisible={view === "register"} onRegister={handleRegister} toggleAuth={toggleAuth} onGoogleLogin={handleGoogleLogin} inModal={inModal} />
                
                <ForgotPassword isVisible={view === "forgot"} onForgot={handleForgotSubmit} onBackToLogin={handleBackToLogin} inModal={inModal} />
                
                <OtpVerification isVisible={view === "otp"} email={forgotEmail} onVerify={handleOtpVerify} onBackToLogin={handleBackToLogin} inModal={inModal} />
                
                <ResetPassword isVisible={view === "reset"} onReset={handleResetPassword} onBackToLogin={handleBackToLogin} inModal={inModal} />
                
                <SlidingOverlay view={view} onToggle={toggleAuth} onForgot={handleForgot} inModal={inModal} />
                
            </div>
        </div>
    );
}