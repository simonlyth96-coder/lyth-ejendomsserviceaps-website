import React from 'react';
import { SERVICES_LIST } from '../constants';
import { ChevronRight } from 'lucide-react';

interface ServicesProps {
    onServiceClick: (serviceId: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onServiceClick }) => {
  return (
    <section id="services" className="py-24 px-[5%] bg-[#0A2218]">
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Vores Ekspertise</h2>
        <p className="text-[#B0C4BB] text-lg">Totaldækkende service til private og erhverv. Klik på et kort for at se mere.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES_LIST.map((service) => (
          <div 
            key={service.id}
            onClick={() => onServiceClick(service.id)}
            className="bg-[#113826] p-8 rounded-xl border border-white/5 hover:border-[#00D16F] hover:-translate-y-2 transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
                <service.icon 
                size={36} 
                className="text-[#00D16F] group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="bg-[#0A2218] px-3 py-1 rounded-full border border-white/10 text-[#00D16F] text-xs font-bold">
                    {service.price}
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
            <p className="text-[#B0C4BB] text-sm leading-relaxed mb-6">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
