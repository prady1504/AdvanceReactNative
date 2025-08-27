import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import { AuthContext } from '../auth/AuthContext';
import NewsScreen from '../UI/News';
import { Button, Text, TouchableOpacity } from 'react-native';
import ProductListScreen from '../screens/ProductListScreens';


export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    News: undefined;
    ProductList: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();


export default function AppNavigator() {
    const { token, loading, signOut } = useContext(AuthContext);

    if (loading) return <SplashScreen />;

    return (
        <NavigationContainer>
            {token ? (
                <Stack.Navigator
                    screenOptions={() => ({
                        headerRight: () => (
                            <TouchableOpacity onPress={() => signOut()}>
                                <Text style={{ color: "red", marginRight: 10 }}>Logout</Text>
                            </TouchableOpacity>
                        ),
                    })}>
                    <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'Home' }} />
                    <Stack.Screen name="News" component={NewsScreen} />
                    <Stack.Screen name="ProductList" component={ProductListScreen} />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: 'Login' }} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}