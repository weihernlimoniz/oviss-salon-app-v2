
import React, { useState } from 'react';
import { User, Gender } from '../types';

interface CreateAccountScreenProps {
  onSubmit: (data: Partial<User>) => void;
}

const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '25', // Default age
    gender: Gender.MALE,
    phone: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert age to a DOB string (approximate to Jan 1st of that birth year)
    // This allows age to auto-increase annually when calculated from this date
    const birthYear = new Date().getFullYear() - parseInt(formData.age);
    const dob = `${birthYear}-01-01`;

    const submissionData = {
      name: formData.name,
      dob: dob,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
    };

    onSubmit(submissionData);
  };

  // Generate age options 1 to 100
  const ageOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="p-6 pt-20 flex flex-col min-h-screen bg-zinc-100">
      <h1 className="text-3xl font-black text-zinc-900 mb-2">Welcome!</h1>
      <p className="text-zinc-500 mb-8 font-medium">Let's set up your profile to get started.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 px-1">Full Name *</label>
            <input 
              required
              type="text" 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 px-1">Age *</label>
              <select 
                required
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500/50 appearance-none"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({...prev, age: e.target.value}))}
              >
                {ageOptions.map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 px-1">Gender</label>
              <select 
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500/50 appearance-none"
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value as Gender}))}
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 px-1">Phone Number</label>
            <input 
              type="tel" 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
              placeholder="012xxxxxxx"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 px-1">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              placeholder="name@example.com"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-amber-500 text-zinc-950 font-bold py-4 rounded-2xl shadow-xl shadow-amber-500/10 active:scale-[0.98] transition-all mt-6"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateAccountScreen;
