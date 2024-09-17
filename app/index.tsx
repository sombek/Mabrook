import { View, StyleSheet, TouchableHighlight } from "react-native";
import { init } from "@instantdb/react-native";
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Email, MagicCode } from "~/app/magic-code";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useColorScheme } from "~/lib/useColorScheme";

const APP_ID = "d7c799bf-dbef-4c5c-be03-b96ff43245a5";
const db = init({ appId: APP_ID });

function App() {
  const { isLoading, user, error } = db.useAuth();

  let content;
  if (isLoading) {
    content = <Text>Loading...</Text>;
  } else if (error) {
    content = <Text>Uh oh! {error.message}</Text>;
  } else if (user) {
    content = <Text>Hello {user.email}!</Text>;
  } else {
    content = <Login />;
  }

  return <View style={styles.container}>{content}</View>;
}

function Login() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const discovery = useAutoDiscovery(db.auth.issuerURI());
  const [request, _response, promptAsync] = useAuthRequest(
    {
      // The unique name you gave the OAuth client when you
      // registered it on the Instant dashboard
      clientId: "Mabrook",
      redirectUri: makeRedirectUri(),
    },
    discovery,
  );
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["100%", "100%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const [sentEmail, setSentEmail] = useState("");
  const { isLoading, user, error } = db.useAuth();
  console.log("user", user, error, isLoading);
  return (
    // list the features that you want to access
    <GestureHandlerRootView className="bg-gray-50 w-full h-full">
      <BottomSheetModalProvider>
        <View className="flex flex-col items-center justify-center w-full h-full">
          {user ? <Text className="text-2xl">Hello {user.email}!</Text> : null}
          <View className={"flex center items-center p-6"}>
            <View className="mb-6 bg-amber-500/40 p-6 rounded-full w-32 flex items-center justify-center">
              <Text style={styles.emojiHeader}>🎊</Text>
            </View>
            <Text className={"text-2xl text-center p-6"}>
              {/*في مبروك نساعدك في تنظيم حفل زفافك بكل سهولة ويسر*/}
              تجربة خطوط
            </Text>
          </View>

          <View className={"mb-6 p-6 flex flex-col gap-3"}>
            <Button onPress={handlePresentModalPress} className="bg-amber-500">
              <Text className="text-2xl">تسجيل الدخول عبر الإيميل</Text>
            </Button>
            <View className="w-full ">
              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
              >
                <View className="p-6">
                  {!sentEmail ? (
                    <Email setSentEmail={setSentEmail} />
                  ) : (
                    <MagicCode sentEmail={sentEmail} />
                  )}
                </View>
              </BottomSheetModal>
            </View>

            <Button className="bg-blue-700" onTouchEnd={() => promptAsync()}>
              <Text className="text-2xl">الدخول عبر Google</Text>
            </Button>
          </View>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  submit: {
    padding: 30,
    paddingBottom: 29,
    marginBottom: 20,
    borderRadius: 500,
    borderWidth: 2,
    borderColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  emojiHeader: {
    fontSize: 64,
    lineHeight: 64,
  },
  FeatureText: {
    fontSize: 24,
    fontFamily: "BalooBhaijaan2-Bold",
    textAlign: "center",
    color: "#010101",
  },
});

export default App;
