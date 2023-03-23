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

const ContentView = ({ expoPushToken, channelId }) => {
  // const [uri, setUri] = useState("http://192.168.3.88:10015");
  const originalUri = "https://erp-dev.battech.vn";
  const [uri, setUri] = useState(originalUri);

  const webviewRef = useRef(null);

  useEffect(() => {
    if (channelId.id)
      setUri(
        `${originalUri}/web#cids=1&default_active_id=mail.box_inbox&action=115&menu_id=79&active_id=mail.channel_${channelId.id}`
      );
  }, [channelId.pressEvent]);

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
        key={channelId.pressEvent}
        source={{
          uri: uri,
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
