import { useEffect, useState, useRef } from "react";
import { StyleSheet, StatusBar, Platform, SafeAreaView } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import ContentView from "./ContentView";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    // marginBottom: -50,
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
  const [channelId, setChannelId] = useState({ id: "", pressEvent: false });
  const notificationListener = useRef();
  const responseListener = useRef();
  const clickListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log(
        //   "NOTIFICATION RECEIVED",
        //   notification?.request?.content?.data?.channel_id
        // );
      });

    clickListener.current =
      Notifications.addNotificationResponseReceivedListener((notification) => {
        console.log(
          notification.notification.request.content.data.channel_id,
          "PRESSED"
        );
        setChannelId((ev) => {
          const ret = {
            id: notification.notification?.request?.content?.data?.channel_id,
            pressEvent: !ev.pressEvent,
          };
          return ret;
        });
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log("NOTIFICATION RESPONSE RECEIVED", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      Notifications.removeNotificationSubscription(clickListener.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <ContentView expoPushToken={expoPushToken} channelId={channelId} />
    </SafeAreaView>
  );
};

export default App;
