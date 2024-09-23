import { View, Text, Platform, ImageBackground, ScrollView, SafeAreaView } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import { Icon } from '@roninoss/icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { supabase } from '~/lib/supabase';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { cn } from '~/lib/cn';
import { StatusBar } from 'expo-status-bar';

const sections = [
  {
    label: 'قاعات الزفاف',
    description: 'احصل على أفضل العروض والخصومات من المتاجر المحلية في مدينتك.',
    'bg-image':
      'https://i.saudi-arabia.zafaf.net/gallery/1694/preview_ffcwbocblmnobottnbqejmlzw.jpg',
    'overlay-color': 'rgba(255, 99, 71, 0.5)', // Tomato
  },
  {
    label: 'التصوير الفوتوغرافي والفيديو',
    description: 'تصفح العروض المتاحة لدينا واختر ما يناسبك.',
    'bg-image': 'https://www.neshanstyle.com/blog/wp-content/uploads/2019/05/2-1.jpg',
    'overlay-color': 'rgba(60, 179, 113, 0.5)', // Medium Sea Green
  },
  {
    label: 'دعوة زواج',
    description: 'احصل على أفضل العروض والخصومات من المتاجر المحلية في مدينتك.',
    'bg-image': 'https://images.unsplash.com/photo-1514996937319-344454492b37',
    'overlay-color': 'rgba(255, 165, 0, 0.5)', // Orangespan: 1,
  },
  {
    label: 'كوش وتنسيق حفلات',
    description: 'تصفح العروض المتاحة لدينا واختر ما يناسبك.',
    'bg-image': 'https://cdn.salla.sa/YYQmbDywibx9yrHUGrToN8axdiZydY2u1FjXgOqC.jpeg',
    'overlay-color': 'rgba(138, 43, 226, 0.5)', // Blue Violet
  },
  {
    label: 'فستان الزفاف',
    description: 'احصل على أفضل العروض والخصومات من المتاجر المحلية في مدينتك.',
    'bg-image': 'https://i.saudi-arabia.zafaf.net/articles/body/295/YHrUH68yhBj5SZS.jpg',
    'overlay-color': 'rgba(255, 20, 147, 0.5)', // Deep Pink
  },
  {
    label: 'الشعر والمكياج',
    description: 'تصفح العروض المتاحة لدينا واختر ما يناسبك.',
    'bg-image':
      'https://images.unsplash.com/photo-1593721627612-4c8376834dcc?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'overlay-color': 'rgba(65, 105, 225, 0.5)', // Royal Blue
  },
  {
    label: 'كيك الزفاف',
    description: 'احصل على أفضل العروض والخصومات من المتاجر المحلية في مدينتك.',
    'bg-image':
      'https://images.unsplash.com/photo-1486506063901-2b3966ca11d2?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // dark goldenrod
    'overlay-color': 'rgba(184, 134, 11, 0.5)',
  },
];

const Header = () => {
  // rounded bg-amber-500 bottom
  return (
    <View className="h-96 bg-gradient-to-r from-amber-500 to-amber-300">
      <View className="flex-row items-center justify-between p-4">
        <View>
          <Text className="text-2xl font-bold text-white">مرحباً بك في زفاف</Text>
          <Text className="text-sm text-white">المكان الأمثل لتحضير حفل زفاف أحلامك</Text>
        </View>
        <View>
          <Button variant="tonal" className="bg-white">
            <Icon name="lock-open-outline" size={21} color="black" />
            <Text className="ml-2">تسجيل الخروج</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
const Workspace = () => {
  const { colors, colorScheme } = useColorScheme();
  const handleLogout = () => {
    supabase.auth.signOut().then(() => {
      console.log('user logged out');
      router.navigate('/');
    });
  };
  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <Header />
      <SafeAreaView>
        <ScrollView className="p-4 ">
          {sections.map((section, index) => (
            <TouchableOpacity key={index}>
              <ImageBackground
                source={{ uri: section['bg-image'] }}
                className={cn('mb-4  min-h-32  overflow-hidden rounded-xl')}>
                <View style={{ backgroundColor: section['overlay-color'] }} className="flex-1 p-4">
                  <Text className="text-right text-xl font-bold text-white">{section.label}</Text>
                  <Text className="mt-1 text-right text-white">{section.description}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Workspace;
