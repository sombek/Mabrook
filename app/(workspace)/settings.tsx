import { View, Text, Platform } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import { Icon } from '@roninoss/icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { supabase } from '~/lib/supabase';
import { router } from 'expo-router';

const Settings = () => {
  const { colors } = useColorScheme();
  const handleLogout = () => {
    supabase.auth.signOut().then(() => {
      console.log('user logged out');
      router.navigate('/onboarding');
    });
  };
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text>This is the settings screen. You should see this after you login.</Text>

      <Button variant="tonal" onPress={handleLogout} className="mt-4">
        <Icon
          name="lock-open-outline"
          color={Platform.OS === 'ios' ? colors.primary : colors.foreground}
          size={21}
        />
        <Text className="ml-2">تسجيل الخروج</Text>
      </Button>
    </View>
  );
};

export default Settings;
