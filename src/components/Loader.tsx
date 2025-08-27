import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

interface Props {
  label?: string;
}

export default function LoadingIndicator({ label = 'Loading...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 8,
    color: '#555',
  },
});
