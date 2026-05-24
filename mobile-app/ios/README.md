# Jarvis iOS App - React Native

🤖 iPhone ve iPad'de Jarvis'i kullan

## 📋 Gereksinimler

- **Mac** (XCode gerekli)
- **Node.js** >= 14
- **npm** veya **yarn**
- **XCode Command Line Tools**
- **CocoaPods**
- **iOS 13+**

## 🚀 Kurulum

### 1️⃣ Başlangıç

```bash
# React Native uygulaması oluştur
npx react-native init JarvisApp
cd JarvisApp

# iOS bağımlılıklarını yükle
cd ios
pod install
cd ..
```

### 2️⃣ Gerekli Paketleri Yükle

```bash
npm install socket.io-client axios react-native-voice react-native-svg
npm install --save-dev @types/react-native
```

### 3️⃣ iOS Projesini Açın

```bash
# XCode ile aç
open ios/JarvisApp.xcworkspace
```

### 4️⃣ İlk Çalıştırma

```bash
# Metro bundler başlat
npm start

# Yeni terminal'de iOS simulator'ı başlat
npm run ios

# veya direkt XCode'dan Run butonuna bas
```

## 📱 Uygulama Yapısı

```
JarvisApp/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── CommandScreen.js
│   │   ├── VoiceScreen.js
│   │   ├── MemoryScreen.js
│   │   └── SettingsScreen.js
│   ├── components/
│   │   ├── Header.js
│   │   ├── CommandInput.js
│   │   ├── ResponseDisplay.js
│   │   ├── VoiceButton.js
│   │   └── MemoryList.js
│   ├── services/
│   │   ├── JarvisAPI.js
│   │   ├── SocketService.js
│   │   └── VoiceService.js
│   ├── context/
│   │   └── JarvisContext.js
│   ├── styles/
│   │   └── theme.js
│   └── App.js
├── ios/
├── android/
├── package.json
└── app.json
```

## 📝 App.js - Ana Dosya

```javascript
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JarvisProvider } from './src/context/JarvisContext';

import HomeScreen from './src/screens/HomeScreen';
import CommandScreen from './src/screens/CommandScreen';
import VoiceScreen from './src/screens/VoiceScreen';
import MemoryScreen from './src/screens/MemoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <JarvisProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0a0e27',
            },
            headerTintColor: '#00d9ff',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#00d9ff',
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Command" component={CommandScreen} />
          <Stack.Screen name="Voice" component={VoiceScreen} />
          <Stack.Screen name="Memory" component={MemoryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </JarvisProvider>
  );
}
```

## 🎨 HomeScreen.js

```javascript
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { JarvisContext } from '../context/JarvisContext';
import { theme } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
  const { status, socket } = useContext(JarvisContext);
  const [stats, setStats] = useState({
    totalCommands: 0,
    successfulCommands: 0,
    failedCommands: 0,
  });

  useEffect(() => {
    // Durumu al
    socket?.on('status-update', (data) => {
      setStats(data.statistics);
    });

    return () => {
      socket?.off('status-update');
    };
  }, [socket]);

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <Text style={styles.logo}>🤖 JARVIS</Text>
        <Text style={styles.tagline}>Sesli AI Asistan</Text>
      </View>

      {/* Status */}
      <View style={styles.statusSection}>
        <View style={styles.statusItem}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: status.isListening ? '#00d9ff' : '#4caf50' },
            ]}
          />
          <Text style={styles.statusLabel}>
            {status.isListening ? 'Dinleniyor...' : 'Hazır'}
          </Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{stats.totalCommands}</Text>
          <Text style={styles.statusLabel}>Komutlar</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{stats.successfulCommands}</Text>
          <Text style={styles.statusLabel}>Başarılı</Text>
        </View>
      </View>

      {/* Hızlı Komutlar */}
      <View style={styles.quickCommandsSection}>
        <Text style={styles.sectionTitle}>⚡ Hızlı Komutlar</Text>
        <View style={styles.quickCommandsGrid}>
          {[
            { icon: '⏰', label: 'Saat Kaç?', command: 'Saat kaç?' },
            { icon: '🌤️', label: 'Hava Durumu', command: 'Hava nasıl?' },
            { icon: '📅', label: 'Takvim', command: 'Takvim' },
            { icon: '🎵', label: 'Müzik Aç', command: 'Müzik aç' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickCommand}
              onPress={() => {
                socket?.emit('send-command', { command: item.command });
              }}
            >
              <Text style={styles.quickCommandIcon}>{item.icon}</Text>
              <Text style={styles.quickCommandLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ana Butonlar */}
      <View style={styles.buttonsSection}>
        <TouchableOpacity
          style={[styles.mainButton, styles.voiceButton]}
          onPress={() => navigation.navigate('Voice')}
        >
          <Text style={styles.buttonIcon}>🎤</Text>
          <Text style={styles.buttonText}>Ses ile Kontrol</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, styles.commandButton]}
          onPress={() => navigation.navigate('Command')}
        >
          <Text style={styles.buttonIcon}>📋</Text>
          <Text style={styles.buttonText}>Komut Gönder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, styles.memoryButton]}
          onPress={() => navigation.navigate('Memory')}
        >
          <Text style={styles.buttonIcon}>💾</Text>
          <Text style={styles.buttonText}>Hafıza</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, styles.settingsButton]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonIcon}>⚙️</Text>
          <Text style={styles.buttonText}>Ayarlar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00d9ff',
    textShadowColor: '#00d9ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#00d9ff',
    marginTop: 10,
    opacity: 0.8,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    marginHorizontal: 15,
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00d9ff',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusLabel: {
    color: '#00d9ff',
    fontSize: 12,
  },
  statusValue: {
    color: '#00d9ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickCommandsSection: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#00d9ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickCommandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCommand: {
    width: '48%',
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00d9ff',
  },
  quickCommandIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickCommandLabel: {
    color: '#00d9ff',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonsSection: {
    marginHorizontal: 15,
    marginBottom: 40,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  voiceButton: {
    borderColor: '#00d9ff',
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
  },
  commandButton: {
    borderColor: '#2196f3',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  memoryButton: {
    borderColor: '#ff9800',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  settingsButton: {
    borderColor: '#4caf50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d9ff',
    flex: 1,
  },
});

export default HomeScreen;
```

