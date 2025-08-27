import React, { useContext, useState } from 'react';
import { Alert, Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthContext } from '../auth/AuthContext';

export default function LoginScreen() {

    const { signIn } = useContext(AuthContext);
    const [username, setUsername] = useState('emilys');
    const [password, setPassword] = useState('emilyspass');
    const [submitting, setSubmitting] = useState(false);


    const onLogin = async () => {
        setSubmitting(true);
        try {
            await signIn(username.trim(), password);
        } catch (e: any) {
            Alert.alert('Login failed', e?.message ?? 'Unknown error');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Text style={styles.title}>Secure Login</Text>


            <TextInput
                style={styles.input}
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                value={username}
                onChangeText={setUsername}
            />


            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />


            <Button title={submitting ? 'Logging in…' : 'Login'} onPress={onLogin} disabled={submitting} />


            <View style={{ height: 12 }} />
            <Text style={styles.hint}>Use ReqRes test creds shown above.</Text>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    hint: { textAlign: 'center', color: '#666' },
});