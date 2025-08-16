# 🏋️‍♀️ Fit Body - PWA Fitness Tracker

**localStorage-powered**, **offline-first** mobil fitness tracking PWA. Next.js 14 ile geliştirilmiş, backend'e ihtiyaç duymayan, tamamen client-side çalışan günlük egzersiz takip uygulaması.

## 🎯 Proje Vizyonu

**Basitlik ve hız** odaklı fitness uygulaması. Backend karmaşıklığından arınmış, instant loading, offline çalışabilen ve kullanıcı verilerini tamamen lokal tutan bir Progressive Web App geliştirmek. Mobil-first yaklaşımla native app deneyimi sunmak.

## 📁 Dokümantasyon Yapısı

Bu proje için aşağıdaki detaylı dokümantasyonlar hazırlanmıştır:

### 📋 Planlama ve Strateji
- **[`ROADMAP.md`](docs/ROADMAP.md)** - Proje yol haritası, geliştirme fazları ve zaman çizelgesi
- **[`USER_STORIES_REQUIREMENTS.md`](docs/USER_STORIES_REQUIREMENTS.md)** - Kullanıcı profilleri, user stories ve detaylı gereksinimler

### 🛠️ Teknik Dokümantasyon
- **[`TECHNICAL_DESIGN.md`](docs/TECHNICAL_DESIGN.md)** - Sistem mimarisi, veritabanı tasarımı ve API dokümantasyonu
- **[`DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md)** - Geliştirme süreci, kod standartları ve katkı kılavuzu

### 🎨 Tasarım Sistem
- **[`UI_UX_DESIGN_GUIDE.md`](docs/UI_UX_DESIGN_GUIDE.md)** - UI/UX tasarım sistemi, component library ve mobil tasarım prensipleri

## 🚀 Hızlı Başlangıç

### Mevcut Egzersiz Programı
Projede zaten detaylı bir egzersiz programı bulunmaktadır:
- **[`excersise.md`](excersise.md)** - 7 günlük haftalık egzersiz planı

Bu program, uygulamanın temel içeriğini oluşturacak ve kullanıcılara örnek workout programları sunacaktır.

## ⚡ Temel Özellikler

### 🚀 localStorage-First Yaklaşımı
- **Instant Loading**: Backend call'ları yok, tüm data lokal
- **Offline-First**: İnternet olmadan tam fonksiyonel
- **Privacy-Focused**: Data kullanıcının cihazında kalıyor
- **No Registration Required**: İsteğe bağlı basit profil

### 📱 PWA Deneyimi  
- **App-like Experience**: Fullscreen, native görünüm
- **Install Prompt**: Home screen'e eklenebilir
- **Push Notifications**: Workout hatırlatmaları
- **Responsive Design**: Mobil, tablet, desktop optimize

### 🏋️ Core Fitness Features
- **Preset Programs**: exercise.md'den alınan hazır programlar
- **Custom Workouts**: Kendi programını oluştur
- **Real-time Tracking**: Set/reps/weight/süre takibi
- **Progress Analytics**: Chart'larla ilerleme görselleştirme
- **Achievement System**: Motivation için badge'ler

## 🛠️ Teknoloji Yığını

### Core Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI + Custom Components
- **Animations**: Framer Motion

### State & Data Management
- **Global State**: Zustand
- **Server State**: React Query (TanStack Query)  
- **Storage**: localStorage + IndexedDB
- **Validation**: Zod + React Hook Form

### PWA & Performance
- **PWA**: Next.js PWA plugin
- **Charts**: Chart.js + React Chart.js 2
- **Testing**: Jest + Playwright + Testing Library
- **Deployment**: Vercel

## 📱 Platform Desteği

- **Web Browsers**: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **Mobile**: PWA olarak iOS Safari, Android Chrome
- **Desktop**: macOS, Windows, Linux (browser-based)
- **Offline**: Full functionality without internet connection

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak için lütfen [`DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md) dosyasını okuyun.

### Katkı Süreci
1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📊 Proje Durumu

🚀 **Ready to Code** - localStorage-first mimari ile planlama tamamlandı!

### ✅ Tamamlanan Dokümantasyonlar
- ✅ **localStorage-first** teknik mimari tasarımı
- ✅ Next.js 14 + Tailwind CSS UI/UX kılavuzu
- ✅ Detaylı proje görev listesi ve zaman planlaması
- ✅ PWA implementation stratejisi
- ✅ Client-side service architecture

### 🎯 Hemen Başlanabilir
- 🚀 **[PROJECT_TASKS.md](docs/PROJECT_TASKS.md)** - 8 haftalık detaylı task breakdown
- ⚡ **Sprint 1**: Next.js setup (2-3 gün)  
- 🔋 **Sprint 2**: localStorage services + Auth (1 hafta)
- 💪 **Sprint 3**: Workout tracking system (1 hafta)

### 🎁 Bonus: Zero Backend Complexity
- ❌ No database setup required
- ❌ No server configuration  
- ❌ No authentication service
- ✅ Deploy instantly to Vercel
- ✅ Works offline from day one

## 📄 Lisans

Bu proje MIT lisansı altında geliştirilmektedir.

## 📧 İletişim

Proje hakkında sorularınız için GitHub Issues bölümünü kullanabilirsiniz.

---

**Sağlıklı kalın, güçlü olun! 💪**
