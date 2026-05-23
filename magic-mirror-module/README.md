# 🤖 Jarvis Assistant Module for MagicMirror²

**Iron Man Styled Voice Assistant UI**

Bu modül, MagicMirror² ekranında Jarvis sesli asistanını Iron Man tarzında güzel bir arayüzle görüntüler.

## 📋 Özellikler

- 🎤 **Canlı Dinleme Animasyonu** - Cyan renkli dalga efekti
- 💬 **Komut Gösterimi** - Yazılı efekti ile komut görüntüleme
- 🧠 **AI Yanıt Gösterimi** - Gemini AI'nin yanıtlarını renkli olarak göster
- 📜 **Komut Geçmişi** - Son 5 komutu listele
- 📊 **İstatistikler** - Toplam komut, başarılı, başarısız sayıları
- 🎮 **Kontrol Butonları** - Sessize alma, ayarlar, yenile
- 🎨 **Iron Man Teması** - Cyan/mavi ışıl efekti
- ✨ **Smooth Animasyonlar** - Geçişler ve animasyonlar
- 📱 **Responsive** - Tüm cihazlarda çalışır
- 🌙 **Dark Mode** - Ayna için optimize edilmiş karanlık tema

## 🚀 Kurulum

### 1. Modülü Klonla

```bash
cd ~/MagicMirror/modules
git clone https://github.com/liyadilek2-code/Jarvis-sesli-asistant.git
cd Jarvis-sesli-asistant
cp -r magic-mirror-module ../jarvis-assistant
```

### 2. MagicMirror Config'e Ekle

`~/MagicMirror/config/config.js` dosyasını düzenle:

```javascript
{
  module: 'jarvis-assistant',
  position: 'top_right',
  header: '🤖 Jarvis AI Assistant',
  config: {
    theme: 'dark',           // dark veya light
    size: 'medium',          // small, medium, large
    updateInterval: 100,
    animationSpeed: 'normal', // slow, normal, fast
    showStatistics: true,
    showCommandHistory: true,
    commandHistoryLimit: 5,
  }
}
```

### 3. Jarvis Backend'i Bağla

`src/index.js`'i güncelleyin:

```javascript
// MagicMirror'a bildirim gönder
const sendToMagicMirror = (notification, payload) => {
  // Socket.io ile gönder
  io.emit('jarvis-update', { notification, payload });
};

// Dinleme başlangıcında
jasvis.on('wakeword', () => {
  sendToMagicMirror('JARVIS_LISTENING', {});
});

// Komut işlendiğinde
jarvis.on('command', (command) => {
  sendToMagicMirror('JARVIS_COMMAND', {
    command: command,
    response: 'Processing...'
  });
});

// Cevap verildiğinde
jarvis.on('response', (response) => {
  sendToMagicMirror('JARVIS_RESPONSE', {
    response: response,
    duration: 3000
  });
});
```

## ⚙️ Konfigürasyon

### Theme Options

```javascript
config: {
  theme: 'dark'  // Varsayılan - Dark blue/cyan
  // veya
  theme: 'light' // Açık tema - Light blue
}
```

### Size Options

```javascript
config: {
  size: 'small'   // 250px genişlik
  size: 'medium'  // 300px genişlik (varsayılan)
  size: 'large'   // 700px genişlik
}
```

### Position Options

MagicMirror standart pozisyon seçenekleri:

- `top_left`
- `top_center`
- `top_right`
- `center_left`
- `center_center`
- `center_right`
- `bottom_left`
- `bottom_center`
- `bottom_right`

## 🎨 UI Elementleri

### Header
```
◆ JARVIS ◆  [Status LED]
```

### Microphone Section
```
      [🎤 SVG]
      Listening... / Speaking... / Ready
```

### Command Display
```
📋 Your Command:
[Kullanıcının söylediği komut]
```

### Response Display
```
🤖 Jarvis Response:
[AI'nin yanıtı - ilk 200 karakter]
```

### Command History
```
📜 History:
1. First command
2. Second command
3. Third command
...
```

### Statistics
```
Commands: 42  |  Success: 40  |  Errors: 2
```

### Controls
```
[🔇 Mute] [🔄 Refresh] [⚙️ Settings]
```

## 🎬 Animasyonlar

### Glow Effect
- Logo'da parlayan cyan ışı
- Status LED'de nabız efekti

### Wave Animation
- Dinleme sırasında ses dalgası animasyonu
- 4 basamaklı dalga efekti

### Typewriter Effect
- Komutlar yazılı efekti ile görünür
- Yanıtlar kademeli olarak yüklenir

### Slide In Animation
- Yeni komutlar soldan kaydırarak girer

## 🔌 WebSocket Events

Backend'den MagicMirror'a gönderilen events:

```javascript
// Dinlemeye başladığında
'JARVIS_LISTENING'  → { }

// Dinlemeyi durdurduğunda
'JARVIS_STOPPED_LISTENING' → { }

// Komut alındığında
'JARVIS_COMMAND' → { command: 'string', type: 'string' }

// Yanıt verildiğinde
'JARVIS_RESPONSE' → { response: 'string', duration: number }

// Hata oluştuğunda
'JARVIS_ERROR' → { error: 'string' }

// Durum isteklendiğinde
'JARVIS_STATE' → { statistics: {}, commandHistory: [] }
```

## 🛠️ Özelleştirme

### Renk Değiştirme

`jarvis-assistant.css` dosyasında:

```css
/* Cyan'ı yeşile değiştir */
.jarvis-container {
  border: 2px solid #00ff00;  /* #00d9ff yerine */
  color: #00ff00;
  /* ... */
}
```

### Font Değiştirme

```css
.jarvis-container {
  font-family: 'Your Font', monospace;
}
```

### Boyut Ayarlama

```css
.jarvis-container.jarvis-medium {
  min-width: 400px;  /* 300px yerine */
  padding: 30px;     /* 20px yerine */
}
```

## 📱 Responsive Design

Modül otomatik olarak aşağıdaki boyutlara uyum sağlar:

- **Desktop:** Tam boyut
- **Tablet:** Uyumlu boyut
- **Mobil:** Ekran genişliğinin %90'ı

## 🐛 Troubleshooting

### Animasyonlar çalışmıyor
- CSS yüklendığini kontrol edin
- Browser'ın CSS animasyonları desteklediğini kontrol edin

### Komutlar görünmüyor
- Backend'den `JARVIS_COMMAND` event gönderildiğini kontrol edin
- WebSocket bağlantısını kontrol edin

### Metin kesilmiş görünüyor
- Module'ün genişliğini artırın (`size: 'large'`)
- Font boyutunu azaltın

## 📊 Performance

- **Update Interval:** 100ms (dinleme animasyonu)
- **Memory Usage:** ~2MB (modül kodu)
- **CPU Impact:** Minimal (CSS animasyonları)

## 📝 License

MIT License - Açık kaynak

## 🤝 Katkı

Bugs, feature requests ve pull request'ler hoşlanır!

## 📞 Destek

Sorularınız için GitHub Issues'ı kullanın.

---

**Made with ❤️ by liyadilek2-code**

*Inspired by Iron Man's Jarvis AI* 🤖
