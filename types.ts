export enum ServiceType {
    SNOW_REMOVAL = 'snerydning',
    GARDENING = 'havearbejde',
    CLEANING = 'rengøring',
    CARPENTRY = 'tømrer',
    MASONRY = 'murer',
    PAVING = 'brolægning',
    TERRACE_CLEANING = 'terrasserens',
    FACILITY_MANAGEMENT = 'facility',
    MAINTENANCE = 'vedligehold',
    OTHER = 'andet'
  }
  
  export interface BookingFormData {
    service: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    date?: string;
    timeSlot?: string;
  }
  
  export interface ServiceStat {
    name: string;
    bookings: number;
  }

  export interface GeminiBookingResponse {
    service?: string;
    date?: string;
    name?: string;
    summary?: string;
  }

  export interface CalendarEvent {
    id: string;
    summary: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
  }