## 🎤 VoiceScreen.js

```javascript
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Voice from 'react-native-voice';
import { JarvisContext } from '../context/JarvisContext';

const VoiceScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { socket } = useContext(JarvisContext);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    socket?.on('command-processed', (data) => {
      setLastResponse(data.response || 'İşlendi');
      setIsProcessing(false);
    });

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [socket]);

  const onSpeechStart = () => {
    console.log('Dinleme başladı...');
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const onSpeechResults = (e) => {
    const command = e.value[0];
    setLastCommand(command);
    setIsProcessing(true);
    
    // Komutu gönder
    socket?.emit('send-command', { command });
  };

  const onSpeechError = (e) => {
    console.error('Ses hatası:', e);
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      setLastCommand('');
      setLastResponse('');
      await Voice.start('tr-TR');
    } catch (error) {
      console.error('Dinleme başlatma hatası:', error);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      await Voice.stop();
    } catch (error) {
      console.error('Dinleme durdurma hatası:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Mikrofon Animasyonu */}
      <View style={styles.microphoneSection}>
        <View
          style={[
            styles.microphoneCircle,
            isListening && styles.microphoneActive,
          ]}
        >
          <Text style={styles.microphoneIcon}>🎤</Text>
        </View>
        <Text style={styles.statusText}>
          {isListening
            ? '🎙️ Dinleniyor...'
            : isProcessing
            ? '⏳ İşleniyor...'
            : '😴 Hazır'}
        </Text>
      </View>

      {/* Dalga Animasyonu */}
      {isListening && (
        <View style={styles.waveContainer}>
          <View style={[styles.wave, { animationDelay: '0s' }]} />
          <View style={[styles.wave, { animationDelay: '0.1s' }]} />
          <View style={[styles.wave, { animationDelay: '0.2s' }]} />
          <View style={[styles.wave, { animationDelay: '0.3s' }]} />
        </View>
      )}

      {/* Son Komut */}
      {lastCommand ? (
        <View style={styles.commandDisplay}>
          <Text style={styles.commandLabel}>📋 Söylediğiniz:</Text>
          <Text style={styles.commandText}>{lastCommand}</Text>
        </View>
      ) : null}

      {/* Yanıt */}
      {lastResponse ? (
        <View style={styles.responseDisplay}>
          <Text style={styles.responseLabel}>🤖 Jarvis Yanıtı:</Text>
          <Text style={styles.responseText}>{lastResponse}</Text>
        </View>
      ) : null}

      {/* Butonlar */}
      <View style={styles.buttonsContainer}>
        {!isListening ? (
          <TouchableOpacity
            style={[styles.button, styles.listenButton]}
            onPress={startListening}
          >
            <Text style={styles.buttonIcon}>🎙️</Text>
            <Text style={styles.buttonText}>Dinlemeyi Başlat</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={stopListening}
          >
            <Text style={styles.buttonIcon}>⏹️</Text>
            <Text style={styles.buttonText}>Dinlemeyi Durdur</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    padding: 20,
  },
  microphoneSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  microphoneCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#00d9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  microphoneActive: {
    borderColor: '#00d9ff',
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
  },
  microphoneIcon: {
    fontSize: 60,
  },
  statusText: {
    fontSize: 18,
    color: '#00d9ff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 30,
  },
  wave: {
    width: 4,
    height: 30,
    backgroundColor: '#00d9ff',
    borderRadius: 2,
    marginHorizontal: 4,
  },
  commandDisplay: {
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#00d9ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  commandLabel: {
    color: '#00d9ff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commandText: {
    color: '#00d9ff',
    fontSize: 14,
  },
  responseDisplay: {
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#00d9ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  responseLabel: {
    color: '#00d9ff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  responseText: {
    color: '#00d9ff',
    fontSize: 14,
  },
  buttonsContainer: {
    marginTop: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
  },
  listenButton: {
    borderColor: '#00d9ff',
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
  },
  stopButton: {
    borderColor: '#ff9800',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  buttonText: {
    color: '#00d9ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VoiceScreen;
```

