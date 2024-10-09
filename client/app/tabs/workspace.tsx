import {
  View,
  Text,
  Platform,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import { Icon } from '@roninoss/icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { supabase } from '~/lib/supabase';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { cn } from '~/lib/cn';
import { StatusBar } from 'expo-status-bar';
import DeviceInfo from 'react-native-device-info';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardImage,
  CardSubtitle,
  CardTitle,
} from '~/components/nativewindui/Card';
import { useEffect, useState } from 'react';
import {
  ESTIMATED_ITEM_HEIGHT,
  List,
  ListDataItem,
  ListItem,
  ListSectionHeader,
} from '~/components/nativewindui/List';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { Checkbox } from '~/components/nativewindui/Checkbox';

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
  const hasDynamicIsland = DeviceInfo.hasDynamicIsland();

  return (
    <View
      className={cn(
        'w-full items-center justify-end rounded-b-3xl bg-amber-400 p-4',
        hasDynamicIsland ? 'pt-16' : 'pt-4'
      )}>
      <Text className="text-center text-2xl font-bold text-white">زواج حليمة و سعيد 🎉</Text>
      <Text className="text-center text-2xl font-bold text-white">
        <Icon name={'calendar-alert'} size={24} color={'white'} />{' '}
        {new Date()
          .toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          .replace('،', '')}
      </Text>
    </View>
  );
};

const featuredSections = [
  {
    label: 'قاعة زفاف الملكة',
    type: 'wedding-venue',
    description: 'احصل على أفضل العروض والخصومات من المتاجر المحلية في مدينتك.',
    'bg-image':
      'https://www.arabiaweddings.com/sites/default/files/styles/max980/public/articles/2018/09/largest_wedding_venues_in_riyadh.jpg?itok=dCQEt9HH',
  },
  {
    label: 'قاعة زفاف الملكة',
    type: 'wedding-venue',
    description: 'احصل على أفضل العروض والخصومات من المتاجر المحلية في مدينتك.',
    'bg-image':
      'https://www.arabiaweddings.com/sites/default/files/styles/max980/public/articles/2018/09/largest_wedding_venues_in_riyadh.jpg?itok=dCQEt9HH',
  },
  {
    label: 'قاعة زفاف الملكة',
    type: 'wedding-venue',
    description: 'احصل على أفضل العروض والخصومات من المتاجر المحلية في مدينتك.',
    'bg-image':
      'https://www.arabiaweddings.com/sites/default/files/styles/max980/public/articles/2018/09/largest_wedding_venues_in_riyadh.jpg?itok=dCQEt9HH',
  },
];
const Workspace = () => {
  const { colors, colorScheme } = useColorScheme();
  const handleLogout = () => {
    supabase.auth.signOut().then(() => {
      console.log('user logged out');
      router.navigate('/');
    });
  };
  const [sections33, setSections] = useState<
    { description: string | null; name: string; section_id: number }[]
  >([]);

  useEffect(() => {
    // get all tasks
    const fetchTasks = async () => {
      // join tasks and sections
      const { data, error } = await supabase.from('tasks').select();
      console.log(data);
      if (error) {
        console.error(error);
        return;
      }

      // get sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select()
        .in(
          'section_id',
          data.map((task) => task.section_id)
        );
      if (sectionsError) {
        console.error(sectionsError);
        return;
      }
      if (sectionsData) setSections(sectionsData);
    };
    fetchTasks().then();
  }, []);
  const onRefresh = () => {
    const fetchTasks = async () => {
      // join tasks and sections
      const { data, error } = await supabase.from('tasks').select();
      if (error) {
        console.error(error);
        return;
      }

      // get sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select()
        .in(
          'section_id',
          data.map((task) => task.section_id)
        );
      if (sectionsError) {
        console.error(sectionsError);
        return;
      }
      if (sectionsData) setSections(sectionsData);
    };
    fetchTasks().then();
  };

  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <Header />
      <List
        data={sections33.map((section) => ({
          id: `${Math.random()}`,
          title: section.name,
          subTitle: section.description,
          section_id: section.section_id,
        }))}
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT.withSubTitle}
        renderItem={renderItem}
        // renderItem={(info) => {
        //   return (
        //     <TouchableOpacity
        //       key={info.index}
        //       onPress={() =>
        //         router.navigate({
        //           pathname: '/section',
        //           params: { section_id: info.section.section_id, section_name: info.section.name },
        //         })
        //       }>
        //       <View className="mb-4">
        //         <Card>
        //           <CardImage
        //             source={{
        //               uri: sections[Math.floor(Math.random() * sections.length)]['bg-image'],
        //             }}
        //           />
        //           <CardContent>
        //             <CardTitle>
        //               <Text className={'text-right text-white'}>{info.section.name}</Text>
        //             </CardTitle>
        //           </CardContent>
        //           <CardFooter>
        //             <CardDescription className={'text-right text-white'}>
        //               {info.section.name} - {info.section.description}
        //             </CardDescription>
        //           </CardFooter>
        //         </Card>
        //       </View>
        //     </TouchableOpacity>
        //   );
        // }}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      />
      {/*<ScrollView className="relative p-4">*/}
      {/*  {sections33.map((section, index) => (*/}
      {/*  ))}*/}
      {/*</ScrollView>*/}
      <Button
        variant={'primary'}
        onPress={() => router.navigate('/add-section-modal')}
        className={'absolute bottom-4 right-4 size-10 bg-amber-400 hover:bg-amber-500'}>
        <Icon name={'plus'} size={24} />
      </Button>
    </>
  );
};

function keyExtractor(item: (Omit<ListDataItem, string> & { id: string }) | string) {
  return typeof item === 'string' ? item : item.id;
}

function renderItem<T extends ListDataItem>(info: ListRenderItemInfo<T>) {
  if (typeof info.item === 'string') {
    return <ListSectionHeader {...info} />;
  }
  return (
    <ListItem
      rightView={
        <View className="flex-1 justify-center px-4">
          <Icon name={'calendar-alert'} size={24} />
        </View>
      }
      titleClassName="text-right"
      subTitleClassName="text-right"
      {...info}
      onPress={() => {
        console.log(info.item);
        router.navigate({
          pathname: '/section',
          params: { section_id: info.item.section_id, section_name: info.item.title },
        });
      }}
    />
  );
}

export default Workspace;
