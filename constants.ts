import { ServiceType } from './types';
import { Home, Hammer, Brush, Snowflake, Leaf, Truck, Droplets, Building2, Wrench, Calendar, Phone, Mail, MapPin } from 'lucide-react';

export const COLORS = {
  primaryDark: '#0A2218',
  primaryGreen: '#113826',
  accentGreen: '#00D16F',
  textLight: '#FFFFFF',
  textGray: '#B0C4BB',
};

// Google Calendar Configuration
// NOTE: You must replace these with your own Client ID and API Key from Google Cloud Console.
// Enable "Google Calendar API" in your library.
export const GOOGLE_CALENDAR_CONFIG = {
  apiKey: process.env.GOOGLE_API_KEY || 'AIzaSyAly7tkcEYvsZPZGBfUavLdFVvyutG0uIk',
  clientId: process.env.GOOGLE_CLIENT_ID || '577147986442-v9ct40t5i52589nffflck9rche9q2vkq.apps.googleusercontent.com,  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
  scopes: "https://www.googleapis.com/auth/calendar.events",
};

export const SERVICES_LIST = [
  { 
    id: ServiceType.CARPENTRY, 
    title: 'Tømrerarbejde', 
    price: '400,- ekskl. moms/time',
    icon: Hammer, 
    desc: 'Professionel udførelse af alt fra små reparationer til større byggeprojekter.',
    images: [    ]
  },
  { 
    id: ServiceType.MASONRY, 
    title: 'Murerarbejde', 
    price: '400,- ekskl. moms/time',
    icon: Building2, 
    desc: 'Kvalitetsbevidst murerarbejde, renovering af facader og flisearbejde.',
    images: [    ]
  },
  { 
    id: ServiceType.CLEANING, 
    title: 'Rengøring', 
    price: '350,- ekskl. moms/time',
    icon: Brush, 
    desc: 'Grundig rengøring af kontorer, trappeopgange og private hjem.',
    images: [
      
    ]
  },
  { 
    id: ServiceType.SNOW_REMOVAL, 
    title: 'Snerydning', 
    price: '400,- ekskl. moms/time',
    icon: Snowflake, 
    desc: 'Pålidelig snerydning og saltning, så du kan færdes sikkert.',
    images: [
     
    ]
  },
  { 
    id: ServiceType.GARDENING, 
    title: 'Havearbejde', 
    price: '350,- ekskl. moms/time',
    icon: Leaf, 
    desc: 'Græsslåning, hækklipning og generel pasning af grønne arealer.',
    images: [
      
    ]
  },
  { 
    id: ServiceType.PAVING, 
    title: 'Brolægning', 
    price: '400,- ekskl. moms/time',
    icon: Truck, 
    desc: 'Etablering af indkørsler, terrasser og stier i høj kvalitet.',
    images: [
      ]
  },
  { 
    id: ServiceType.TERRACE_CLEANING, 
    title: 'Terrasserens', 
    price: '400,- ekskl. moms/time',
    icon: Droplets, 
    desc: 'Effektiv fjernelse af alger og snavs fra træ- og fliseterrasser.',
    images: [
    
    ]
  },
  { 
    id: ServiceType.FACILITY_MANAGEMENT, 
    title: 'Facility Mgt.', 
    price: '400,- ekskl. moms/time',
    icon: Home, 
    desc: 'Totaldrift af ejendomme. Vi holder overblikket for dig.',
    images: [
      
    ]
  },
  { 
    id: ServiceType.MAINTENANCE, 
    title: 'Vedligeholdelse', 
    price: '350,- ekskl. moms/time',
    icon: Wrench, 
    desc: 'Løbende vedligehold der forebygger skader og bevarer værdien.',
    images: [
     
    ]
  },
];

export const MOCK_STATS_DATA = [
  { name: 'Snerydning', bookings: 120 },
  { name: 'Havearbejde', bookings: 98 },
  { name: 'Rengøring', bookings: 86 },
  { name: 'Tømrer', bookings: 65 },
  { name: 'Murer', bookings: 40 },
];

export const CONTACT_INFO = [
  { icon: Phone, text: '+45 22 65 19 96' },
  { icon: Mail, text: 'lythejendomsservice@gmail.com' },
  { icon: MapPin, text: 'Stenaldervej, 8220 Brabrand' },
];
