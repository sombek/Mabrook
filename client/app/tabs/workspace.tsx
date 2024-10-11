import { I18nManager, Platform, RefreshControl, Text, View } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import { Icon } from '@roninoss/icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { supabase } from '~/lib/supabase';
import { router } from 'expo-router';
import { cn } from '~/lib/cn';
import { StatusBar } from 'expo-status-bar';
import DeviceInfo from 'react-native-device-info';
import { useEffect, useState } from 'react';
import {
  ESTIMATED_ITEM_HEIGHT,
  List,
  ListDataItem,
  ListItem,
  ListSectionHeader,
} from '~/components/nativewindui/List';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { getLocales } from 'expo-localization';
import * as Updates from 'expo-updates';

const Header = () => {
  const hasDynamicIsland = DeviceInfo.hasDynamicIsland();

  function goToSettings() {
    router.navigate('/settings');
  }

  return (
    <View
      className={cn(
        'w-full items-center justify-end rounded-b-3xl bg-amber-400 p-4',
        hasDynamicIsland ? 'pt-16' : 'pt-4'
      )}>
      <View className="w-full flex-row justify-between">
        <View className="w-2 flex-row items-center justify-center">
          <Button
            variant={'plain'}
            className="bg-amber-400 hover:bg-amber-500"
            onPress={goToSettings}>
            <Icon name={'cog'} size={24} color={'white'} />
          </Button>
        </View>
        <View className="flex-1">
          <Text className="text-center text-2xl font-bold text-white">زواج سعيد وسعيدة 🎉</Text>
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-center text-2xl font-bold text-white">
              {new Date()
                .toLocaleDateString('ar-EG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
                .replace('،', '')}
            </Text>
            <Icon name={'calendar-alert'} size={24} color={'white'} />
          </View>
        </View>
      </View>
    </View>
  );
};

const Workspace = () => {
  const { colors, colorScheme } = useColorScheme();
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
        )
        .order('section_id', { ascending: true });
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
  const deviceLanguage = getLocales()[0].languageCode;
  console.log(I18nManager.isRTL);
  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <View className={'bg-white'}>
        <Header />
      </View>
      <List
        data={sections33.map((section) => ({
          id: `${Math.random()}`,
          title: section.ar_name,
          icon: section.icon,
          subTitle: section.description,
          section_id: section.section_id,
          colorScheme,
        }))}
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT.withSubTitle}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={colors.grey} />
        }
      />

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
      // style={{ backgroundColor: NAV_THEME[info.item.colorScheme].colors.background }}
      leftView={
        <View className="flex-1 justify-center px-4">
          <Icon name={info.item.icon || 'folder'} size={24} />
        </View>
      }
      titleClassName="text-left"
      subTitleClassName="text-left"
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
