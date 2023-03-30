import { WebView } from "react-native-webview";
import { View } from "react-native";
import * as Notifications from "expo-notifications";

import { useEffect, useRef, useState } from "react";

const styles = {
  container: {
    flex: 1,
  },
};

const ContentView = ({ expoPushToken, notificationUri }) => {
  const originalUri = "https://erp-dev.battech.vn";
  // const originalUri = "http://192.168.3.88:10015";
  // const originalUri = "https://26215957-16-0-all.runbot106.odoo.com";

  const [uri, setUri] = useState(originalUri);
  const webviewRef = useRef(null);

  const disableNoti = (event) => {
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        if (event.url.includes("mail.box_inbox"))
          return {
            shouldShowAlert: false,
          };
        return {
          shouldShowAlert: true,
        };
      },
    });
  };

  useEffect(() => {
    setUri(notificationUri ? notificationUri : originalUri);
  }, [notificationUri]);

  const headers = {
    "expo-push-token": expoPushToken,
  };

  return (
    <View style={styles.container}>
      <WebView
        key={uri}
        source={{
          uri: uri,
          headers,
          sendHeadersToHosts: [originalUri],
        }}
        onNavigationStateChange={disableNoti}
        onLoadStart={(navState) => {
          if (navState.nativeEvent.url.includes(`${originalUri}/web`)) {
            setUri(navState.nativeEvent.url);
          }
        }}
        originWhitelist={["*"]}
        injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1'); document.getElementsByTagName('head')[0].appendChild(meta);`}
        ref={webviewRef}
      />
    </View>
  );
};

export default ContentView;
