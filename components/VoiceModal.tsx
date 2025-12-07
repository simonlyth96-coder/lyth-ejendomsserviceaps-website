import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Loader2 } from 'lucide-react';
import { analyzeVoiceBooking } from '../services/geminiService';
import { GeminiBookingResponse } from '../types';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingFound: (data: GeminiBookingResponse) => void;
}

const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, onBookingFound }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Klar til at lytte...");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isOpen) {
      startRecording();
    } else {
      stopRecordingCleanup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatusText("Lytter...");
    } catch (err) {
      console.error("Mic Error:", err);
      setStatusText("Kunne ikke få adgang til mikrofonen.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      setStatusText("Behandler din anmodning...");
    }
  };

  const stopRecordingCleanup = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsProcessing(false);
    setStatusText("Klar til at lytte...");
  };

  const processAudio = async (blob: Blob) => {
    const result = await analyzeVoiceBooking(blob);
    setIsProcessing(false);
    
    if (result.summary) {
        setStatusText(result.summary);
    }

    if (result.service || result.date) {
        // Short delay to read message before closing
        setTimeout(() => {
            onBookingFound(result);
            onClose();
        }, 1500);
    } else {
        setStatusText("Kunne ikke genkende en service. Prøv igen.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0A2218] border border-[#00D16F]/30 rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl shadow-[#00D16F]/20">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
            <X size={24} />
        </button>

        <div className="mb-8 flex justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-[#00D16F] pulse-ring' : 'bg-[#113826] border border-[#00D16F]'}`}>
                {isProcessing ? (
                    <Loader2 size={40} className="text-[#0A2218] animate-spin" />
                ) : (
                    <Mic size={40} className={isRecording ? 'text-[#0A2218]' : 'text-[#00D16F]'} />
                )}
            </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">{statusText}</h3>
        <p className="text-[#B0C4BB] italic text-sm mb-6 min-h-[1.5rem]">
            {isRecording ? '"Jeg vil gerne bestille snerydning på fredag..."' : ''}
        </p>

        {isRecording && (
             <button 
             onClick={stopRecording}
             className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
           >
             Stop Optagelse
           </button>
        )}
       
       {!isRecording && !isProcessing && (
           <button 
           onClick={startRecording}
           className="bg-[#00D16F] hover:bg-[#00a859] text-[#0A2218] font-bold py-2 px-6 rounded-full transition-colors"
         >
           Prøv Igen
         </button>
       )}

      </div>
    </div>
  );
};

export default VoiceModal;