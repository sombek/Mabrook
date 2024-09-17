import { View, Text, Button, StyleSheet } from "react-native";
import { init } from "@instantdb/react-native";
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";

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

  return (
    <Button
      title="Log in"
      disabled={!request}
      onPress={async () => {
        try {
          if (!request) return;
          const res = await promptAsync();
          if (res.type === "error") {
            alert(res.error || "Something went wrong");
          }
          if (res.type === "success") {
            await db.auth
              .exchangeOAuthCode({
                code: res.params.code,
                codeVerifier: request.codeVerifier,
              })
              .catch((e) => alert(e.body?.message || "Something went wrong"));
          } else {
          }
        } catch (e) {
          console.error(e);
        }
      }}
    ></Button>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
