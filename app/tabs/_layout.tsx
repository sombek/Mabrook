import { Stack, Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '~/theme';
import { useColorScheme } from '~/lib/useColorScheme';

export default function RootLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ActionSheetProvider>
          <NavThemeProvider value={NAV_THEME[colorScheme]}>
            <Tabs>
              <Tabs.Screen
                name="workspace"
                options={{
                  title: 'الرئيسية',
                  headerShown: false,
                }}
              />
              <Tabs.Screen
                name={'settings'}
                options={{
                  title: 'الإعدادات',
                }}
              />
            </Tabs>
          </NavThemeProvider>
        </ActionSheetProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
