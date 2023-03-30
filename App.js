import { useEffect, useState, useRef } from "react";
import { StyleSheet, StatusBar, Platform, SafeAreaView } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import uuid from "react-native-uuid";

import ContentView from "./ContentView";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

const registerForPushNotificationsAsync = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notificationUri, setNotificationUri] = useState("");
  const [id, setId] = useState(uuid.v4());
  const clickListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    clickListener.current =
      Notifications.addNotificationResponseReceivedListener((notification) => {
        setNotificationUri(
          notification?.notification?.request?.content?.data?.uri
        );

        setId(uuid.v4());

        Notifications.dismissAllNotificationsAsync();
      });

    return () => {
      Notifications.removeNotificationSubscription(clickListener.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <ContentView
        key={id}
        expoPushToken={expoPushToken}
        notificationUri={notificationUri}
      />
    </SafeAreaView>
  );
};

export default App;
