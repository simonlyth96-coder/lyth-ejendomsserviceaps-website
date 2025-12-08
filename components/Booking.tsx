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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    alert(`Booking anmodning sendt for ${formData.service || 'service'}! \\nTak fordi du valgte Lyth Ejendomsservice.`);
    
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
  };

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
          <iframe 
            src="https://calendar.google.com/calendar/embed?src=lythejendomsservice%40gmail.com&ctz=Europe%2FCopenhagen" 
            style={{ border: 0 }} 
            width="100%" 
            height="600" 
            frameBorder={0}
            scrolling="no"
            title="Lyth Ejendomsservice Booking Calendar"
          />
        </div>

      </div>
    </section>
  );
};

export default Booking;
