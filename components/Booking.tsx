import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarCheck, Lock } from 'lucide-react';
import { BookingFormData, ServiceType, CalendarEvent } from '../types';
import { SERVICES_LIST } from '../constants';
import { initCalendarClient, signInToGoogle, getBusySlots, addBookingEvent } from '../services/calendarService';

interface BookingProps {
  initialData: Partial<BookingFormData>;
}

const Booking: React.FC<BookingProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    service: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    date: '',
    timeSlot: ''
  });

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [busyEvents, setBusyEvents] = useState<CalendarEvent[]>([]);

  // Initialize Google Client
  useEffect(() => {
    initCalendarClient()
      .then(() => console.log("Google Calendar Integration Ready (or skipped if unconfigured)"))
      .catch(err => {
          console.warn("Failed to init Google API. This is expected if keys are invalid.", err);
      });
  }, []);

  useEffect(() => {
    if (initialData.service) {
        const matched = SERVICES_LIST.find(s => 
            initialData.service?.toLowerCase().includes(s.title.toLowerCase()) ||
            initialData.service?.toLowerCase().includes(s.id)
        );
        if (matched) {
            setFormData(prev => ({ ...prev, service: matched.id }));
        } else {
            setFormData(prev => ({ ...prev, service: 'andet' }));
        }
    }
    if (initialData.name) {
        setFormData(prev => ({...prev, name: initialData.name || ''}));
    }
    if (initialData.message) {
        setFormData(prev => ({...prev, message: initialData.message || ''}));
    }
  }, [initialData]);

  // Fetch events when calendar is connected
  useEffect(() => {
    if (calendarConnected) {
      // Fetch for December 2025
      const start = new Date('2025-12-01T00:00:00');
      const end = new Date('2025-12-31T23:59:59');
      getBusySlots(start, end).then(events => setBusyEvents(events));
    }
  }, [calendarConnected]);

  const handleConnectCalendar = async () => {
    try {
      await signInToGoogle();
      setCalendarConnected(true);
      alert("Forbundet til Google Kalender! Tider der er optaget i din kalender vil nu blive skjult.");
    } catch (err) {
      console.error(err);
      alert("Kunne ikke forbinde. Tjek dine API nøgler i constants.ts");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    // Set date string for 2025
    const dateStr = `2025-12-${day.toString().padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, date: dateStr, timeSlot: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.timeSlot && selectedDay) {
        alert("Husk at vælge et tidspunkt.");
        return;
    }

    if (calendarConnected) {
        try {
            await addBookingEvent(formData);
            alert("Booking oprettet og synkroniseret til din Google Kalender!");
        } catch (err) {
            alert("Booking oprettet lokalt, men kunne ikke synkronisere til kalender.");
        }
          
    } else {
        alert(`Booking anmodning sendt for ${formData.service || 'service'}! \nTak fordi du valgte Lyth Ejendomsservice.`);
    }

    // Send webhook notification
    try {
      await fetch('/api/booking-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (webhookErr) {
      console.warn('Webhook notification failed:', webhookErr);
    }
    

    // Reset form
    setFormData({
        service: '',
        name: '',
        email: '',
        phone: '',
        message: '',
        date: '',
        timeSlot: ''
    });
    setSelectedDay(null);
  };

  // Generate 30-minute time slots from 08:00 to 16:00
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 16;
    
    for (let h = startHour; h < endHour; h++) {
        const hourStr = h.toString().padStart(2, '0');
        const nextHourStr = (h + 1).toString().padStart(2, '0');
        slots.push(`${hourStr}:00 - ${hourStr}:30`);
        slots.push(`${hourStr}:30 - ${nextHourStr}:00`);
    }
    return slots;
  };

  const checkAvailability = (slot: string, day: number) => {
    if (!calendarConnected || busyEvents.length === 0) return true;

    const [startStr] = slot.split(' - ');
    // const slotHour = parseInt(startStr.split(':')[0]);
    // const slotMin = parseInt(startStr.split(':')[1]);

    const slotTime = new Date(`2025-12-${day.toString().padStart(2, '0')}T${startStr}:00`);
    
    // Check overlap with any busy event
    return !busyEvents.some(event => {
        const eventStart = new Date(event.start.dateTime || event.start.date); // Handle all-day events roughly
        const eventEnd = new Date(event.end.dateTime || event.end.date);
        
        // Simple overlap check
        // Check if the slot start time falls within an event
        const slotEnd = new Date(slotTime);
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);

        return (slotTime >= eventStart && slotTime < eventEnd) || 
               (slotEnd > eventStart && slotEnd <= eventEnd) ||
               (slotTime <= eventStart && slotEnd >= eventEnd);
    });
  };

  const allTimeSlots = generateTimeSlots();

  return (
    <section id="booking" className="py-24 px-[5%] bg-[#0D2B1F]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Form Side */}
        <div>
          <h2 className="text-4xl font-bold text-white mb-6">Book en tid</h2>
          <p className="text-[#B0C4BB] mb-8">
            Vælg en dato i kalenderen eller brug vores <strong className="text-[#00D16F]">Voice Booking</strong> funktion til at finde en ledig tid automatisk.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#B0C4BB] text-sm mb-2">Vælg Service</label>
              <select 
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00D16F]"
              >
                <option value="" className="bg-[#0A2218] text-white">Vælg service...</option>
                {SERVICES_LIST.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#0A2218] text-white">{s.title} - {s.price}</option>
                ))}
                <option value="andet" className="bg-[#0A2218] text-white">Andet</option>
              </select>
            </div>

            <div>
              <label className="block text-[#B0C4BB] text-sm mb-2">Dine Kontaktoplysninger</label>
              <div className="space-y-4">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Navn" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00D16F]"
                  required
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00D16F]"
                  required
                />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Telefon (+45...)" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00D16F]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#B0C4BB] text-sm mb-2">Besked (Valgfri)</label>
              <textarea 
                rows={3} 
                name="message"
                placeholder="Yderligere detaljer..."
                value={formData.message}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00D16F]"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#00D16F] text-[#0A2218] font-bold py-4 rounded-full hover:bg-[#00a859] transition-transform hover:-translate-y-1"
            >
              Bekræft Booking
            </button>
          </form>
        </div>

        {/* Calendar Side */}
        <div className="bg-[#0A2218] p-8 rounded-2xl border border-white/5 h-fit relative">
            
            {/* Admin Connect Button */}
            <div className="absolute top-4 right-4">
                {!calendarConnected ? (
                    <button 
                        onClick={handleConnectCalendar}
                        className="text-xs text-[#B0C4BB] hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                        title="Forbind Google Kalender for at synkronisere"
                    >
                        <Lock size={12} /> Admin: Tilslut Kalender
                    </button>
                ) : (
                    <div className="text-xs text-[#00D16F] flex items-center gap-1">
                        <CalendarCheck size={12} /> Kalender Synkroniseret
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mb-6 mt-4">
                <h3 className="text-xl font-bold text-white">December 2025</h3>
                <div className="flex gap-2">
                    <button className="p-2 hover:text-[#00D16F] text-white"><ChevronLeft size={20} /></button>
                    <button className="p-2 hover:text-[#00D16F] text-white"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['Man','Tir','Ons','Tor','Fre','Lør','Søn'].map(d => (
                    <div key={d} className="text-[#B0C4BB] text-xs uppercase font-semibold">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mb-8">
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map((day, idx) => {
                    const isCurrentMonth = idx > 1 && idx < 33;
                    const isSelected = selectedDay === day && isCurrentMonth;
                    
                    return (
                        <div 
                            key={idx}
                            onClick={() => isCurrentMonth && handleDayClick(day)}
                            className={`
                                py-3 rounded-lg text-sm cursor-pointer transition-colors
                                ${!isCurrentMonth ? 'opacity-30 cursor-default' : 'hover:bg-[#00D16F]/20'}
                                ${isSelected ? 'bg-[#00D16F] text-[#0A2218] font-bold' : 'bg-[#113826] text-white'}
                            `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {selectedDay && (
                <div className="animate-fade-in">
                    <h4 className="text-[#B0C4BB] text-sm mb-3">Ledige tider d. {selectedDay} Dec (30 min intervaller):</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {allTimeSlots.map((slot, i) => {
                            const isAvailable = checkAvailability(slot, selectedDay);
                            return (
                                <button 
                                    key={i}
                                    disabled={!isAvailable}
                                    onClick={() => isAvailable && setFormData(p => ({...p, timeSlot: slot}))}
                                    className={`
                                        p-2 rounded border text-xs text-center transition-all
                                        ${!isAvailable ? 'bg-red-500/10 border-red-500/20 text-red-500 line-through cursor-not-allowed' : 
                                          formData.timeSlot === slot ? 'bg-[#00D16F] border-[#00D16F] text-[#0A2218] cursor-pointer' : 'bg-white/5 border-transparent text-white hover:border-[#00D16F] cursor-pointer'}
                                    `}
                                >
                                    {slot}
                                </button>
                            );
                        })}
                    </div>
                    {calendarConnected && busyEvents.length > 0 && (
                        <p className="text-xs text-center mt-2 text-[#B0C4BB] italic">Tider synkroniseret med Google Kalender</p>
                    )}
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default Booking;
