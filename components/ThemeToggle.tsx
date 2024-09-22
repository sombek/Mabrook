// import { Icon } from '@roninoss/icons';
import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';
import Animated, { LayoutAnimationConfig, ZoomInRotate } from 'react-native-reanimated';

import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
// import { COLORS } from '~/theme/colors';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View
        className="items-center justify-center"
        key={`toggle-${colorScheme}`}
        entering={ZoomInRotate}>
        <Pressable onPress={toggleColorScheme} className="opacity-80">
          {colorScheme === 'dark'
            ? ({ pressed }) => (
                <View className={cn('px-0.5', pressed && 'opacity-50')}>
                  {/*<Icon namingScheme="sfSymbol" name="moon.stars" color={COLORS.white} />*/}
                  <SymbolView name="moon.stars" size={24} />
                </View>
              )
            : ({ pressed }) => (
                <View className={cn('px-0.5', pressed && 'opacity-50')}>
                  {/*<Icon namingScheme="sfSymbol" name="sun.min" color={COLORS.black} />*/}
                  <SymbolView name="sun.min" size={24} type="palette" colors="#000000" />
                </View>
              )}
        </Pressable>
      </Animated.View>
    </LayoutAnimationConfig>
  );
}
