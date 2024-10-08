import { View, Text, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import { Icon } from '@roninoss/icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { supabase } from '~/lib/supabase';
import { router, useNavigation } from 'expo-router';
import { SegmentedControl } from '~/components/nativewindui/SegmentedControl';
import { useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { ESTIMATED_ITEM_HEIGHT, List, ListItem } from '~/components/nativewindui/List';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';

const Checklist = () => {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (selectedIndex === 1) {
      navigation.setOptions({ title: 'الملاحظات', headerRight: null });
      return;
    }

    navigation.setOptions({
      title: 'المهام',
      headerRight: () => (
        <Button
          variant="tonal"
          className={'mr-4'}
          onPress={() => {
            console.log('Add new task');
          }}>
          <Icon name="plus" size={21} />
        </Button>
      ),
    });
  }, [navigation, selectedIndex]);

  const tabs = ['المهام', 'الملاحظات'];
  return (
    <View className="p-4">
      <SegmentedControl
        values={tabs}
        selectedIndex={selectedIndex}
        onIndexChange={(index) => {
          setSelectedIndex(index);
        }}
      />
      {selectedIndex === 0 ? <TasksList /> : <Notes />}
    </View>
  );
};

const TasksList = () => {
  return (
    <View className={'h-full w-full'}>
      <List
        variant={'insets'}
        data={[
          {
            id: '1',
            title: 'Hello',
            subTitle: 'World',
          },
          {
            id: '2',
            title: 'Hello',
            subTitle: 'World',
          },

          {
            id: '3',
            title: 'Hello',
            subTitle: 'World',
          },
        ]}
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT.withSubTitle}
        renderItem={(info) => {
          return <ListItem {...info} />;
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export const Notes = () => {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: 'Start editing!',
  });

  return (
    <SafeAreaView className={'h-full w-full'}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className={'absolute bottom-0 w-full'}>
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Checklist;
