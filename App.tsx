import React, { useState } from 'react';
import { Mic, Leaf, Phone, Mail, MapPin, Menu, X, Home as HomeIcon } from 'lucide-react';
import Services from './components/Services';
import Booking from './components/Booking';
import Stats from './components/Stats';
import VoiceModal from './components/VoiceModal';
import ServiceDetailModal from './components/ServiceDetailModal';
import { CONTACT_INFO, SERVICES_LIST } from './constants';
import { BookingFormData, GeminiBookingResponse } from './types';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceBookingData, setVoiceBookingData] = useState<Partial<BookingFormData>>({});
  
  // State for Service Detail Modal
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleVoiceBookingData = (data: GeminiBookingResponse) => {
    setVoiceBookingData({
        service: data.service || '',
        name: data.name || '',
        date: data.date,
        message: data.summary || ''
    });
    // Smooth scroll to booking
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServiceClick = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  const handleBookService = (serviceId: string) => {
    setVoiceBookingData(prev => ({ ...prev, service: serviceId }));
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedService = SERVICES_LIST.find(s => s.id === selectedServiceId) || null;

  return (
    <div className="min-h-screen text-white relative">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-40 bg-[#0A2218]/95 backdrop-blur-md border-b border-white/5">
        <div className="px-[5%] h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 text-xl font-extrabold tracking-wide">
             <HomeIcon className="text-[#00D16F]" size={28} />
             <span>LYTH <span className="text-[#00D16F]">EJENDOMSSERVICE</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="hover:text-[#00D16F] transition-colors font-medium">Ydelser</a>
            <a href="#about" className="hover:text-[#00D16F] transition-colors font-medium">Om Os</a>
            <a href="#contact" className="hover:text-[#00D16F] transition-colors font-medium">Kontakt</a>
            <button 
              onClick={() => setIsVoiceModalOpen(true)}
              className="bg-[#00D16F] text-[#0A2218] px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-[#00a859] transition-all hover:shadow-[0_0_15px_rgba(0,209,111,0.4)]"
            >
              <Mic size={18} /> Voice booking
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0A2218] border-t border-white/5 p-8 flex flex-col gap-6">
             <a href="#services" onClick={toggleMenu} className="text-lg">Ydelser</a>
             <a href="#about" onClick={toggleMenu} className="text-lg">Om Os</a>
             <a href="#contact" onClick={toggleMenu} className="text-lg">Kontakt</a>
             <button 
               onClick={() => { toggleMenu(); setIsVoiceModalOpen(true); }}
               className="bg-[#00D16F] text-[#0A2218] py-3 rounded-full font-bold flex justify-center items-center gap-2"
             >
               <Mic size={20} /> Voice booking
             </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center px-[5%] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Modern Architecture" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A2218] via-[#0A2218]/90 to-[#0A2218]"></div>
        </div>

        {/* Decorative Circle */}
        <div className="absolute -right-24 -bottom-24 w-[600px] h-[600px] border border-[#00D16F]/20 rounded-full z-0 pointer-events-none hidden lg:block"></div>

        <div className="relative z-10 max-w-4xl">
           <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#00D16F]/30 bg-[#00D16F]/10 text-[#00D16F] text-sm font-bold tracking-wider mb-8">
             <Leaf size={14} /> NÆSTE GENERATIONS EJENDOMSSERVICE
           </div>
           <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
             Din Ejendom.<br />
             Vores <span className="text-[#00D16F]">Ansvar.</span>
           </h1>
           <p className="text-[#B0C4BB] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
             Vi kombinerer klassisk håndværk med moderne teknologi for at sikre grønne, rene og velfungerende omgivelser. Tømrer, murer, rengøring og vedligehold i én samlet løsning.
           </p>
           
           <div className="flex flex-col sm:flex-row gap-4">
             <button 
                onClick={() => setIsVoiceModalOpen(true)}
                className="bg-[#00D16F] text-[#0A2218] px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#00a859] transition-all hover:-translate-y-1"
             >
               <Mic /> Prøv Voice Booking
             </button>
             <a 
               href="#services"
               className="border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center hover:border-[#00D16F] hover:text-[#00D16F] transition-colors"
             >
               Se Vores Ydelser
             </a>
           </div>
        </div>
      </section>

      <Services onServiceClick={handleServiceClick} />
      
      <Booking initialData={voiceBookingData} />

      <Stats />

      {/* Contact Section */}
      <section id="contact" className="py-20 px-[5%] flex flex-wrap justify-between items-center gap-12 bg-[#0A2218]">
        <div>
          <h2 className="text-3xl font-bold mb-8">Kontakt Os</h2>
          <div className="space-y-6">
            {CONTACT_INFO.map((info, idx) => (
              <div key={idx} className="flex items-center gap-4 text-[#B0C4BB]">
                <info.icon className="text-[#00D16F]" size={24} />
                <span className="text-lg">{info.text}</span>
              </div>
            ))}
             <div className="flex items-center gap-4 text-[#B0C4BB]">
                <span className="w-6 text-center text-[#00D16F] font-bold">ID</span>
                <span className="text-lg">CVR: 43288741</span>
              </div>
          </div>
        </div>
        <div className="opacity-10">
          <HomeIcon size={200} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-[#B0C4BB] text-sm border-t border-white/5">
        <p>&copy; 2025 Lyth Ejendomsservice ApS. Alle rettigheder forbeholdes.</p>
      </footer>

      {/* Voice Modal */}
      <VoiceModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
        onBookingFound={handleVoiceBookingData}
      />
      
      {/* Service Detail Modal */}
      <ServiceDetailModal 
        isOpen={!!selectedServiceId}
        service={selectedService}
        onClose={() => setSelectedServiceId(null)}
        onBook={handleBookService}
      />
    </div>
  );
};

export default App;