## 📝 CommandScreen.js

```javascript
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { JarvisContext } from '../context/JarvisContext';

const CommandScreen = () => {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useContext(JarvisContext);

  const sendCommand = () => {
    if (!command.trim()) {
      alert('Lütfen bir komut girin!');
      return;
    }

    setIsLoading(true);
    setResponse('');

    socket?.emit('send-command', { command });

    socket?.on('command-processed', (data) => {
      setResponse(data.response || 'İşlendi');
      setIsLoading(false);
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hızlı Komutlar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Hızlı Komutlar</Text>
        <View style={styles.quickCommandsGrid}>
          {[
            { icon: '⏰', label: 'Saat Kaç?', cmd: 'Saat kaç?' },
            { icon: '🌤️', label: 'Hava', cmd: 'Hava nasıl?' },
            { icon: '📅', label: 'Takvim', cmd: 'Takvim' },
            { icon: '🎵', label: 'Müzik', cmd: 'Müzik aç' },
            { icon: '🔍', label: 'Ara', cmd: 'Google\'da ara' },
            { icon: '🎬', label: 'Video', cmd: 'YouTube\'da ara' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickCommand}
              onPress={() => {
                setCommand(item.cmd);
                setIsLoading(true);
                socket?.emit('send-command', { command: item.cmd });
              }}
            >
              <Text style={styles.quickIcon}>{item.icon}</Text>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Komut Giriş */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Komut Gir</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Hava durumu nasıl?"
          placeholderTextColor="rgba(0, 217, 255, 0.5)"
          value={command}
          onChangeText={setCommand}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.loadingButton]}
          onPress={sendCommand}
          disabled={isLoading}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? '⏳ İşleniyor...' : '📤 Gönder'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Yanıt */}
      {response && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 Yanıt</Text>
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#00d9ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickCommandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCommand: {
    width: '31%',
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00d9ff',
  },
  quickIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  quickLabel: {
    color: '#00d9ff',
    fontSize: 11,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d9ff',
    borderRadius: 8,
    color: '#00d9ff',
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#00d9ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  loadingButton: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#00d9ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  responseBox: {
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#00d9ff',
    borderRadius: 8,
    padding: 15,
  },
  responseText: {
    color: '#00d9ff',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CommandScreen;
```

## 💾 MemoryScreen.js

