/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Button, Platform, View, Alert} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

const NFCReader = () => {
  useEffect(() => {
    hasSupportNFC();
  });

  const hasSupportNFC = async () => {
    try {
      await NfcManager.start();
      const isSupported = await NfcManager.isSupported();
      if (!isSupported) {
        console.log('NFC is not supported');
        return;
      }

      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        console.log('NFC is not enabled');
        return;
      }

      if (Platform.OS === 'ios') {
        NfcManager.setAlertMessageIOS('Approach NFC tag');
      }

      await readNdef();
    } catch (ex) {
      console.log('Error initializing NFC', ex);
    }
  };

  const readNdef = async () => {
    try {
      const tag = await NfcManager.requestTechnology([NfcTech.Ndef]);
      if (tag) {
        const stats = await NfcManager.ndefHandler.getNdefStatus();
        console.log('NDEF status:', stats);
      }
      console.log('Tag detected:', tag);
      Alert.alert('NFC Tag Detected', `Tag: ${tag}`);
    } catch (ex) {
      console.warn('Error reading NFC tag', ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button onPress={() => hasSupportNFC()} title="Start NFC Reader" />
    </View>
  );
};

export default NFCReader;
