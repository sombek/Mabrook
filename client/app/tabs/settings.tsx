import { View, Text, Platform } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import { Icon } from '@roninoss/icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { supabase } from '~/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/auth-js';
import { ThemeToggle } from '~/components/ThemeToggle';
import * as React from 'react';

const Settings = () => {
  const { colors } = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  const handleLogout = () => {
    supabase.auth.signOut().then(() => {
      console.log('user logged out');
      router.navigate('/');
    });
  };
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text>This is the settings screen. You should see this after you login.</Text>
      {session && <Text className="mt-4">Signed in as {session.user.phone}</Text>}

      <Button variant="tonal" onPress={handleLogout} className="mt-4">
        <Icon
          name="lock-open-outline"
          color={Platform.OS === 'ios' ? colors.primary : colors.foreground}
          size={21}
        />
        <Text className="ml-2">تسجيل الخروج</Text>
      </Button>

      <ThemeToggle />
    </View>
  );
};

export default Settings;
