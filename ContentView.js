import { WebView } from "react-native-webview";
import { View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";

const styles = {
  container: {
    flex: 1,
    // marginTop: getStatusBarHeight(),
  },
};

const ContentView = ({ expoPushToken, channelId, setChannelId }) => {
  const [uri, setUri] = useState("http://192.168.3.88:10015");
  // const [uri, setUri] = useState("https://erp-dev.battech.vn/");

  const webviewRef = useRef(null);

  useEffect(() => {
    if (channelId) {
      setUri(
        (uri) =>
          `${uri}/web#menu_id=75&cids=1&default_active_id=mail.box_inbox&action=104&active_id=mail.channel_${channelId}`
      );
      setChannelId("");
    }
  }, [channelId]);

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
