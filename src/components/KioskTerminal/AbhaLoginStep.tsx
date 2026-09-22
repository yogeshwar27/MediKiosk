import React, { useState } from 'react';
import { 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Loader2,
  Phone,
  User,
  ShieldCheck,
  KeyRound,
  UserPlus,
  LogIn,
  AlertCircle,
  Calendar,
  MapPin,
  HeartPulse,
  ScanLine
} from 'lucide-react';
import { PatientProfile, SupportedLanguage } from '../../types';
import { UI_STRINGS } from '../../services/languageService';

interface AbhaLoginStepProps {
  language: SupportedLanguage;
  assistedMode: boolean;
  onPatientAuthenticated: (patient: PatientProfile) => void;
}

export const AbhaLoginStep: React.FC<AbhaLoginStepProps> = ({
  language,
  assistedMode,
  onPatientAuthenticated,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  // Active Tab: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'abha' | 'mobile' | 'qr'>('abha');

  // Login form state
  const [inputIdentifier, setInputIdentifier] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [inputOtp, setInputOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Registration form state
  const [regFullName, setRegFullName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regMobile, setRegMobile] = useState('');
  const [regBloodGroup, setRegBloodGroup] = useState('B+');
  const [regState, setRegState] = useState('Delhi');
  const [regCity, setRegCity] = useState('New Delhi');
  const [regEmergencyName, setRegEmergencyName] = useState('');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('');
  const [regPin, setRegPin] = useState('1234');

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const identifier = inputIdentifier.trim();
    if (!identifier) {
      setErrorMessage(
        loginMethod === 'abha' 
          ? 'Please enter your 14-digit ABHA Number (e.g. 91-4523-8821-9043)' 
          : 'Please enter your registered 10-digit Mobile Number'
      );
      return;
    }

    if (otpRequested && inputOtp.length < 4) {
      setErrorMessage('Please enter the 4 to 6-digit OTP received on your mobile.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/patient/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          pin: inputPin || (otpRequested ? inputOtp : '1234'),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate patient.');
      }

      if (data.patient) {
        onPatientAuthenticated(data.patient);
      } else {
        throw new Error('No patient profile returned from server database.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage('Please enter patient full name.');
      return;
    }
    if (!regMobile.trim() || regMobile.replace(/\D/g, '').length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!regAge || Number(regAge) <= 0 || Number(regAge) > 120) {
      setErrorMessage('Please enter a valid patient age.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/patient/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName.trim(),
          age: Number(regAge),
          gender: regGender,
          mobile: regMobile.replace(/\D/g, ''),
          bloodGroup: regBloodGroup,
          state: regState,
          city: regCity,
          pin: regPin.trim() || '1234',
          emergencyContact: {
            name: regEmergencyName.trim() || 'Family Relative',
            relation: 'Emergency Contact',
            phone: regEmergencyPhone.trim() || regMobile.trim(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register patient in hospital database.');
      }

      if (data.patient) {
        onPatientAuthenticated(data.patient);
      } else {
        throw new Error('Registration complete, but failed to load patient session.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration error. Please verify input details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulated QR scan handler
  const handleSimulateQrScan = () => {
    setIsSubmitting(true);
    setTimeout(async () => {
      try {
        const res = await fetch('/api/auth/patient/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: '91-4523-8821-9043',
            pin: '1234',
          }),
        });
        const data = await res.json();
        if (data.patient) {
          onPatientAuthenticated(data.patient);
        }
      } catch (e) {
        setErrorMessage('QR Code scanned, but database retrieval failed.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-bold text-slate-900 ${assistedMode ? 'text-2xl' : 'text-xl'}`}>
                  {t.abhaLogin}
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded font-semibold border border-blue-200">
                  ABDM Verified
                </span>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Ayushman Bharat Digital Health Account & OPD Check-in
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-blue-900 bg-blue-50 px-3.5 py-1.5 rounded-lg border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Persistent Hospital Database</span>
          </div>
        </div>

        {/* Auth Mode Toggle Tabs (Login vs New Patient Registration) */}
        <div className="mt-5 grid grid-cols-2 gap-2 p-1.5 bg-slate-100/90 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              authMode === 'login'
                ? 'bg-white text-blue-700 shadow-sm border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Existing Patient Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              authMode === 'register'
                ? 'bg-white text-blue-700 shadow-sm border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>New Patient Registration</span>
          </button>
        </div>

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication Error</p>
              <p className="mt-0.5 text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 1: PATIENT LOGIN (ABHA / MOBILE / QR)
            ========================================= */}
        {authMode === 'login' && (
          <div className="mt-5 space-y-5">
            {/* Login Method Sub-selector */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <span className="text-xs font-semibold text-slate-500 mr-2">Login With:</span>
              <button
                type="button"
                onClick={() => setLoginMethod('abha')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  loginMethod === 'abha'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                14-Digit ABHA ID
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('mobile')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  loginMethod === 'mobile'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Mobile Number
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('qr')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                  loginMethod === 'qr'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                Scan ABHA QR
              </button>
            </div>

            {/* QR Scan View */}
            {loginMethod === 'qr' ? (
              <div className="p-8 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/40 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                  <ScanLine className="w-8 h-8 animate-pulse text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Scan Ayushman Bharat ABHA Card</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Hold your physical ABHA card or digital QR code in front of the kiosk scanner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSimulateQrScan}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 mx-auto shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Reading ABHA QR Code...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Simulate Optical QR Scan</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* ID & Mobile Entry Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {loginMethod === 'abha' ? 'ABHA Health Number (14 Digits)' : 'Registered 10-Digit Mobile Number'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputIdentifier}
                      onChange={(e) => setInputIdentifier(e.target.value)}
                      placeholder={
                        loginMethod === 'abha'
                          ? 'e.g. 91-4523-8821-9043'
                          : 'e.g. 9876543210'
                      }
                      className="w-full text-sm font-mono p-3.5 pl-11 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                      disabled={isSubmitting}
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      {loginMethod === 'abha' ? <CreditCard className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {loginMethod === 'abha'
                      ? 'Format: 14 digits with or without hyphens (e.g. 91-4523-8821-9043)'
                      : 'We will verify your patient record against the hospital database.'}
                  </p>
                </div>

                {/* PIN or OTP Choice */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                      <span>{otpRequested ? 'Enter 6-Digit OTP' : 'Security PIN / Password'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpRequested(!otpRequested)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      {otpRequested ? 'Use 4-digit PIN instead' : 'Send OTP to Mobile'}
                    </button>
                  </div>

                  {otpRequested ? (
                    <div>
                      <input
                        type="text"
                        maxLength={6}
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit OTP (e.g. 482103)"
                        className="w-full text-sm font-mono tracking-widest text-center p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                        disabled={isSubmitting}
                      />
                      <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>OTP dispatched to registered mobile (Simulated: enter any 4-6 digits)</span>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="password"
                        maxLength={8}
                        value={inputPin}
                        onChange={(e) => setInputPin(e.target.value)}
                        placeholder="Enter 4-digit Security PIN (Default: 1234)"
                        className="w-full text-sm font-mono p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                        disabled={isSubmitting}
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Default PIN for pre-seeded database accounts is <span className="font-semibold text-slate-700">1234</span>.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying with Hospital Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Begin Clinical Intake</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* =========================================
            TAB 2: NEW PATIENT REGISTRATION FORM
            ========================================= */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
            <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 flex items-center gap-2.5 text-xs text-blue-950">
              <UserPlus className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Registering creates a verified Ayushman Bharat Digital ID and stores your clinical profile persistently in the hospital database.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Suresh Chandran"
                    className="w-full text-xs sm:text-sm p-3 pl-9 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  10-Digit Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9845012345"
                    className="w-full text-xs sm:text-sm font-mono p-3 pl-9 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    required
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as any)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={regBloodGroup}
                    onChange={(e) => setRegBloodGroup(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4-Digit Security PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value)}
                    placeholder="1234"
                    className="w-full text-xs sm:text-sm font-mono p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State & City
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    placeholder="State"
                    className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="City"
                    className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emergency Contact Name & Phone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={regEmergencyName}
                    onChange={(e) => setRegEmergencyName(e.target.value)}
                    placeholder="Relative Name"
                    className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 bg-white"
                  />
                  <input
                    type="tel"
                    value={regEmergencyPhone}
                    onChange={(e) => setRegEmergencyPhone(e.target.value)}
                    placeholder="Phone"
                    className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                }}
                className="py-3.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering & Generating ABHA ID...</span>
                  </>
                ) : (
                  <>
                    <span>Create ABHA Profile & Proceed to Intake</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Security and Hospital Notice */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Ayushman Bharat Digital Health Mission (ABDM) Compliant Kiosk</span>
        </div>
        <span>OPD Case-Taking Station</span>
      </div>
    </div>
  );
};
