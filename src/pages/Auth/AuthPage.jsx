import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginApi, registerApi, sendVerificationApi } from "../../api/authApi";
import { updateProfileApi } from "../../api/userApi";
import Login from "./Login";
import Register from "./Register";
import SlidingOverlay from "../../components/SlidingOverlay";
export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const { login } = useAuth();

    const toggleAuth = () => setIsLogin(!isLogin);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const res = await loginApi({ email, password });
            login({ id: res.data.id, email: res.data.email, token: res.data.token });
            console.log("Logged in successfully!");
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
            login({ id: res.data.id, email: res.data.email, token: res.data.token });
            await updateProfileApi({ firstName: formData.fname, lastName: formData.lname });
            await sendVerificationApi();
            alert("Registration successful!");
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="relative h-[750px] w-full max-w-6xl overflow-hidden rounded-[40px] bg-white shadow-2xl">
                
                <Login isVisible={isLogin} onLogin={handleLogin} />
                
                <Register isVisible={isLogin} onRegister={handleRegister} toggleAuth={toggleAuth} />
                
                <SlidingOverlay isLogin={isLogin} toggleAuth={toggleAuth} />
                
            </div>
        </div>
    );
}