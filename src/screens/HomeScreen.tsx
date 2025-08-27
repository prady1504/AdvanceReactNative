import React from 'react';
import {  StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomButton from '../components/CustomButton';


export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const goToNews = () => {
        navigation.navigate('News');
    };
    const goToProducts = () => {
        navigation.navigate('ProductList');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome! 🎉</Text>
            <Text style={styles.body}>This is a protected screen. You can only see this if a token exists.</Text>
            <View style={{ height: 16 }} />
            <CustomButton title="Go to News" onPress={goToNews} />
            <CustomButton title="Go to Products" onPress={goToProducts} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
    body: { fontSize: 16, textAlign: 'center', color: '#333' },
});