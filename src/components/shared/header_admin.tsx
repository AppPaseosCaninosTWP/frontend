import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

interface header_admin_props {
  title: string;
}

export default function Header_admin({ title }: header_admin_props) {
  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView style={styles.safe_area} />
      <View style={styles.header_bar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.title_text}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.bottom_spacer} />
    </>
  );
}

const styles = StyleSheet.create({
  safe_area: {
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'android' ? { height: StatusBar.currentHeight } : {}),
  },
  header_bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title_text: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 24,
  },
  bottom_spacer: {
    height: 8,
    backgroundColor: '#FFFFFF',
  },
});
