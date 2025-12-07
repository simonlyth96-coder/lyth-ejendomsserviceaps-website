import React from 'react';
import { X, CalendarCheck } from 'lucide-react';

interface ServiceDetailModalProps {
  isOpen: boolean;
  service: any | null; // Using any for simplicity with the constants structure
  onClose: () => void;
  onBook: (serviceId: string) => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ isOpen, service, onClose, onBook }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0A2218] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0A2218]/95 backdrop-blur-sm border-b border-white/5 p-6 flex justify-between items-start">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <service.icon className="text-[#00D16F]" size={28} />
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{service.title}</h2>
                </div>
                <p className="text-[#00D16F] font-bold text-lg">{service.price}</p>
            </div>
            <button 
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
            >
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
            {/* Description */}
            <div className="bg-[#113826] p-6 rounded-xl border border-white/5">
                <p className="text-[#B0C4BB] leading-relaxed text-lg">{service.desc}</p>
            </div>

            {/* Gallery */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Udført Arbejde</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.images && service.images.map((img: string, idx: number) => (
                        <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-white/10 group relative">
                            <img 
                                src={img} 
                                alt={`${service.title} example ${idx + 1}`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 p-6 bg-[#0A2218] border-t border-white/5 flex justify-end gap-4">
            <button 
                onClick={onClose}
                className="px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors"
            >
                Luk
            </button>
            <button 
                onClick={() => {
                    onBook(service.id);
                    onClose();
                }}
                className="px-8 py-3 rounded-full bg-[#00D16F] text-[#0A2218] font-bold hover:bg-[#00a859] transition-colors flex items-center gap-2"
            >
                <CalendarCheck size={20} />
                Book {service.title} Nu
            </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;