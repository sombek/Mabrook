import '../global.css';
import 'expo-dev-client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Icon } from '@roninoss/icons';
import { Link, Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeToggle } from '~/components/ThemeToggle';
import { cn } from '~/lib/cn';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import colors from 'tailwindcss/colors';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      {/* WRAP YOUR APP WITH ANY ADDITIONAL PROVIDERS HERE */}
      {/* <ExampleProvider> */}
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ActionSheetProvider>
              <NavThemeProvider value={NAV_THEME[colorScheme]}>
                <Stack screenOptions={SCREEN_OPTIONS}>
                  <Stack.Screen
                    name={'add-section-modal'}
                    options={{
                      presentation: 'modal',
                    }}
                  />
                  <Stack.Screen name="index" options={INDEX_OPTIONS} />
                  <Stack.Screen name="login" options={LOGIN_OPTIONS} />
                  <Stack.Screen name="survey" options={SURVEY_OPTIONS} />
                  <Stack.Screen
                    name="tabs"
                    options={{ headerShown: false, headerBackTitle: 'رجوع' }}
                  />
                  <Stack.Screen name="section" options={{}} />
                </Stack>
              </NavThemeProvider>
            </ActionSheetProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>

      {/* </ExampleProvider> */}
    </>
  );
}

const SCREEN_OPTIONS: NativeStackNavigationOptions = {
  animation: 'ios', // for android
} as const;
let SURVEY_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
};
const INDEX_OPTIONS = {
  headerShown: false,
  // headerLargeTitle: true,
  // title: 'NativeWindUI',
  // headerRight: () => <SettingsIcon />,
} as const;

const LOGIN_OPTIONS: NativeStackNavigationOptions = {
  title: 'تسجيل الدخول',
  animation: 'fade_from_bottom', // for android
  presentation: 'modal',
} as const;
