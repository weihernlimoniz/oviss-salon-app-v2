
import React, { useState } from 'react';
import { User, Gender } from '../types';

interface ProfileScreenProps {
  user: User | null;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    gender: user?.gender || Gender.OTHER,
    profilePic: user?.profilePic || 'https://picsum.photos/seed/user/400/400'
  });

  if (!user) return null;

  const handleUpdate = () => {
    onUpdateUser({ ...user, ...formData });
    setIsEditing(false);
  };

  const handleTopUp = () => {
    alert('Redirecting to secure payment gateway for Top Up...');
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      {/* Header Profile Info */}
      <div className="flex flex-col items-center text-center pt-6">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-xl mx-auto">
            <img src={formData.profilePic} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-1 right-1 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white text-zinc-950 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900">{user.name}</h2>
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mt-1">Valued Member</p>
      </div>

      {/* Stats/Credit */}
      <div className="bg-white rounded-3xl p-5 flex justify-between items-center shadow-sm border border-zinc-200">
        <div className="space-y-1">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Available Credit</p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-black text-amber-600">RM {user.creditBalance.toFixed(2)}</p>
            <button 
              onClick={handleTopUp}
              className="text-[10px] bg-amber-500 text-zinc-950 px-2.5 py-1 rounded-full font-bold shadow-sm shadow-amber-500/20 active:scale-95 transition-transform"
            >
              TOP UP
            </button>
          </div>
        </div>
        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-3 pb-8">
        {isEditing ? (
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block px-1">Full Name</label>
              <input 
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:ring-1 focus:ring-amber-500 transition-all outline-none"
                value={formData.name}
                onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block px-1">Email</label>
              <input 
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:ring-1 focus:ring-amber-500 transition-all outline-none"
                value={formData.email}
                onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block px-1">Birthday</label>
                <input 
                  type="date"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:ring-1 focus:ring-amber-500 transition-all outline-none"
                  value={formData.dob}
                  onChange={e => setFormData(prev => ({...prev, dob: e.target.value}))}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block px-1">Gender</label>
                <select 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:ring-1 focus:ring-amber-500 transition-all appearance-none outline-none"
                  value={formData.gender}
                  onChange={e => setFormData(prev => ({...prev, gender: e.target.value as Gender}))}
                >
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                  <option value={Gender.OTHER}>Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleUpdate} className="flex-1 bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors">Save Changes</button>
              <button onClick={() => setIsEditing(false)} className="px-5 bg-zinc-100 text-zinc-900 font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-zinc-200 group shadow-sm active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-amber-500 transition-colors border border-zinc-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-zinc-950 transition-colors"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold block text-sm text-zinc-900">Edit Profile</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-tighter font-medium">Personal Information</span>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-amber-500"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            <button className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-zinc-200 group shadow-sm active:scale-[0.99] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold block text-sm text-zinc-900">Privacy Policy</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-tighter font-medium">Terms & Conditions</span>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-amber-500"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            <button 
              onClick={onLogout}
              className="w-full bg-red-50/50 p-4 rounded-2xl flex items-center justify-between border border-red-100 group active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </div>
                <span className="font-semibold text-sm text-red-600">Logout</span>
              </div>
            </button>
          </div>
        )}
      </div>

      <div className="text-center pt-4 opacity-50">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Oviss Salon v1.0.0-mvp</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
