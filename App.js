import React from 'react'
import { SafeAreaView, Platform, Text, NativeModules } from 'react-native'

import PushNotificationIOS from '@react-native-community/push-notification-ios'
import Analytics from '@aws-amplify/analytics'
import Amplify from 'aws-amplify'
import PushNotification from '@aws-amplify/pushnotification'
import awsconfig from './aws-exports'

Amplify.configure(awsconfig)
PushNotification.configure(awsconfig)

PushNotification.onRegister(async token => {
  console.log('in app registration', token)
  PushNotification.updateEndpoint(token)
})

// In case PushNotification.onRegister didn't work
NativeModules.RNPushNotification.getToken(token => {
  console.log(`PushToken: ${token}`)
})

PushNotification.onNotification(notification => {
  console.log('in app notification', notification)
  if (Platform.OS === 'ios') {
    notification.finish(PushNotificationIOS.FetchResult.NoData)
  }
})

PushNotification.onNotificationOpened(notification => {
  console.log('the notification is opened', notification)
})

const endpointId = Analytics.getPluggable('AWSPinpoint')._config.endpointId
console.log(`endpoint ID: ${endpointId}`)

if (Platform.OS === 'ios') {
  PushNotification.requestIOSPermissions()
}

const App: () => React$Node = () => {
  return (
    <SafeAreaView>
      <Text>Push Notification</Text>
    </SafeAreaView>
  )
}

export default App