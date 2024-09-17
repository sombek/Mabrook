import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, I18nManager } from "react-native";
import { init } from "@instantdb/react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const APP_ID = "d7c799bf-dbef-4c5c-be03-b96ff43245a5";
const db = init({ appId: APP_ID });

function Email({ setSentEmail }) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) return;
    setSentEmail(email);
    db.auth.sendMagicCode({ email }).catch((err) => {
      Alert.alert("خطأ", "حدث خطأ :" + err.body?.message);
      setSentEmail("");
    });
  };
  const [value, setValue] = React.useState("");

  const onChangeText = (text: string) => {
    setValue(text);
  };

  return (
    <View className="w-full p-5">
      <Text className={"my-2 text-right text-3xl font-bold p-5"}>
        التسجيل عبر الMagic Code
      </Text>
      <Input
        keyboardType={"email-address"}
        className={"my-2 w-full"}
        placeholder="أدخل بريدك الإلكتروني"
        value={value}
        onChangeText={onChangeText}
        aria-labelledby="inputLabel"
        aria-errormessage="inputError"
      />
      <Button onPress={handleSubmit}>
        <Text>إرسال الرمز</Text>
      </Button>
    </View>
  );
}

function MagicCode({ sentEmail }) {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    db.auth.signInWithMagicCode({ email: sentEmail, code }).catch((err) => {
      Alert.alert("خطأ", "حدث خطأ :" + err.body?.message);
      setCode("");
    });
  };
  const [value, setValue] = React.useState("");

  const onChangeText = (text: string) => {
    setValue(text);
  };
  return (
    <View style={styles.form}>
      <Text style={styles.title}>
        حسنًا، لقد أرسلنا لك بريدًا! ما هو الرمز؟
      </Text>
      <TextInput
        style={styles.input}
        placeholder="123456..."
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />
      <Input
        placeholder="Write some stuff..."
        value={value}
        onChangeText={onChangeText}
        aria-labelledby="inputLabel"
        aria-errormessage="inputError"
      />
      <Button onPress={handleSubmit}>
        <Text>تسجيل الدخول</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 20,
    width: "100%",
    color: "#333",
    marginBottom: 20,
    textAlign: "right", // Align text to the right for Arabic
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlign: "right", // Align input text to the right for Arabic
  },
});

export { Email, MagicCode };
