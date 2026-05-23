# 🎤 Jarvis - Sesli AI Asistan

**Iron Man filminden ilham alan, MagicMirror² entegre, Raspberry Pi'da çalışan akıllı sesli asistan**

## 🎯 Özellikler

- 🎙️ **Ses Tanıma** - "Hey Jarvis" ile uyandırma
- 🧠 **Google Gemini AI** - Akıllı cevap verme
- 💾 **Hafıza Sistemi** - Kullanıcı bilgilerini hatırlama
- 🪞 **MagicMirror Entegrasyonu** - Ekran kontrolü
- 🔒 **Güvenlik** - WiFi tabanlı yetkili kullanıcı kontrolü
- 🎵 **Komutlar** - Müzik, video, hava durumu, takvim, arama vb.
- 🚀 **Raspberry Pi Optimized** - Düşük kaynak kullanımı

## 📋 Gereksinimler

- Node.js >= 14.0.0
- Raspberry Pi 3/4/5
- USB Mikrofon
- Speaker/Hoparlör
- Internet Bağlantısı
- Google Gemini API Anahtarı

## 🚀 Kurulum

```bash
# Depoyu klonla
git clone https://github.com/liyadilek2-code/Jarvis-sesli-asistant.git
cd Jarvis-sesli-asistant

# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenle - GOOGLE_API_KEY ekle

# Başlat
npm start
```

## 📂 Proje Yapısı

```
Jarvis-sesli-asistant/
├── src/
│   ├── index.js              # Ana giriş noktası
│   ├── core/
│   │   ├── SpeechRecognition.js    # Ses tanıma motoru
│   │   ├── GeminiAI.js             # Google Gemini entegrasyonu
│   │   ├── CommandProcessor.js     # Komut işleme
│   │   └── MemorySystem.js         # Hafıza yönetimi
│   ├── integrations/
│   │   ├── MagicMirror.js         # MagicMirror modülü
│   │   ├── MusicPlayer.js         # Müzik oynatıcı
│   │   └── WebSearch.js           # Web arama
│   ├── security/
│   │   ├── Authentication.js      # Kullanıcı doğrulama
│   │   ├── NetworkSecurity.js     # Ağ güvenliği
│   │   └── EncryptionUtil.js      # Şifreleme
│   ├── database/
│   │   ├── DatabaseManager.js     # Database yönetimi
│   │   └── migrations/            # Database migrasyonları
│   ├── config/
│   │   ├── config.js              # Konfigürasyon
│   │   └── commands.yaml          # Komut tanımları
│   └── utils/
│       ├── logger.js              # Log sistemi
│       └── helpers.js             # Yardımcı fonksiyonlar
├── magic-mirror-module/          # MagicMirror modülü
├── tests/                         # Test dosyaları
├── scripts/                       # Setup ve yardımcı scriptler
├── .env.example                   # Ortam değişkenleri örneği
├── .gitignore
├── README.md
└── LICENSE

```

## 🔧 Konfigürasyon

### .env Dosyası

```env
# Google Gemini API
GOOGLE_API_KEY=your_gemini_api_key_here

# Sistem
NODE_ENV=production
LOG_LEVEL=info

# MagicMirror
MAGIC_MIRROR_HOST=localhost
MAGIC_MIRROR_PORT=8080

# Güvenlik
SECURE_MODE=true
ALLOWED_USERS=user1,user2
ENCRYPTION_KEY=your_secret_key

# Database
DB_TYPE=sqlite
DB_PATH=./data/jarvis.db

# Ses Ayarları
MIC_THRESHOLD=0.5
SAMPLE_RATE=16000
```

## 🎤 Komutlar

### Temel Komutlar
- "Hey Jarvis" - Uyandır
- "Saat kaç?" - Saat söyle
- "Hava durumu nasıl?" - Hava durumunu bildir
- "Takvim" - Bugünün etkinliklerini göster
- "Google'da ara: [sorgu]" - Web araması yap
- "Bunu bildiğiniz: [bilgi]" - Bilgiyi hafızaya kaydet
- "Müzik aç" - Müzik oynat
- "YouTube'da ara: [video]" - Video ara ve aç
- "Dosya aç: [dosya adı]" - Dosya aç

## 🔒 Güvenlik

### Özellikler
- ✅ WiFi tabanlı yetkili kullanıcı kontrolü
- ✅ Şifreleme ile veri koruması
- ✅ Whitelist/Blacklist sistemi
- ✅ Session yönetimi
- ✅ Aktivite logging

### Uygulanması
```javascript
// Sadece yetkili kullanıcılar erişim sağlayabilir
const isAuthorized = await authManager.verify(userId);
```

## 💾 Hafıza Sistemi

Sistem aşağıdakileri hatırlar:
- Kullanıcı adları ve tercihler
- Önemli notlar ve bilgiler
- Ses komut geçmişi
- Saatler ve tekrarlayan görevler

```json
{
  "userId": "user123",
  "memories": [
    {
      "id": "mem_001",
      "type": "fact",
      "content": "10'da ders var",
      "timestamp": "2026-05-23T12:00:00Z",
      "context": "personal"
    }
  ]
}
```

## 🪞 MagicMirror Entegrasyonu

MagicMirror² modülü olarak çalışır:

```javascript
Module.register("jarvis-assistant", {
  defaults: {
    position: "top_right",
    updateInterval: 30000
  },
  
  notificationReceived: function(notification, payload) {
    // Jarvis'ten bildirim al
  }
});
```

## 📊 Mimari

```
┌─────────────────────────────────────────────────────┐
│           Jarvis Sesli Asistan                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │ Ses Tanıma   │  │ Gemini AI    │               │
│  │ (Mic Input)  │──│ (Responses)  │               │
│  └──────────────┘  └──────────────┘               │
│         ↓                  ↓                        │
│  ┌──────────────────────────────────┐             │
│  │  Komut İşleyici & Hafıza Sistemi │             │
│  └──────────────────────────────────┘             │
│         ↓                                          │
│  ┌──────────────────────────────────┐             │
│  │   MagicMirror Entegrasyonu       │             │
│  │   (Ekran Çıktısı & Kontrol)      │             │
│  └──────────────────────────────────┘             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🧪 Test Etme

```bash
npm test
```

## 📝 Lisans

MIT License - Açık kaynak proje

## 👤 Geliştirici

**liyadilek2-code**

## 🤝 Katkı

Katkılar hoş karşılanır! Lütfen:
1. Fork et
2. Feature branch oluştur (`git checkout -b feature/AmazingFeature`)
3. Commit et (`git commit -m 'Add some AmazingFeature'`)
4. Push et (`git push origin feature/AmazingFeature`)
5. Pull Request aç

## 📞 Destek

Sorunlarınız veya önerileriniz için GitHub Issues'ı kullanın.

---

**Made with ❤️ for Smart Home & Raspberry Pi Enthusiasts**
