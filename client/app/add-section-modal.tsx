import { Platform, View } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import { TextField } from '~/components/nativewindui/TextField';
import { Text } from '~/components/nativewindui/Text';
import { useState } from 'react';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { router, Stack } from 'expo-router';
import { supabase } from '~/lib/supabase';

const AddSectionModal = () => {
  const [description, setDescription] = useState('');
  const handleAddSection = () => {
    const addSection = async () => {
      supabase.from('sections').insert([{ name: description }]);
    };
    addSection().then();
    // Add section
    router.dismiss();
  };
  const handleCancel = () => {
    // Cancel
    router.dismiss();
  };
  const [materialVariant, setMaterialVariant] = useState<'filled' | 'outlined'>('outlined');
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'إضافة قسم',
          headerLeft: () => (
            <Text onPress={handleCancel} className={' underline '}>
              إلغاء
            </Text>
          ),
        }}
      />
      <KeyboardAwareScrollView
        bottomOffset={8}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <Form className="px-4 pt-8">
          <FormSection materialIconProps={{ name: 'person-outline' }}>
            <FormItem>
              <TextField
                textContentType="none"
                className={'text-right'}
                autoComplete="off"
                materialVariant={materialVariant}
                placeholder="إسم القسم"
              />
            </FormItem>
          </FormSection>
          <Button onPress={handleAddSection}>
            <Text>إضافة قسم</Text>
          </Button>
        </Form>
      </KeyboardAwareScrollView>
    </>
  );
};

export default AddSectionModal;
