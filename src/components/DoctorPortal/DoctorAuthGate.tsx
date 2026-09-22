import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  Building2, 
  Award, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  LogOut,
  Hospital,
  Clock
} from 'lucide-react';

export interface DoctorProfile {
  id: string;
  fullName: string;
  regNumber: string;
  email: string;
  specialty: string;
  hospitalName: string;
  department: string;
  roomNumber: string;
  dutyShift: string;
}

interface DoctorAuthGateProps {
  children: (doctor: DoctorProfile, onLogout: () => void) => React.ReactNode;
}

export const DoctorAuthGate: React.FC<DoctorAuthGateProps> = ({ children }) => {
  const [activeDoctor, setActiveDoctor] = useState<DoctorProfile | null>(() => {
    try {
      const saved = localStorage.getItem('medikiosk_doctor_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form fields
  const [loginIdentifier, setLoginIdentifier] = useState('NMC-2018-88421');
  const [loginPassword, setLoginPassword] = useState('doctorpassword');

  // Register form fields
  const [regFullName, setRegFullName] = useState('Dr. Arvind Sharma, MD');
  const [regNumber, setRegNumber] = useState('NMC-2018-88421');
  const [regEmail, setRegEmail] = useState('dr.sharma@aiims.edu.in');
  const [regPassword, setRegPassword] = useState('doctorpassword');
  const [regSpecialty, setRegSpecialty] = useState('General Medicine & Acute Care');
  const [regHospital, setRegHospital] = useState('AIIMS New Delhi / OPD Block');
  const [regDepartment, setRegDepartment] = useState('OPD General Medicine');
  const [regRoom, setRegRoom] = useState('Room 204');
  const [regShift, setRegShift] = useState('Morning OPD (08:00 - 14:00)');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Save session when authenticated
  const handleAuthSuccess = (doc: DoctorProfile) => {
    setActiveDoctor(doc);
    try {
      localStorage.setItem('medikiosk_doctor_auth', JSON.stringify(doc));
    } catch {}
  };

  const handleLogout = () => {
    setActiveDoctor(null);
    try {
      localStorage.removeItem('medikiosk_doctor_auth');
    } catch {}
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter Medical Registration number/Email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/doctor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate doctor credentials.');
      }

      if (data.doctor) {
        handleAuthSuccess(data.doctor);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify doctor credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim() || !regNumber.trim() || !regPassword.trim()) {
      setErrorMessage('Full Name, Registration Number, and Password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/doctor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName.trim(),
          regNumber: regNumber.trim(),
          email: regEmail.trim(),
          password: regPassword.trim(),
          specialty: regSpecialty,
          hospitalName: regHospital,
          department: regDepartment,
          roomNumber: regRoom,
          dutyShift: regShift,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register doctor in medical portal.');
      }

      if (data.doctor) {
        handleAuthSuccess(data.doctor);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check form values.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already authenticated, render child view directly
  if (activeDoctor) {
    return <>{children(activeDoctor, handleLogout)}</>;
  }

  // Otherwise render doctor authentication screen
  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Doctor & Clinical EMR Portal</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                  NMC Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200 mt-1">
                National Medical Commission / State Medical Council Authorized Login
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                tab === 'login'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Doctor Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTab('register');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                tab === 'register'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Doctor Profile</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Notice</p>
                <p className="mt-0.5 text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* DOCTOR LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medical Registration Number / Official Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. NMC-2018-88421 or dr.sharma@aiims.edu.in"
                    className="w-full text-xs sm:text-sm font-mono p-3 pl-10 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm p-3 pl-10 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Default credentials: <span className="font-mono text-blue-700 font-semibold">NMC-2018-88421</span> / <span className="font-mono text-blue-700 font-semibold">doctorpassword</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Medical Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Doctor Consultation Station</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* DOCTOR REGISTRATION TAB */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Doctor Full Name & Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Dr. Arvind Sharma, MD"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NMC / Council Reg Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    placeholder="e.g. NMC-2019-94301"
                    className="w-full text-xs sm:text-sm font-mono p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="dr.name@hospital.gov.in"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Clinical Specialty
                  </label>
                  <input
                    type="text"
                    value={regSpecialty}
                    onChange={(e) => setRegSpecialty(e.target.value)}
                    placeholder="e.g. General Medicine & Triage"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hospital / Healthcare Center
                  </label>
                  <input
                    type="text"
                    value={regHospital}
                    onChange={(e) => setRegHospital(e.target.value)}
                    placeholder="e.g. AIIMS New Delhi / OPD Block"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned OPD Room Number
                  </label>
                  <input
                    type="text"
                    value={regRoom}
                    onChange={(e) => setRegRoom(e.target.value)}
                    placeholder="e.g. Room 204"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duty Shift
                  </label>
                  <input
                    type="text"
                    value={regShift}
                    onChange={(e) => setRegShift(e.target.value)}
                    placeholder="e.g. Morning OPD (08:00 - 14:00)"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering Doctor Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Register & Access Consultation Station</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>HIPAA & ABDM Data Protection Standard</span>
            </span>
            <span>Hospital Intranet Secure Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};
