import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { WebView, PixelRatio } from 'react-native-webview';

export default function App() {
  const customHTML = `
      <body style="display:flex; flex-direction: column;justify-content: center; 
        align-items:center; background-color: black; color:white; height: 100%;">
          <h1 style="font-size:100px; padding: 50px; text-align: center;" 
          id="h1_element">
            This is simple html
          </h1>
          <h2 style="display: block; font-size:80px; padding: 50px; 
          text-align: center;" id="h2_element">
            This text will be changed later!
          </h2>
       </body>`;
  const [webviewHeight, setWebviewHeight] = useState(0);
  const onProductDetailsWebViewMessage = event => {
    setWebviewHeight(Number(event.nativeEvent.data)/PixelRatio.get())
  }
  const deviceHieght = Dimensions.get('window').height;
  const webViewHieght = deviceHieght;
  return (
    <View style={{height: webViewHieght}}>
      <StatusBar barStyle="dark-content" />
              <SafeAreaView style={{flex: 1}}>
              <WebView 
                source={{ uri: 'https://erp.battech.vn/en/web/login' }} 
                allowFileAccess={true}
                scalesPageToFit={false}
                originWhitelist={['*']}
                automaticallyAdjustContentInsets={true}
                javaScriptEnabled={true}
                startInLoadingState={true}
                domStorageEnabled={true}
                style={{
                  width: '100%',
                  height: 50000,
                  flex: 1
                }}
                //injectedJavaScript='window.ReactNativeWebView.postMessage(document.body.scrollHeight)'
                injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                //source={{ html: customHTML }} 
              />
              </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
