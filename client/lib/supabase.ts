import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

export const supabase = createClient(
  'https://ohgdivtvldokcfagsywc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZ2RpdnR2bGRva2NmYWdzeXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2MDI4OTIsImV4cCI6MjA0MjE3ODg5Mn0.nazr-TiKx95RCTxOZMpelc0bgAyZDyGFbZwMlI_inS8',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh().then((r) => console.log(r));
  } else {
    supabase.auth.stopAutoRefresh().then((r) => console.log(r));
  }
});
