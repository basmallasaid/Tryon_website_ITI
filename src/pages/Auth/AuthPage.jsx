import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginApi, registerApi, sendVerificationApi, forgotPasswordApi, otpVerifyApi, resetPasswordApi } from "../../api/authApi";
import { getUserApi, updateProfileApi } from "../../api/userApi";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import OtpVerification from "./OtpVerification";
import ResetPassword from "./ResetPassword";
import SlidingOverlay from "../../components/SlidingOverlay";
import { showToast } from "../../utils/toast";

export default function AuthPage({ initialIsLogin = true, inModal = false, onClose }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const [view, setView] = useState(initialIsLogin ? "login" : "register");
    const [forgotEmail, setForgotEmail] = useState("");
    const { login } = useAuth();

  const toggleAuth = () => setView(view === 'login' ? 'register' : 'login');

  const handleForgot = () => setView('forgot');
  const handleBackToLogin = () => setView('login');

  const toastPosition = isArabic ? 'top-start' : 'top-end';
  const googleAuthSuccess = useRef(false);

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
        if (window.googleAuthPopup) {
            window.googleAuthPopup.focus();
        }
        if (!window.googleAuthPopup) {
            showToast('error', t("auth.googlePopupBlocked"), toastPosition);
            return;
        }

        googleAuthSuccess.current = false;
        const checkPopup = setInterval(() => {
            if (window.googleAuthPopup?.closed) {
                clearInterval(checkPopup);
                window.googleAuthPopup = null;
                if (!googleAuthSuccess.current) {
                    onClose?.();
                    showToast('error', t("auth.googleLoginFailed"), toastPosition);
                }
            }
        }, 500);
    };

    const getGoogleErrorMessage = (error) => {
        if (!error) return t("auth.googleLoginFailed");
        const lower = error.toLowerCase();
        if (lower.includes("duplicate") || lower.includes("e11000") || lower.includes("already exists")) {
            return t("auth.googleEmailExists");
        }
        return t("auth.googleTryDifferentEmail");
    };

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.origin) return;
            if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
                googleAuthSuccess.current = true;
                const userData = event.data.payload;
                console.log("Google OAuth login successful", userData);
                login(userData);
                if (userData.role === "admin") {
                    navigate("/admin", { replace: true });
                } else {
                    onClose?.();
                }
            } else if (event.data?.type === "GOOGLE_AUTH_ERROR") {
                googleAuthSuccess.current = true;
                onClose?.();
                showToast('error', getGoogleErrorMessage(event.data.payload), toastPosition);
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [login, onClose, navigate, t, toastPosition]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const res = await loginApi({ email, password });
            console.log("Login successful", { response: res.data, email, timestamp: new Date().toISOString() });
            const userRole = res.data.role;
            login({ id: res.data._id, email: res.data.email, token: res.data.token, role: userRole });
            const userRes = await getUserApi(res.data._id);
            console.log("User profile data", { user: userRes.data, timestamp: new Date().toISOString() });
            const apiUser = userRes.data?.user || userRes.data;
            const fullName = apiUser?.profile
              ? [apiUser.profile.first_name, apiUser.profile.last_name].filter(Boolean).join(" ").trim()
              : apiUser?.name;
            login({
                id: res.data._id,
                email: res.data.email,
                token: res.data.token,
                role: userRole,
                ...apiUser,
                name: fullName,
            });
            if (userRole === "admin") {
                navigate("/admin", { replace: true });
            } else {
                onClose?.();
            }
        } catch (error) {
            showToast('error', error.response?.data?.message || t("auth.loginFailed"));
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

        if (formData.password !== formData.confirmPassword) return showToast('warning', t("auth.passwordsNoMatch"));

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
            const apiUser = userRes.data?.user || userRes.data;
            const fullName = apiUser?.profile
              ? [apiUser.profile.first_name, apiUser.profile.last_name].filter(Boolean).join(" ").trim()
              : apiUser?.name;
            login({
                id: userId,
                email: formData.email,
                token,
                ...apiUser,
                name: fullName,
            });
            onClose?.();
        } catch (error) {
            showToast('error', error.response?.data?.message || t("auth.registrationFailed"));
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
            showToast('error', error.response?.data?.message || t("auth.failedToSendReset"));
        }
    };

    const handleOtpVerify = async (otp) => {
        try {
            await otpVerifyApi({ email: forgotEmail, otp });
            setView("reset");
        } catch (error) {
            showToast('error', error.response?.data?.message || t("auth.verificationFailed"));
        }
    };

    const handleResetPassword = async (password, confirmPassword) => {
        if (password !== confirmPassword) return showToast('warning', t("auth.passwordsNoMatch"));
        try {
            await resetPasswordApi({ email: forgotEmail, password, confirmPassword });
            showToast('success', t("auth.resetSuccess"));
            setView("login");
        } catch (error) {
            showToast('error', error.response?.data?.message || t("auth.failedToReset"));
        }
    };

    // ─── Mobile-only single-panel renderer (no animation, natural height) ─────
    const mobilePanel = () => {
        const commonProps = { inModal };
        switch (view) {
            case "login":
                return <Login isVisible onLogin={handleLogin} onForgot={handleForgot} onGoogleLogin={handleGoogleLogin} toggleAuth={toggleAuth} {...commonProps} mobile />;
            case "register":
                return <Register isVisible onRegister={handleRegister} toggleAuth={toggleAuth} onGoogleLogin={handleGoogleLogin} {...commonProps} mobile />;
            case "forgot":
                return <ForgotPassword isVisible onForgot={handleForgotSubmit} onBackToLogin={handleBackToLogin} {...commonProps} mobile />;
            case "otp":
                return <OtpVerification isVisible email={forgotEmail} onVerify={handleOtpVerify} onBackToLogin={handleBackToLogin} {...commonProps} mobile />;
            case "reset":
                return <ResetPassword isVisible onReset={handleResetPassword} onBackToLogin={handleBackToLogin} {...commonProps} mobile />;
            default:
                return null;
        }
    };

    return (
        <div dir={isArabic ? 'rtl' : 'ltr'} className={`font-sans ${inModal ? '' : 'min-h-screen flex items-center justify-center bg-surface-elevated p-4'}`}>

            {/* ── MOBILE LAYOUT (< md): single panel, natural height, scrollable ── */}
            <div className={`md:hidden w-full ${inModal ? '' : 'max-w-md mx-auto'}`}>
                <div className="bg-surface-elevated rounded-3xl shadow-xl overflow-hidden">
                    {mobilePanel()}
                </div>
            </div>

            {/* ── DESKTOP LAYOUT (≥ md): original sliding-panel animation ── */}
            <div className={`hidden md:block w-full ${inModal ? '' : 'max-w-6xl'}`}>
                <div className={`relative ${inModal ? 'h-[600px]' : 'h-[750px]'} w-full overflow-hidden rounded-[40px] bg-surface-elevated shadow-2xl`}>

                    <Login isVisible={view === "login"} onLogin={handleLogin} onForgot={handleForgot} onGoogleLogin={handleGoogleLogin} inModal={inModal} />

                    <Register isVisible={view === "register"} onRegister={handleRegister} toggleAuth={toggleAuth} onGoogleLogin={handleGoogleLogin} inModal={inModal} />

                    <ForgotPassword isVisible={view === "forgot"} onForgot={handleForgotSubmit} onBackToLogin={handleBackToLogin} inModal={inModal} />

                    <OtpVerification isVisible={view === "otp"} email={forgotEmail} onVerify={handleOtpVerify} onBackToLogin={handleBackToLogin} inModal={inModal} />

                    <ResetPassword isVisible={view === "reset"} onReset={handleResetPassword} onBackToLogin={handleBackToLogin} inModal={inModal} />

                    <SlidingOverlay view={view} onToggle={toggleAuth} onForgot={handleForgot} inModal={inModal} />

                </div>
            </div>

        </div>
    );
}
