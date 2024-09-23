import { Icon } from '@roninoss/icons';
import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, TextInput, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
// supabaseClient.js
import { Button } from '~/components/nativewindui/Button';
import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { router } from 'expo-router';
import { cn } from '~/lib/cn';

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
  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />

      <View className="flex-1 items-center justify-center gap-1 px-12">
        <View className="pt-14">
          <Icon name="file-lock-outline" size={56} color={colors.grey} />
        </View>

        <View className="w-full flex-row items-center justify-center px-10">
          <View className="flex h-14 items-center justify-center rounded-xl rounded-r-none border border-r-0 border-gray-300 bg-gray-100 px-4 text-gray-700">
            <Text className="text-gray-700">+966</Text>
          </View>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="رقم الجوال"
            keyboardType="phone-pad"
            maxLength={9}
            className="h-14 w-full rounded-xl rounded-l-none border  border-l-0 border-gray-300  bg-white px-2 text-gray-700"
          />
        </View>

        <Button onPress={handleLogin} className="mt-4 w-full">
          <Text>تسجيل الدخول</Text>
        </Button>
      </View>
    </>
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
          console.log('from verifyOtp i am moving to workspace');
          router.dismissAll();
          setTimeout(() => {
            router.push('/tabs/workspace');
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
