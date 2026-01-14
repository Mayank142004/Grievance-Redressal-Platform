
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebase';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const SubmitGrievance = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    department: '',
    priority: 'Low',
    address: '',
    code: ''
  });
  const [position, setPosition] = useState(null); // { lat, lng }
  const [status, setStatus] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP State
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const departments = [
    "Public Works Department",
    "Water Supply",
    "Electricity Board",
    "Sanitation",
    "Health Department",
    "Education",
    "Police",
    "Transport"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // Response expired
        }
      });
    }
  }

  const sendOtp = () => {
    if (!formData.phone || formData.phone.length < 10) {
      alert("Please enter a valid phone number (with country code if needed, e.g., +91...)");
      return;
    }
    setVerifyLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = formData.phone.startsWith('+') ? formData.phone : "+" + formData.phone;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((result) => {
        setConfirmationResult(result);
        setVerifyLoading(false);
        setShowOtpInput(true);
        alert("OTP sent successfully!");
      }).catch((error) => {
        console.error(error);
        setVerifyLoading(false);
        alert("Error sending OTP. Please check the number or try again.");
      });
  }

  const verifyOtp = () => {
    setVerifyLoading(true);
    confirmationResult.confirm(otp).then((result) => {
      setIsVerified(true);
      setVerifyLoading(false);
      setShowOtpInput(false);
      // alert("Phone number verified successfully!");
    }).catch((error) => {
      console.error(error);
      setVerifyLoading(false);
      alert("Invalid OTP");
    });
  }

  const detectLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              setFormData(prev => ({ ...prev, address: data.display_name || prev.address }));
              setLoading(false);
            })
            .catch(err => {
              console.error("Geocoding failed", err);
              setLoading(false);
            });
        },
        (err) => {
          console.error(err);
          alert("Location detection failed. Please enable GPS.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Please verify your phone number before submitting.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        location: position,
        status: "Pending",
        createdAt: new Date().toISOString()
      };

      const response = await axios.post('http://localhost:5000/api/grievance/submit', payload);
      setTrackingId(response.data.trackingId);
      setStatus('success');
    } catch (error) {
      console.error('Submission failed:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-royal-gradient py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100"
      >
        <div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full translate-x-10 translate-y-10"></div>

          <h2 className="text-3xl font-bold text-white relative z-10">New Grievance</h2>
          <p className="text-orange-100 mt-2 font-medium relative z-10">Voice your concern directly to the Rajasthan Government</p>
        </div>

        <div className="p-8 md:p-10">
          {status === 'success' ? (
            <div className="text-center py-10 bg-green-50 rounded-xl border border-green-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                🎉
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Submitted Successfully!</h3>
              <p className="text-gray-600 mb-8">Your concern has been registered.</p>

              <div className="bg-white p-6 rounded-xl inline-block shadow-sm border border-orange-200">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-2 font-bold">Your Tracking ID</p>
                <div className="text-4xl font-mono text-orange-600 font-bold tracking-wider">
                  {trackingId}
                </div>
              </div>

              <p className="text-gray-500 mt-8 text-sm">Please save this ID to track status later.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 text-gray-900 rounded-xl p-3 border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Secure Phone Verification Section */}
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <label className="block text-gray-700 font-bold mb-2 text-sm">Mobile Number Verification</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="phone"
                      required
                      disabled={isVerified}
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full bg-white text-gray-900 rounded-lg p-3 border focus:outline-none transition-all ${isVerified ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 focus:ring-2 focus:ring-orange-500'}`}
                      placeholder="+91 98765 43210"
                    />
                    {!isVerified && !showOtpInput && (
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={verifyLoading}
                        className="bg-orange-600 text-white px-4 rounded-lg font-bold hover:bg-orange-700 whitespace-nowrap text-sm"
                      >
                        {verifyLoading ? "Sending..." : "Verify"}
                      </button>
                    )}
                    {isVerified && (
                      <span className="flex items-center text-green-600 font-bold px-3">
                        Verified ✓
                      </span>
                    )}
                  </div>
                  <div id="recaptcha-container"></div>

                  {showOtpInput && (
                    <div className="mt-3 flex gap-2 animate-fade-in-down">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full bg-white text-gray-900 rounded-lg p-2 border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={verifyOtp}
                        disabled={verifyLoading}
                        className="bg-green-600 text-white px-4 rounded-lg font-bold hover:bg-green-700 text-sm"
                      >
                        {verifyLoading ? "..." : "Confirm"}
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 text-gray-900 rounded-xl p-3 border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 text-gray-900 rounded-xl p-3 border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">Grievance Description</label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 text-gray-900 rounded-xl p-3 border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Describe your issue in detail..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">Panchayat Code (Optional)</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 text-gray-900 rounded-xl p-3 border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Enter Code"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">Location</label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={detectLocation}
                      className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-800 p-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      📍 Detect My Location
                    </button>
                  </div>
                  {position ? (
                    <div className="text-green-600 text-xs font-bold mb-2 bg-green-50 p-2 rounded border border-green-100">
                      ✅ Coordinates Set: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs mb-2 italic">
                      Tap the button above or click on map
                    </div>
                  )}

                  <div className="h-64 rounded-xl overflow-hidden border-2 border-white shadow-md relative z-0">
                    <MapContainer
                      center={[26.9124, 75.7873]}
                      zoom={10}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                      />
                      <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 text-gray-900 rounded-xl p-3 border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Auto-filled or Manual Address"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">Upload Evidence</label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-all text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-gray-400">
                      <span className="text-2xl block mb-2">📸</span>
                      <span className="text-sm">Click to upload images</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !isVerified}
                    className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg transform ${isVerified ? 'bg-gradient-to-r from-orange-600 to-red-700 hover:shadow-orange-500/30 hover:-translate-y-1' : 'bg-gray-400 cursor-not-allowed'}`}
                  >
                    {loading ? "Submitting..." : isVerified ? "Submit Grievance" : "Verify Phone to Submit"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SubmitGrievance;
