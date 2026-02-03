
import React, { useState, useMemo, useEffect } from 'react';
import { Appointment, AssignmentType, Outlet, Stylist } from '../types';
import { OUTLETS, STYLISTS, SERVICES, TIME_SLOTS } from '../constants';

interface AppointmentScreenProps {
  appointments: Appointment[];
  onAdd: (data: Omit<Appointment, 'id' | 'userId' | 'status' | 'createdAt'>) => void;
  onCancel: (id: string) => void;
  lastOutletId: string;
  setLastOutletId: (id: string) => void;
  setIsSubFlowActive: (active: boolean) => void;
}

const AppointmentScreen: React.FC<AppointmentScreenProps> = ({ 
  appointments, 
  onAdd, 
  onCancel, 
  lastOutletId, 
  setLastOutletId,
  setIsSubFlowActive 
}) => {
  const [isBooking, setIsBooking] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | 'none' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    setIsSubFlowActive(isBooking);
  }, [isBooking, setIsSubFlowActive]);

  const upcomingAppointment = appointments.find(a => new Date(a.date).getTime() >= new Date().setHours(0,0,0,0));

  const resetBooking = () => {
    setIsBooking(false);
    setSelectedOutlet(null);
    setSelectedStylist(null);
    setSelectedTime(null);
    setSelectedServices([]);
  };

  const handleConfirm = () => {
    if (!selectedOutlet || !selectedTime || selectedServices.length === 0 || !selectedStylist) return;
    
    onAdd({
      outletId: selectedOutlet.id,
      date: selectedDate,
      timeSlot: selectedTime,
      stylistId: selectedStylist === 'none' ? null : selectedStylist.id,
      assignmentType: selectedStylist === 'none' ? AssignmentType.SYSTEM_AUTO : AssignmentType.MANUAL,
      serviceNames: selectedServices,
    });
    setLastOutletId(selectedOutlet.id);
    resetBooking();
  };

  const confirmCancel = () => {
    if (cancellingId) {
      onCancel(cancellingId);
      setCancellingId(null);
    }
  };

  const dateOptions = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  }, []);

  if (isBooking) {
    if (!selectedOutlet) {
      return (
        <div className="flex flex-col h-full bg-zinc-100 animate-in fade-in duration-300">
          <div 
            className="px-4 pb-2 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-zinc-200"
            style={{ paddingTop: 'calc(0.5rem + env(safe-area-inset-top))' }}
          >
            <button onClick={resetBooking} className="p-2 -ml-2 text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="font-bold text-zinc-900 text-sm">Select Outlet</span>
            <div className="w-10"></div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
            <div className="space-y-3 pb-8">
              {OUTLETS.map(o => (
                <div 
                  key={o.id}
                  onClick={() => setSelectedOutlet(o)}
                  className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-1 active:scale-[0.98] transition-all shadow-sm"
                >
                  <div className="aspect-[21/9] w-full rounded-xl overflow-hidden">
                    <img src={o.image} className="w-full h-full object-cover" alt={o.name} />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-base text-zinc-900 leading-tight">{o.name}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{o.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const isFormValid = selectedStylist && selectedTime && selectedServices.length > 0;

    return (
      <div className="flex flex-col h-full bg-zinc-100 animate-in slide-in-from-right duration-300 overflow-hidden">
        <div 
          className="px-4 pb-2 flex items-center justify-between bg-white border-b border-zinc-200 shrink-0"
          style={{ paddingTop: 'calc(0.5rem + env(safe-area-inset-top))' }}
        >
          <button onClick={() => setSelectedOutlet(null)} className="p-2 -ml-2 text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="text-center overflow-hidden">
            <span className="block font-black text-zinc-900 text-[10px] uppercase tracking-[0.1em]">Booking at</span>
            <span className="block text-[9px] text-amber-600 font-bold truncate max-w-[150px]">{selectedOutlet.name}</span>
          </div>
          <button onClick={resetBooking} className="p-2 -mr-2 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-32">
          {/* Section: Stylist - Ultra Compact */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400">1. Select Stylist</h3>
              {selectedStylist && selectedStylist !== 'none' && <span className="text-[9px] font-bold text-amber-600">{selectedStylist.name}</span>}
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {STYLISTS.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setSelectedStylist(s)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border min-w-[76px] transition-all ${selectedStylist !== 'none' && selectedStylist?.id === s.id ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'bg-white border-zinc-200 text-zinc-500'}`}
                >
                  <img src={s.image} className={`w-8 h-8 rounded-full object-cover border ${selectedStylist !== 'none' && selectedStylist?.id === s.id ? 'border-zinc-950/20' : 'border-zinc-100'}`} alt={s.name} />
                  <span className="text-[9px] font-black truncate w-full px-1">{s.name}</span>
                </button>
              ))}
              <button 
                onClick={() => setSelectedStylist('none')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border min-w-[76px] transition-all ${selectedStylist === 'none' ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'bg-white border-zinc-200 text-zinc-500'}`}
              >
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <span className="text-[9px] font-black">Any Stylist</span>
              </button>
            </div>
          </div>

          {/* Section: Date - Ultra Compact */}
          <div className="mt-4 space-y-1.5">
            <h3 className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 px-1">2. Pick Date</h3>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {dateOptions.map(date => (
                <button
                  key={date.full}
                  onClick={() => setSelectedDate(date.full)}
                  className={`flex flex-col items-center min-w-[44px] py-1.5 rounded-xl border transition-all ${selectedDate === date.full ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'bg-white border-zinc-200 text-zinc-500'}`}
                >
                  <span className="text-[8px] uppercase font-black opacity-70">{date.dayName}</span>
                  <span className="text-xs font-black">{date.dayNum}</span>
                  <span className="text-[7px] font-bold opacity-70 uppercase">{date.month}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Time - Tight Grid */}
          <div className="mt-4 space-y-1.5">
            <h3 className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 px-1">3. Time Slot</h3>
            <div className="grid grid-cols-4 gap-1">
              {TIME_SLOTS.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 rounded-lg border text-[9px] transition-all font-black uppercase ${selectedTime === time ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'bg-white border-zinc-200 text-zinc-400'}`}
                >
                  {time.replace(':00 ', '').toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Services - Slim rows */}
          <div className="mt-4 space-y-1.5">
            <h3 className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 px-1">4. Services</h3>
            <div className="grid grid-cols-1 gap-1">
              {SERVICES.map(s => (
                <label key={s.id} className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all cursor-pointer ${selectedServices.includes(s.name) ? 'border-amber-500 bg-amber-500/5' : 'bg-white border-zinc-200'}`}>
                  <input 
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-amber-500 rounded"
                    checked={selectedServices.includes(s.name)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedServices(prev => [...prev, s.name]);
                      else setSelectedServices(prev => prev.filter(name => name !== s.name));
                    }}
                  />
                  <span className={`font-bold text-[10px] ${selectedServices.includes(s.name) ? 'text-zinc-900' : 'text-zinc-500'}`}>{s.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div 
          className="px-4 pb-4 pt-3 bg-white border-t border-zinc-200 fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md z-50 flex flex-col gap-2"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
          {isFormValid && (
            <div className="flex justify-between items-center px-1 text-[10px] font-bold text-zinc-400 mb-1">
              <span>Total Services: {selectedServices.length}</span>
              <span>{selectedTime} • {selectedDate.split('-').slice(1).join('/')}</span>
            </div>
          )}
          <button 
            onClick={handleConfirm}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${isFormValid ? 'bg-amber-500 text-zinc-950 shadow-amber-500/20' : 'bg-zinc-100 text-zinc-300 grayscale cursor-not-allowed'}`}
          >
            {isFormValid ? 'CONFIRM BOOKING' : 'PLEASE COMPLETE SELECTION'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      {/* Cancellation Modal */}
      {cancellingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-6 animate-in zoom-in-95 duration-200 shadow-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-zinc-900">Cancel Appointment?</h3>
              <p className="text-zinc-500 text-sm font-medium">This action cannot be undone. Are you sure you want to proceed?</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => setCancellingId(null)} className="py-3.5 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-bold">No, Keep It</button>
              <button onClick={confirmCancel} className="py-3.5 rounded-xl bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-600/20">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Upcoming Appointment Section */}
      <section>
        <h2 className="text-2xl font-black mb-5 text-zinc-900 tracking-tight flex items-center gap-2">
          Your Next Visit
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
        </h2>
        {upcomingAppointment ? (
          <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl transition-all active:scale-[0.99]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32"></div>
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Confirmed</span>
                </div>
                <h3 className="font-black text-3xl text-zinc-900 leading-tight">
                  {OUTLETS.find(o => o.id === upcomingAppointment.outletId)?.name.split(' – ')[1] || 'Oviss Salon'}
                </h3>
              </div>

              <div className="flex items-center gap-5 bg-zinc-50 p-5 rounded-[1.75rem] border border-zinc-100">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex flex-col items-center justify-center text-zinc-950 shadow-xl shadow-amber-500/20">
                  <span className="text-[10px] font-black uppercase leading-none mb-1">{new Date(upcomingAppointment.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-2xl font-black leading-none">{new Date(upcomingAppointment.date).getDate()}</span>
                </div>
                <div>
                  <p className="text-2xl font-black text-zinc-900 leading-none mb-1">{upcomingAppointment.timeSlot}</p>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{new Date(upcomingAppointment.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={STYLISTS.find(s => s.id === upcomingAppointment.stylistId)?.image || 'https://picsum.photos/200'} 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                      alt="Stylist"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Your Expert</p>
                    <p className="text-lg font-black text-zinc-900 leading-tight">{STYLISTS.find(s => s.id === upcomingAppointment.stylistId)?.name || 'Auto Assigned'}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {upcomingAppointment.serviceNames.map(name => (
                    <span key={name} className="px-5 py-2.5 bg-zinc-900 text-white rounded-2xl text-[12px] font-black shadow-lg shadow-zinc-950/20">{name}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                <button 
                  onClick={() => setIsBooking(true)}
                  className="py-5 rounded-[1.25rem] bg-zinc-100 text-zinc-900 text-sm font-black transition-all active:scale-95"
                >
                  Reschedule
                </button>
                <button 
                  onClick={() => setCancellingId(upcomingAppointment.id)}
                  className="py-5 rounded-[1.25rem] bg-red-50 text-red-600 text-sm font-black border border-red-100 transition-all active:scale-95 active:bg-red-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 border-4 border-dotted border-zinc-200 rounded-[3rem] text-center space-y-6 bg-white/50 backdrop-blur-sm">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-zinc-200 shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-500 text-xl font-black">No upcoming visits</p>
              <p className="text-zinc-400 text-xs font-medium px-6">Your next transformation is just a few taps away.</p>
            </div>
          </div>
        )}
      </section>

      {/* Prominent New Appointment Button */}
      <button 
        onClick={() => setIsBooking(true)}
        className="w-full bg-amber-500 text-zinc-950 py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-amber-500/30 active:scale-95 transition-all group"
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        </div>
        Book New Session
      </button>

      {/* History Section */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">Past Visits</h2>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">View All</span>
        </div>
        <div className="space-y-4 pb-12">
          {appointments.filter(a => new Date(a.date).getTime() < new Date().setHours(0,0,0,0)).length === 0 ? (
            <div className="py-12 bg-white rounded-[2rem] border border-zinc-200 text-center shadow-sm">
              <p className="text-xs text-zinc-400 italic font-medium px-10 leading-relaxed">Your style journey history will appear here once you've visited us.</p>
            </div>
          ) : (
            appointments.filter(a => new Date(a.date).getTime() < new Date().setHours(0,0,0,0)).map(a => (
              <div key={a.id} className="bg-white p-6 rounded-[2rem] flex items-center justify-between border border-zinc-200 shadow-sm active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100 text-zinc-300">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-zinc-900">{OUTLETS.find(o => o.id === a.outletId)?.name.split(' – ')[1] || 'Oviss Salon'}</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-3 py-1.5 bg-zinc-50 rounded-full border border-zinc-100 shadow-inner">Completed</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentScreen;
