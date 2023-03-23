import { WebView } from "react-native-webview";
import { View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { useRef, useState } from "react";
import * as Notifications from "expo-notifications";

const styles = {
  container: {
    flex: 1,
    // marginTop: getStatusBarHeight(),
  },
};

const ContentView = ({ expoPushToken }) => {
  const [uri, setUri] = useState("http://192.168.3.88:10015");
  // const [uri, setUri] = useState("https://erp-dev.battech.vn/");

  const webviewRef = useRef(null);

  const sendNotifications = (message) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: `${message.title}`,
        body: `${message.body}`,
      },
      trigger: {},
    });
  };

  const headers = {
    "expo-push-token": expoPushToken,
  };

  return (
    <View style={styles.container}>
      <WebView
        key={uri}
        source={{
          uri,
          headers,
        }}
        onLoadStart={(navState) => {
          setUri(navState.nativeEvent.url);
        }}
        originWhitelist={["*"]}
        injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1'); document.getElementsByTagName('head')[0].appendChild(meta);`}
        // onMessage={(e) => {
        //   console.log("Message", e.nativeEvent.data);
        //   sendNotifications(JSON.parse(e.nativeEvent.data));
        // }}
        ref={webviewRef}
      />
    </View>
  );
};

export default ContentView;
