
import React, { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onCaptchVerify = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                }
            });
        }
    }

    const onSignInSubmit = () => {
        setLoading(true);
        onCaptchVerify();

        const appVerifier = window.recaptchaVerifier;
        const formatPh = "+" + phoneNumber;

        signInWithPhoneNumber(auth, formatPh, appVerifier)
            .then((result) => {
                setConfirmationResult(result);
                setLoading(false);
                setShowOtpInput(true);
            }).catch((error) => {
                console.log(error);
                setLoading(false);
                alert("Error sending OTP. Please check the number.");
            });
    }

    const verifyOtp = () => {
        setLoading(true);
        confirmationResult.confirm(otp).then(async (result) => {
            // User signed in successfully.
            const user = result.user;
            console.log(user);

            // Sync with Backend
            try {
                // If phone doesn't have +91 (or other code), it might need formatting, but Firebase returns E.164
                // We send phone number to backend to create/get user
                const res = await axios.post('http://localhost:5000/api/gamification/user/sync', {
                    phone: user.phoneNumber,
                    name: "Citizen " + user.phoneNumber.slice(-4) // Default name
                });

                localStorage.setItem('userPhone', user.phoneNumber);
                localStorage.setItem('userName', res.data.name);

                setLoading(false);
                navigate('/');
            } catch (err) {
                console.error("Sync failed", err);
                setLoading(false);
                alert("Login successful but sync failed.");
            }

        }).catch(async (error) => {
            console.log("OTP Error:", error);
            // Allow login even if OTP fails (User Request)
            const fallbackPhone = "+91" + phoneNumber.replace(/\D/g, '').slice(-10); // Simple formatting

            try {
                const res = await axios.post('http://localhost:5000/api/gamification/user/sync', {
                    phone: fallbackPhone,
                    name: "Citizen " + fallbackPhone.slice(-4)
                });

                localStorage.setItem('userPhone', fallbackPhone);
                localStorage.setItem('userName', res.data.name);

                alert("OTP Validation failed/bypassed. Logging in anyway.");
                setLoading(false);
                navigate('/');
            } catch (err) {
                console.error("Sync failed", err);
                setLoading(false);
                // Even if sync fails, let them in locally
                localStorage.setItem('userPhone', fallbackPhone);
                localStorage.setItem('userName', "Citizen");
                navigate('/');
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-royal-gradient relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl shadow-2xl z-10 max-w-md w-full border border-orange-100"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Citizen</h2>
                    <p className="text-gray-500 mt-2">Rajasthan Grievance Redressal</p>
                </div>

                <div id="recaptcha-container" className="flex justify-center mb-4"></div>

                {!showOtpInput ? (
                    <div className="flex flex-col gap-5">
                        <div className="space-y-2">
                            <label className="text-gray-700 font-semibold text-sm">Phone Number</label>
                            <input
                                type="text"
                                placeholder="919876543210 (with country code)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full bg-gray-50 text-gray-800 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                            />
                        </div>
                        <button
                            onClick={onSignInSubmit}
                            disabled={loading}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold p-3 rounded-xl transition-all shadow-lg transform active:scale-95 flex justify-center items-center"
                        >
                            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : "Send Verification Code"}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        <div className="space-y-2">
                            <label className="text-gray-700 font-semibold text-sm">Enter OTP</label>
                            <input
                                type="text"
                                placeholder="******"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-gray-50 text-gray-800 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-center tracking-widest text-lg font-bold"
                            />
                        </div>
                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold p-3 rounded-xl transition-all shadow-lg transform active:scale-95 flex justify-center items-center"
                        >
                            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : "Verify & Login"}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Login;
