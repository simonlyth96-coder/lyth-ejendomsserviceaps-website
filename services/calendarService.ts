import { GOOGLE_CALENDAR_CONFIG } from '../constants';
import { BookingFormData, CalendarEvent } from '../types';

// Extend window interface to include Google globals
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

let tokenClient: any;

export const initCalendarClient = () => {
  return new Promise<void>((resolve, reject) => {
    // 1. Check if keys are configured. If using placeholders, skip init gracefully.
    if (GOOGLE_CALENDAR_CONFIG.apiKey.includes('YOUR_GOOGLE') || 
        GOOGLE_CALENDAR_CONFIG.clientId.includes('YOUR_GOOGLE')) {
        console.warn("Google Calendar Integration: Skipped (Missing API Keys). Replace placeholders in constants.ts to enable.");
        resolve(); // Resolve successfully to prevent app errors
        return;
    }

    // 2. Wait for Google Scripts to be loaded (handling async defer race condition)
    const checkScripts = () => {
      if (window.gapi && window.google) {
        initializeGapi();
      } else {
        // Retry every 100ms
        setTimeout(checkScripts, 100);
      }
    };

    // Timeout safety - stop trying after 5 seconds
    const timeout = setTimeout(() => {
        console.warn("Google Scripts took too long to load. Calendar features disabled.");
        resolve(); // Fail gracefully
    }, 5000);

    const initializeGapi = () => {
      clearTimeout(timeout);
      
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            apiKey: GOOGLE_CALENDAR_CONFIG.apiKey,
            discoveryDocs: GOOGLE_CALENDAR_CONFIG.discoveryDocs,
          });

          tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CALENDAR_CONFIG.clientId,
            scope: GOOGLE_CALENDAR_CONFIG.scopes,
            callback: '', // defined at request time
          });

          resolve();
        } catch (err: any) {
          // Better error logging
          console.error("GAPI Init Error Details:", JSON.stringify(err, null, 2));
          // If init fails (e.g. invalid key origin), we reject so the UI knows
          reject(err);
        }
      });
    };

    checkScripts();
  });
};

export const signInToGoogle = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
        reject(new Error("Google Calendar Client not initialized. Check API Keys."));
        return;
    }

    tokenClient.callback = async (resp: any) => {
      if (resp.error) {
        reject(resp);
      }
      resolve();
    };

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
};

export const getBusySlots = async (minDate: Date, maxDate: Date): Promise<CalendarEvent[]> => {
  if (!window.gapi || !window.gapi.client) return [];
  
  try {
    const response = await window.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': minDate.toISOString(),
      'timeMax': maxDate.toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'orderBy': 'startTime',
    });
    return response.result.items;
  } catch (err) {
    console.error("Error fetching events", err);
    return [];
  }
};

export const addBookingEvent = async (booking: BookingFormData): Promise<any> => {
  if (!booking.date || !booking.timeSlot || !window.gapi || !window.gapi.client) return;

  // Simple parsing of "10:00 - 10:30"
  const [startTimeStr, endTimeStr] = booking.timeSlot.split(' - ');
  
  // Construct Date objects
  const startDateTime = new Date(booking.date);
  startDateTime.setHours(parseInt(startTimeStr.split(':')[0]), parseInt(startTimeStr.split(':')[1]));
  
  const endDateTime = new Date(booking.date);
  endDateTime.setHours(parseInt(endTimeStr.split(':')[0]), parseInt(endTimeStr.split(':')[1]));

  const event = {
    'summary': `Lyth Service: ${booking.service}`,
    'location': 'Kunde Lokation',
    'description': `Kunde: ${booking.name}\nEmail: ${booking.email}\nTlf: ${booking.phone}\nBesked: ${booking.message}`,
    'start': {
      'dateTime': startDateTime.toISOString(),
      'timeZone': 'Europe/Copenhagen',
    },
    'end': {
      'dateTime': endDateTime.toISOString(),
      'timeZone': 'Europe/Copenhagen',
    },
  };

  try {
    const request = window.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event,
    });
    const response = await request;
    return response.result;
  } catch (err) {
    console.error("Error adding event", err);
    throw err;
  }
};