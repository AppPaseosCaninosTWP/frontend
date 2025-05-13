import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

interface HeaderAdminUserProps {
  title: string;
}

const HeaderAdminUser: React.FC<HeaderAdminUserProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        {/* Placeholder para balancear el espacio */}
        <View style={styles.placeholder} />
      </View>
    </>
  );
};

export default HeaderAdminUser;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 24,
  },
});