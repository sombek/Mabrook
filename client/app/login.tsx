import { Icon } from '@roninoss/icons';
import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, TextInput, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
// supabaseClient.js
import { Button } from '~/components/nativewindui/Button';
import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { Link, router } from 'expo-router';
import { cn } from '~/lib/cn';
import {
  KeyboardAwareScrollView,
  KeyboardController,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { TextField } from '~/components/nativewindui/TextField';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const LoginPage = ({
  setIsLoggingIn,
  setPhone,
  phone,
}: {
  setIsLoggingIn: (value: boolean) => void;
  setPhone: (value: string) => void;
  phone: string;
}) => {
  const { colors, colorScheme } = useColorScheme();
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: '+966' + phone,
    });
    if (error) {
      alert(error.message);
    } else setIsLoggingIn(false);
  };
  const insets = useSafeAreaInsets();

  return (
    <View className="ios:bg-card flex-1" style={{ paddingBottom: insets.bottom }}>
      <KeyboardAwareScrollView
        bottomOffset={Platform.select({ ios: 175 })}
        bounces={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="ios:pt-12 pt-20">
        <StatusBar
          style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
        />

        <View className="flex-1 items-center justify-center gap-1 px-12">
          <View className="flex-row items-center justify-center gap-2 p-14">
            <Text variant="largeTitle">نورتنا </Text>
          </View>
        </View>

        <Form className="gap-2">
          <FormSection className="ios:bg-background">
            <FormItem>
              <TextField
                className={'text-left'}
                placeholder={'رقم الجوال'}
                onSubmitEditing={() => KeyboardController.setFocusTo('next')}
                blurOnSubmit={false}
                autoFocus
                rightView={<Text className="px-2 py-3 text-lg text-gray-700">+966</Text>}
                value={phone}
                onChangeText={setPhone}
                keyboardType="number-pad"
                textContentType="emailAddress"
                returnKeyType="next"
              />
            </FormItem>
          </FormSection>
        </Form>
      </KeyboardAwareScrollView>
      <KeyboardStickyView
        offset={{
          closed: 0,
          opened: Platform.select({ ios: insets.bottom + 30, default: insets.bottom }),
        }}>
        <View className=" px-12 py-4">
          <Button size="lg" onPress={handleLogin} className={'bg-amber-400'}>
            <Text>إرسال رمز التحقق</Text>
          </Button>
        </View>
      </KeyboardStickyView>
    </View>
  );
};

export const VerifyOtp = ({
  setIsLoggingIn,
  phone,
}: {
  setIsLoggingIn: (value: boolean) => void;
  phone: string;
}) => {
  const { colors, colorScheme } = useColorScheme();
  const [otp, setOtp] = useState('');

  function handleOtp() {
    if (!otp) return alert('Please enter OTP');
    const verifyOtp = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        phone: '+966' + phone,
        token: otp,
        type: 'sms',
      });
      if (error) alert(error.message);
      return session;
    };
    verifyOtp()
      .then((r) => {
        if (r) {
          console.log('from verifyOtp i am moving to survey');
          router.dismissAll();
          setTimeout(() => {
            router.push('/survey');
          }, 0);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />

      <View className="flex-1 items-center justify-center gap-1 px-12">
        <View className="">
          <Button onPress={() => setIsLoggingIn(true)} variant={'secondary'}>
            <Text>رجوع</Text>
          </Button>
        </View>

        <Icon name="file-lock-outline" size={42} color={colors.grey} />
        <Text variant="title3" className="pb-1 text-center font-semibold">
          التحقق من الرمز
        </Text>

        <TextInput
          value={otp}
          onChangeText={setOtp}
          placeholder="رمز التحقق"
          keyboardType="phone-pad"
          secureTextEntry
          maxLength={6}
          className="my-2 mb-4 w-full rounded-xl border border-gray-300 bg-white p-4 text-right text-gray-700"
        />

        <Button className="w-full" onPress={handleOtp}>
          <Text>تسجيل الدخول</Text>
        </Button>
      </View>
    </>
  );
};
export default function ModalScreen() {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [phone, setPhone] = useState('');
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/tabs/workspace');
      }
    });
  }, []);

  return (
    <ScrollView>
      {isLoggingIn ? (
        <LoginPage setIsLoggingIn={setIsLoggingIn} setPhone={setPhone} phone={phone} />
      ) : (
        <VerifyOtp setIsLoggingIn={setIsLoggingIn} phone={phone} />
      )}
    </ScrollView>
  );
}
