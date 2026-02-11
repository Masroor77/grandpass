import React, { useEffect, useMemo, useState } from 'react';
import { Shield, KeyRound, Save, LogOut, User, Store, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LS_PROFILE_KEY = 'grandpass.admin.profile.v1';
const LS_PIN_KEY = 'grandpass.admin.pin.v1';
const LS_UNLOCK_KEY = 'grandpass.admin.unlocked.v1';

const defaultProfile = {
  shopName: 'GRAND PASS',
  ownerName: 'Admin User',
  role: 'Shop Owner',
  contactMobile: '',
};

function maskPin(pin) {
  return pin ? '•'.repeat(Math.min(pin.length, 8)) : '';
}

export default function Admin() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(defaultProfile);
  const [pin, setPin] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    try {
      const storedProfile = JSON.parse(localStorage.getItem(LS_PROFILE_KEY) || 'null');
      const storedPin = localStorage.getItem(LS_PIN_KEY) || '';
      const storedUnlocked = localStorage.getItem(LS_UNLOCK_KEY) === 'true';

      if (storedProfile && typeof storedProfile === 'object') setProfile({ ...defaultProfile, ...storedProfile });
      setPin(storedPin);
      setUnlocked(storedUnlocked && !!storedPin);
    } catch {
      // ignore
    }
  }, []);

  const needsSetup = useMemo(() => !pin, [pin]);

  const saveProfile = () => {
    setMsg('');
    setErr('');
    try {
      localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));
      setMsg('Saved.');
    } catch {
      setErr('Could not save (storage blocked).');
    }
  };

  const setupPin = () => {
    setMsg('');
    setErr('');
    const digitsOnly = pinInput.replace(/\D/g, '');
    if (digitsOnly.length < 4) {
      setErr('PIN must be at least 4 digits.');
      return;
    }
    try {
      localStorage.setItem(LS_PIN_KEY, digitsOnly);
      localStorage.setItem(LS_UNLOCK_KEY, 'true');
      setPin(digitsOnly);
      setUnlocked(true);
      setPinInput('');
      setMsg('PIN set. Admin unlocked.');
    } catch {
      setErr('Could not save PIN (storage blocked).');
    }
  };

  const unlock = () => {
    setMsg('');
    setErr('');
    const digitsOnly = pinInput.replace(/\D/g, '');
    if (!digitsOnly) {
      setErr('Enter your PIN.');
      return;
    }
    if (digitsOnly !== pin) {
      setErr('Wrong PIN.');
      return;
    }
    try {
      localStorage.setItem(LS_UNLOCK_KEY, 'true');
    } catch {
      // ignore
    }
    setUnlocked(true);
    setPinInput('');
    setMsg('Unlocked.');
  };

  const logout = () => {
    setMsg('');
    setErr('');
    try {
      localStorage.setItem(LS_UNLOCK_KEY, 'false');
    } catch {
      // ignore
    }
    setUnlocked(false);
    navigate('/services');
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl pb-24 md:pb-8">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
          <Shield size={16} />
          Admin / Shop Owner
        </div>
        <h1 className="text-3xl font-bold text-white mt-4">Admin Panel</h1>
        <p className="text-slate-400 mt-1">Secure access + shop profile settings for GRAND PASS.</p>
      </div>

      <div className="bg-dark-800 rounded-3xl shadow-xl border border-dark-700 overflow-hidden">
        <div className="p-6 border-b border-dark-700 bg-dark-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-dark-900/60 border border-dark-700">
              <KeyRound size={18} className="text-indigo-300" />
            </div>
            <div>
              <div className="text-white font-semibold">Admin Access</div>
              <div className="text-xs text-slate-500">
                {needsSetup ? 'Set a PIN for access control.' : unlocked ? `Unlocked (PIN: ${maskPin(pin)})` : 'Locked (PIN required)'}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-dark-600 text-slate-300 hover:bg-dark-700 transition-colors flex items-center gap-2"
            type="button"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!unlocked && (
            <div className="rounded-2xl border border-dark-700 bg-dark-900/40 p-5">
              <div className="text-white font-semibold mb-1">{needsSetup ? 'Set Admin PIN' : 'Unlock Admin'}</div>
              <div className="text-sm text-slate-400 mb-4">
                {needsSetup ? 'Choose a numeric PIN (min 4 digits).' : 'Enter your PIN to access admin settings.'}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="flex-1 px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 outline-none"
                  placeholder="Enter PIN"
                  inputMode="numeric"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                />
                <button
                  onClick={needsSetup ? setupPin : unlock}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-colors font-medium"
                  type="button"
                >
                  {needsSetup ? 'Set PIN' : 'Unlock'}
                </button>
              </div>
            </div>
          )}

          {unlocked && (
            <>
              <div className="rounded-2xl border border-dark-700 bg-dark-900/40 p-5">
                <div className="text-white font-semibold mb-4">Shop Profile</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Shop Name</label>
                    <div className="relative">
                      <Store size={18} className="absolute left-3 top-3.5 text-slate-500" />
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 outline-none"
                        value={profile.shopName}
                        onChange={(e) => setProfile((p) => ({ ...p, shopName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Owner Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-3.5 text-slate-500" />
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 outline-none"
                        value={profile.ownerName}
                        onChange={(e) => setProfile((p) => ({ ...p, ownerName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Role</label>
                    <input
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 outline-none"
                      value={profile.role}
                      onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Contact Mobile</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-3.5 text-slate-500" />
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 outline-none"
                        inputMode="numeric"
                        placeholder="Optional"
                        value={profile.contactMobile}
                        onChange={(e) => setProfile((p) => ({ ...p, contactMobile: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={saveProfile}
                    className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 font-medium"
                    type="button"
                  >
                    <Save size={18} />
                    Save
                  </button>
                </div>
              </div>
            </>
          )}

          {(err || msg) && (
            <div
              className={[
                'rounded-2xl border px-4 py-3 text-sm',
                err ? 'border-rose-500/20 bg-rose-500/10 text-rose-200' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
              ].join(' ')}
            >
              {err || msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

