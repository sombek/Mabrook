import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {
  Animated,
  Button as RNButton,
  ButtonProps,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useEffect } from 'react';
import { supabase } from '~/lib/supabase';

export default function Screen() {
  const _renderItem = ({ item }: { item: { title: string; description: string } }) => {
    return (
      <View className="flex flex-col items-center justify-center">
        <Text variant="title3" className="p-4 text-right text-2xl font-semibold text-gray-800">
          {item.title}
        </Text>
        <Text variant="body" className="p-4 pt-0 text-right text-lg text-gray-600">
          {item.description}
        </Text>
      </View>
    );
  };
  const isCarousel = React.useRef(null);
  const [entries, setEntries] = React.useState([
    {
      title: 'نرتب زواجك ونسهل عليك الأمور',
      description: 'احصل على أفضل العروض والخصومات من المتاجر المحلية في مدينتك.',
    },
    {
      title: 'في مبروك نقدم لك أفضل العروض',
      description: 'تصفح العروض المتاحة لدينا واختر ما يناسبك.',
    },
    {
      title: 'نوفر لك أفضل الخدمات',
      description: 'تواصل معنا للحصول على أفضل الخدمات والعروض.',
    },
  ]);
  // page width
  const getScreenWidth = () => {
    return Dimensions.get('window').width;
  };
  const sliderWidth = getScreenWidth() - 20;
  const itemWidth = getScreenWidth() - 60;
  const [activeIndex, setActiveIndex] = React.useState(2);
  const { colors, colorScheme } = useColorScheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      router.push('/(workspace)');
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      router.push('/(workspace)');
    });
  }, []);

  return (
    <View className="">
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />

      <View className="absolute right-4 top-14 z-10">
        <ThemeToggle />
      </View>

      <Image
        source={require('~/assets/landing-page.png')}
        className="z-0 h-96 w-full object-cover"
      />

      <ScrollView className="relative h-full p-4">
        <Carousel
          ref={isCarousel}
          data={entries}
          renderItem={_renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          vertical={false}
          onSnapToItem={(index) => setActiveIndex(index)}
        />
        <Pagination
          dotsLength={entries.length}
          activeDotIndex={activeIndex}
          inactiveDotStyle={{
            backgroundColor: 'gray',
          }}
          inactiveDotOpacity={0.4}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 8,
            // use amber color for active dot
            backgroundColor: colors.primary,
          }}
        />
        {/*  button bottom position */}
        <View className="flex flex-col items-center justify-center">
          <Link href="/login" asChild>
            <Button size={Platform.select({ ios: 'lg', default: 'md' })} className="w-full">
              <Text>إبدأ الآن</Text>
            </Button>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}
