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
  apiKey: process.env.GOOGLE_API_KEY || 'AIzaSyBjzfD0JEP1X_kH46Oc9_C7hnvIjcI80k',
  clientId: process.env.GOOGLE_CLIENT_ID || '373251942454-avzgra32am4gd6l456ivkck5qf1e70aq.apps.googleusercontent.com',
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
  scopes: "https://www.googleapis.com/auth/calendar.events",
};

export const SERVICES_LIST = [
  { 
    id: ServiceType.CARPENTRY, 
    title: 'Tømrerarbejde', 
    price: '400,- ekskl. moms/time',
    icon: Hammer, 
    desc: 'Professionel udførelse af alt fra små reparationer til større byggeprojekter.',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620029587422-959957dc4767?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581093583449-ed2521344463?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  { 
    id: ServiceType.MASONRY, 
    title: 'Murerarbejde', 
    price: '400,- ekskl. moms/time',
    icon: Building2, 
    desc: 'Kvalitetsbevidst murerarbejde, renovering af facader og flisearbejde.',
    images: [
      'https://images.unsplash.com/photo-1594806657954-4777d5440628?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  { 
    id: ServiceType.CLEANING, 
    title: 'Rengøring', 
    price: '350,- ekskl. moms/time',
    icon: Brush, 
    desc: 'Grundig rengøring af kontorer, trappeopgange og private hjem.',
    images: [
      'https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527515673516-756372da8067?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  { 
    id: ServiceType.SNOW_REMOVAL, 
    title: 'Snerydning', 
    price: '400,- ekskl. moms/time',
    icon: Snowflake, 
    desc: 'Pålidelig snerydning og saltning, så du kan færdes sikkert.',
    images: [
      'https://images.unsplash.com/photo-1485627250495-2aa0633b49e2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612260286828-568eb93466ae?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  { 
    id: ServiceType.GARDENING, 
    title: 'Havearbejde', 
    price: '350,- ekskl. moms/time',
    icon: Leaf, 
    desc: 'Græsslåning, hækklipning og generel pasning af grønne arealer.',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599148401005-fe6d35275e3c?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  { 
    id: ServiceType.PAVING, 
    title: 'Brolægning', 
    price: '400,- ekskl. moms/time',
    icon: Truck, 
    desc: 'Etablering af indkørsler, terrasser og stier i høj kvalitet.',
    images: [
      'https://images.unsplash.com/photo-1621255502266-9b78cb4d271f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1628003666276-8806292271a3?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  { 
    id: ServiceType.TERRACE_CLEANING, 
    title: 'Terrasserens', 
    price: '400,- ekskl. moms/time',
    icon: Droplets, 
    desc: 'Effektiv fjernelse af alger og snavs fra træ- og fliseterrasser.',
    images: [
      'https://images.unsplash.com/photo-1594490159781-799d6387a6d8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1632759885854-c8c3639e44d3?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  { 
    id: ServiceType.FACILITY_MANAGEMENT, 
    title: 'Facility Mgt.', 
    price: '400,- ekskl. moms/time',
    icon: Home, 
    desc: 'Totaldrift af ejendomme. Vi holder overblikket for dig.',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  { 
    id: ServiceType.MAINTENANCE, 
    title: 'Vedligeholdelse', 
    price: '350,- ekskl. moms/time',
    icon: Wrench, 
    desc: 'Løbende vedligehold der forebygger skader og bevarer værdien.',
    images: [
      'https://images.unsplash.com/photo-1505798577917-a651a5d60bb0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop'
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
  { icon: MapPin, text: 'Mariane Thomsens Gade 31, 8000 Aarhus C' },
];
