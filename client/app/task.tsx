import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { BackButton } from '~/components/BackButton';
import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import colors from 'tailwindcss/colors';

const Task = () => {
  const params = useLocalSearchParams();
  const [taskDetails, setTaskDetails] = useState<any>();
  useEffect(() => {
    if (!params) router.navigate('/tabs/workspace');

    const getTask = async () => {
      const resp = supabase.from('tasks').select().eq('task_id', params.task_id).single();
      return resp;
    };
    getTask().then((taskDetails) => {
      setTaskDetails(taskDetails.data);
      console.log(taskDetails.data, 'taskDetails.data');
    });
  }, []);

  return (
    <View className="flex-col gap-4">
      <Stack.Screen
        options={{
          title: taskDetails?.name || '',
          headerStyle: { backgroundColor: colors.amber['400'] },
          headerTintColor: colors.white,
          headerLeft: () => <BackButton onPress={() => router.back()} />,
        }}
      />
      {taskDetails && <Text className="mt-4">{JSON.stringify(taskDetails, null, 4)}</Text>}
      {!taskDetails && (
        <ActivityIndicator color={colors.amber['400']} size="large" className="h-full" />
      )}
    </View>
  );
};

export default Task;