```javascript
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import { JarvisContext } from '../context/JarvisContext';

const MemoryScreen = () => {
  const [memoryInput, setMemoryInput] = useState('');
  const [memories, setMemories] = useState([]);
  const { socket } = useContext(JarvisContext);

  useEffect(() => {
    loadMemories();

    socket?.on('memory-added', () => {
      loadMemories();
    });
  }, [socket]);

  const loadMemories = () => {
    socket?.emit('get-memories', { limit: 20 });
    socket?.on('memories-list', (data) => {
      setMemories(data.memories);
    });
  };

  const addMemory = () => {
    if (!memoryInput.trim()) {
      alert('Lütfen bir şey girin!');
      return;
    }

    socket?.emit('add-memory', { content: memoryInput });
    setMemoryInput('');
  };

  return (
    <View style={styles.container}>
      {/* Hafıza Giriş */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>💾 Hafızaya Kaydet</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Pazartesi 10'da toplantım var"
          placeholderTextColor="rgba(0, 217, 255, 0.5)"
          value={memoryInput}
          onChangeText={setMemoryInput}
          multiline
        />
        <TouchableOpacity style={styles.saveButton} onPress={addMemory}>
          <Text style={styles.saveButtonText}>💾 Kaydet</Text>
        </TouchableOpacity>
      </View>

      {/* Hafıza Listesi */}
      <ScrollView style={styles.memoriesList}>
        <Text style={styles.sectionTitle}>📖 Hatırlanan Bilgiler</Text>
        {memories.length === 0 ? (
          <Text style={styles.emptyText}>Henüz hafıza yok</Text>
        ) : (
          memories.map((memory, index) => (
            <View key={index} style={styles.memoryItem}>
              <Text style={styles.memoryNumber}>{index + 1}.</Text>
              <Text style={styles.memoryText}>{memory}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    padding: 15,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#00d9ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d9ff',
    borderRadius: 8,
    color: '#00d9ff',
    padding: 12,
    fontSize: 14,
    maxHeight: 100,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#00d9ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#00d9ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  memoriesList: {
    flex: 1,
  },
  memoryItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#ff9800',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  memoryNumber: {
    color: '#ff9800',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  memoryText: {
    color: '#00d9ff',
    fontSize: 13,
    flex: 1,
  },
  emptyText: {
    color: 'rgba(0, 217, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MemoryScreen;
```

## 🔧 services/JarvisAPI.js

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.100:3001'; // Raspberry Pi IP'sini değiştir

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const JarvisAPI = {
  // Durum al
  getStatus: async () => {
    return api.get('/api/status');
  },

  // Komut gönder
  sendCommand: async (command) => {
    return api.post('/api/command', { command });
  },

  // Hafızaları al
  getMemories: async () => {
    return api.get('/api/memories');
  },

  // İstatistikleri al
  getStatistics: async () => {
    return api.get('/api/statistics');
  },

  // Cihaz bilgisi
  getDeviceInfo: async () => {
    return api.get('/api/device-info');
  },
};

export default api;
```

## 🔌 services/SocketService.js

```javascript
import io from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.100:3001'; // IP'yi değiştir

let socket = null;

export const SocketService = {
  connect: () => {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999,
    });

    socket.on('connect', () => {
      console.log('✅ Socket bağlantısı başarılı');
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket bağlantısı kesildi');
    });

    return socket;
  },

  getSocket: () => socket,

  disconnect: () => {
    if (socket) {
      socket.disconnect();
    }
  },
};
```

## 🎨 styles/theme.js

```javascript
export const theme = {
  colors: {
    primary: '#00d9ff',
    secondary: '#1a1f3a',
    background: '#0a0e27',
    text: '#00d9ff',
    textSecondary: '#2196f3',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
  },
  fonts: {
    regular: 'Courier New',
    bold: 'Courier New',
  },
};
```

## 📦 package.json

```json
{
  "name": "JarvisApp",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "web": "expo start --web",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@react-navigation/native": "^6.1.6",
    "@react-navigation/native-stack": "^6.9.12",
    "axios": "^1.4.0",
    "react": "18.2.0",
    "react-native": "0.72.0",
    "react-native-gesture-handler": "^2.12.0",
    "react-native-reanimated": "^3.3.0",
    "react-native-safe-area-context": "^4.6.3",
    "react-native-screens": "^3.22.0",
    "react-native-svg": "^13.9.0",
    "react-native-voice": "^3.2.4",
    "socket.io-client": "^4.5.4"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "@babel/preset-react": "^7.22.0",
    "@react-native-community/eslint-config": "^3.2.0",
    "babel-jest": "^29.7.0",
    "jest": "^29.7.0",
    "metro-react-native-babel-preset": "0.76.8"
  }
}
```

## ⚙️ Info.plist - Ses İzinleri

`ios/JarvisApp/Info.plist` dosyasına ekle:

```xml
<dict>
  <key>NSMicrophoneUsageDescription</key>
  <string>Jarvis'i ses komutları ile kontrol etmek için mikrofon erişimi gereklidir</string>
  <key>NSLocalNetworkUsageDescription</key>
  <string>Jarvis sesli asistanına bağlanmak için yerel ağ erişimi gereklidir</string>
  <key>NSBonjourServices</key>
  <array>
    <string>_services._dns-sd._udp</string>
  </array>
</dict>
```
