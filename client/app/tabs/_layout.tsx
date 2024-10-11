import { Stack, Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '~/theme';
import { useColorScheme } from '~/lib/useColorScheme';
import { Icon } from '@roninoss/icons';

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
                  tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
                }}
              />
              <Tabs.Screen
                name={'checklist'}
                options={{
                  title: 'التخطيط',
                  tabBarIcon: ({ color }) => <Icon name="clipboard-list" size={24} color={color} />,
                }}
              />
              <Tabs.Screen
                name={'bookmarks'}
                options={{
                  title: 'المفضلة',
                  tabBarIcon: ({ color }) => <Icon name="bookmark" size={24} color={color} />,
                }}
              />
              {/*<Tabs.Screen*/}
              {/*  name={'settings'}*/}
              {/*  options={{*/}
              {/*    title: 'الإعدادات',*/}
              {/*    tabBarIcon: ({ color }) => <Icon name="screwdriver" size={24} color={color} />,*/}
              {/*  }}*/}
              {/*/>*/}
            </Tabs>
          </NavThemeProvider>
        </ActionSheetProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
