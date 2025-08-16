# 👥 Kullanıcı Hikayeleri ve Gereksinimler

## 🎭 Kullanıcı Profilleri (User Personas)

### Persona 1: Yeni Başlayan Ahmet
**Demografik Bilgiler:**
- Yaş: 28, Yazılım Geliştiricisi
- Teknoloji kullanımı: İleri seviye
- Fitness deneyimi: Başlangıç seviyesi
- Hedefler: Sağlık için düzenli spor yapmak, kilo vermek

**Motivasyonlar:**
- Masa başı işi nedeniyle hareketsiz kalıyor
- Basit ve anlaşılır program istiyor
- İlerlemeyi görsel olarak takip etmek istiyor
- Fazla zaman ayıramıyor (30-45 dakika max)

**Teknoloji Alışkanlıkları:**
- Akıllı telefonu yoğun kullanıyor
- Fitness uygulamaları denemiş ama karmaşık bulmuş
- Sosyal medyada aktif değil

### Persona 2: Deneyimli Spor Sevdalısı Zeynep
**Demografik Bilgiler:**
- Yaş: 35, Pazarlama Müdürü
- Teknoloji kullanımı: Orta-ileri seviye
- Fitness deneyimi: 5+ yıl
- Hedefler: Kas kütlesi artırmak, güçlenmek

**Motivasyonlar:**
- Düzenli spor yapıyor ama takibini geliştirmek istiyor
- Detaylı analitik ve ilerleme raporu arıyor
- Kendi programını özelleştirebilmek istiyor
- Performans metriklerini takip etmek önemli

**Teknoloji Alışkanlıkları:**
- Wearable device kullanıyor
- Birden çok fitness uygulaması denemiş
- Sosyal paylaşım yapmaya açık

### Persona 3: Zaman Kısıtlı Anne Elif
**Demografik Bilgiler:**
- Yaş: 32, 2 çocuk annesi, Part-time çalışan
- Teknoloji kullanımı: Orta seviye
- Fitness deneyimi: Ara seviye (geçmişte aktif)
- Hedefler: Doğum sonrası forma dönmek, enerji seviyesini artırmak

**Motivasyonlar:**
- Çok az zamanı var (15-20 dakika)
- Ev ortamında egzersiz yapma tercihi
- Motivasyon desteği gerekiyor
- Çocuk bakımı süresince fitness yapmak istiyor

**Teknoloji Alışkanlıkları:**
- Telefonu pratik amaçlarla kullanıyor
- Basitlik önceliği
- Video rehberleri tercih ediyor

## 📱 Kullanıcı Hikayeleri (User Stories)

### Epic 1: Kullanıcı Yönetimi ve Onboarding

#### Story 1.1: Hesap Oluşturma
**Kullanıcı Hikayes:** Yeni bir kullanıcı olarak, hızla kayıt olup uygulamayı kullanmaya başlayabilmek istiyorum.

**Acceptance Criteria:**
- [ ] Email ve şifre ile kayıt olabilmeliyim
- [ ] Google/Apple ile hızlı kayıt seçeneği olmalı
- [ ] Şifre güvenlik gereksinimlerini karşılamalı (min 8 karakter, büyük/küçük harf, sayı)
- [ ] Email doğrulama gönderilmeli
- [ ] Hata durumlarında anlaşılır mesajlar gösterilmeli

**Teknik Gereksinimler:**
- Zod validation ile input kontrolü
- bcrypt ile şifre hashleme
- JWT token based authentication
- Rate limiting (5 attempt/hour)

#### Story 1.2: Profil Oluşturma ve Hedef Belirleme
**Kullanıcı Hikayes:** Yeni kullanıcı olarak, fitness seviyeme ve hedeflerime uygun program önerileri alabilmek için profilimi oluşturmak istiyorum.

**Acceptance Criteria:**
- [ ] Yaş, cinsiyet, kilo, boy bilgilerini girebilmeliyim
- [ ] Fitness deneyim seviyemi seçebilmeliyim (Başlangıç/Orta/İleri)
- [ ] Ana hedefimi belirtebilmeliyim (Kilo verme/Kas yapımı/Dayanıklılık)
- [ ] Haftada kaç gün spor yapabileceğimi belirtebilmeliyim
- [ ] Günlük ne kadar zamanım olduğunu girebilmeliyim
- [ ] Bu bilgilere göre kişiselleştirilmiş program önerisi alabilmeliyim

### Epic 2: Egzersiz Programları ve Takip

#### Story 2.1: Program Seçimi ve Başlatma
**Kullanıcı Hikayes:** Kullanıcı olarak, seviyeme uygun egzersiz programını seçip günlük antrenmanlarımı takip etmek istiyorum.

**Acceptance Criteria:**
- [ ] Mevcut programları filtreleyerek görüntüleyebilmeliyim
- [ ] Program detaylarını (süre, zorluk, egzersizler) inceleyebilmeliyim
- [ ] Bir programı aktif programa ayarlayabilmeliyim
- [ ] Günlük plan görünümünde bugünkü egzersizlerimi görebilmeliyim
- [ ] Egzersiz yapma hazır olduğumda "Antrenmana Başla" diyebilmeliyim

**UI/UX Gereksinimleri:**
- Kart tabanlı program listesi
- Filtreleme seçenekleri (süre, zorluk, tür)
- Preview modal ile program detayları
- Clear CTA button'ları

#### Story 2.2: Egzersiz Yapma ve Kaydetme
**Kullanıcı Hikayes:** Antrenman sırasında, her egzersizi takip edip setlerimi ve tekrar sayılarımı kaydedebilmek istiyorum.

**Acceptance Criteria:**
- [ ] Mevcut egzersizi görsel rehber ile görebilmeliyim
- [ ] Set ve tekrar sayısını kolayca girebilmeliyim
- [ ] Timer ile dinlenme sürelerini takip edebilmeliyim
- [ ] Ağırlık bilgisini girebilmeliyim (varsa)
- [ ] Egzersizi tamamladığımda bir sonrakine geçebilmeliyim
- [ ] Antrenmanı yarıda bırakırsam durumu kaydedebilmeli
- [ ] Tüm antreman bittiğinde özet görebilmeliyim

**Interaction Design:**
- Büyük, kolay basılabilir sayı girişi
- Swipe gestures ile egzersiz geçişi
- Haptic feedback ile başarı hissi
- Audio cues für timer

#### Story 2.3: İlerleme Takibi
**Kullanıcı Hikayes:** Kullanıcı olarak, zamanla ne kadar geliştiğimi görsel grafikler ve istatistiklerle takip etmek istiyorum.

**Acceptance Criteria:**
- [ ] Haftalık/aylık antrenman frekansımı görebilmeliyim
- [ ] Toplam antrenman süresini ve yakılan kalorileri görebilmeliyim
- [ ] Egzersiz başına performans gelişimini (ağırlık, tekrar) grafikle görebilmeliyim
- [ ] Hedeflerime ne kadar yaklaştığımı progress bar ile görebilmeliyim
- [ ] Vücut ölçümlerimi (kilo, vücut yağ oranı) girebilmeliyim
- [ ] Fotoğraf karşılaştırması yapabilmeliyim

### Epic 3: Sosyal Özellikler ve Motivasyon

#### Story 3.1: Başarı Rozetleri ve Milestone'lar
**Kullanıcı Hikayes:** Kullanıcı olarak, hedeflere ulaştığımda ödüllendirilmek ve motive olmak istiyorum.

**Acceptance Criteria:**
- [ ] İlk antrenmanımı tamamladığımda rozet kazanabilmeliyim
- [ ] Ardışık günlerde antrenman yapınca streak rozeti alabilmeliyim
- [ ] Belirli milestone'lara (10/50/100 antrenman) ulaşınca özel rozet alabilmeliyim
- [ ] Rozetlerimi profil sayfamda görüntüleyebilmeliyim
- [ ] Rozet kazandığımda push notification alabilmeliyim

#### Story 3.2: Arkadaş Sistemi (Faz 2)
**Kullanıcı Hikayes:** Kullanıcı olarak, arkadaşlarımla birlikte motivasyonumu artırmak ve yarışabilmek istiyorum.

**Acceptance Criteria:**
- [ ] Kullanıcı adı ile arkadaş arayabilmeliyim
- [ ] Arkadaş ekleyebilmeli, onaylatabilmeliyim
- [ ] Arkadaşlarımın haftalık aktivitelerini görebilmeliyim
- [ ] İlerleme bildirmelerimi arkadaşlarımla paylaşabilmeliyim
- [ ] Privacy ayarları ile görünürlüğümü kontrol edebilmeliyim

### Epic 4: Kişiselleştirme ve Ayarlar

#### Story 4.1: Bildirim Yönetimi
**Kullanıcı Hikayes:** Kullanıcı olarak, antrenman hatırlatmalarımı ve bildirimlerimi kişisel tercihlerime göre ayarlamak istiyorum.

**Acceptance Criteria:**
- [ ] Antrenman zamanı hatırlatmalarını açıp kapayabilmeliyim
- [ ] Hangi günlerde bildirim almak istediğimi seçebilmeliyim
- [ ] Bildirim saatini ayarlayabilmeliyim
- [ ] Haftalık özet raporu bildirimini açıp kapayabilmeliyim
- [ ] Başarı bildirimleri için seçeneklerimi ayarlayabilmeliyim

#### Story 4.2: Program Özelleştirme
**Kullanıcı Hikayes:** Deneyimli kullanıcı olarak, kendi programımı oluşturmak veya mevcut programları değiştirmek istiyorum.

**Acceptance Criteria:**
- [ ] Sıfırdan yeni program oluşturabilmeliyim
- [ ] Mevcut programı kopyalayıp düzenleyebilmeliyim
- [ ] Egzersiz ekleyip çıkarabilmeliyim
- [ ] Set sayıları ve tekrarları değiştirebilmeliyim
- [ ] Kendi egzersizlerimi tanımlayabilmeliyim
- [ ] Programımı arkadaşlarımla paylaşabilmeliyim

## 📋 Fonksiyonel Gereksinimler

### Kimlik Doğrulama ve Yetkilendirme
- [x] Email/şifre ile kayıt ve giriş
- [x] OAuth ile hızlı giriş (Google, Apple)
- [x] Şifre sıfırlama
- [x] Session yönetimi
- [x] Multi-device login

### Program Yönetimi
- [x] Öntanımlı egzersiz programları
- [x] Program kategorizasyonu (güç, kardiyo, esnek, karma)
- [x] Zorluk seviyesi filtreleme
- [x] Kişiselleştirilmiş program önerileri
- [x] Custom program oluşturma

### Egzersiz Takibi
- [x] Real-time set/tekrar takibi
- [x] Timer ve rest period tracking
- [x] Ağırlık kaydı
- [x] Egzersiz notları
- [x] Progress foto çekimi
- [x] Workout session summary

### Analitik ve Raporlama
- [x] Workout frequency tracking
- [x] Volume progression (sets × reps × weight)
- [x] Kalori yakma tahmini
- [x] Vücut ölçümü takibi
- [x] Export data capability

### Offline Functionality
- [x] Offline workout logging
- [x] Sync when online
- [x] Cached workout programs
- [x] Local data storage

## ⚡ Performans Gereksinimleri

### Response Times
- **App Launch**: ≤ 2 saniye (cold start)
- **Screen Transitions**: ≤ 300ms
- **Data Loading**: ≤ 1 saniye
- **Sync Operations**: ≤ 5 saniye

### Availability
- **Uptime**: %99.5 (yearly)
- **Offline Functionality**: %100 core features
- **Data Sync**: ≤ 30 saniye after connectivity

### Scalability
- **Concurrent Users**: 1,000+ simultaneous
- **Database Response**: ≤ 100ms average query time
- **Storage**: Unlimited user data with archiving
- **CDN Performance**: ≤ 50ms image load time

## 🔒 Güvenlik Gereksinimleri

### Data Protection
- [x] GDPR compliance
- [x] Data encryption at rest and in transit
- [x] Personal data anonymization
- [x] Right to data deletion
- [x] Data breach notification < 72 hours

### Authentication Security
- [x] Password hashing (bcrypt, salt rounds ≥ 12)
- [x] JWT token expiration (15 min access, 7 day refresh)
- [x] Rate limiting (login attempts, API calls)
- [x] Account lockout after failed attempts
- [x] Two-factor authentication (optional)

### API Security
- [x] Input validation and sanitization
- [x] SQL injection protection
- [x] XSS protection
- [x] CSRF tokens
- [x] API versioning and deprecation

## 📱 Platform Gereksinimleri

### Mobile Support
- **iOS**: 14.0+ (iPhone 8 ve üzeri)
- **Android**: API 26+ (Android 8.0+)
- **RAM**: Minimum 2GB
- **Storage**: 100MB initial, 1GB max data

### Web Support (PWA)
- **Browsers**: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **Responsive**: 320px - 1920px width
- **Offline**: Service Worker support
- **Performance**: Lighthouse score ≥ 90

## 🌐 Accessibility Gereksinimleri

### WCAG 2.1 AA Compliance
- [x] Screen reader support
- [x] Keyboard navigation
- [x] Color contrast ≥ 4.5:1
- [x] Focus indicators
- [x] Alt text for images

### Inclusive Design
- [x] Font size options
- [x] Reduced motion support
- [x] High contrast mode
- [x] Multi-language support (TR, EN başlangıç)
- [x] Voice control compatibility

## 📊 Analytics ve Monitoring

### User Behavior Tracking
- [x] Screen view events
- [x] Feature usage statistics
- [x] Workout completion rates
- [x] User retention metrics
- [x] Performance bottlenecks

### Privacy-First Analytics
- [x] Anonymous usage tracking
- [x] Opt-out mechanisms
- [x] No personal data in analytics
- [x] GDPR compliant data collection
- [x] Data retention policies

## 🔄 Integration Gereksinimleri

### Health Platforms
- [ ] Apple HealthKit integration
- [ ] Google Fit integration
- [ ] Samsung Health support
- [ ] Fitbit data sync

### Third-Party Services
- [x] Push notification service (Expo)
- [x] Cloud storage (AWS S3/Cloudinary)
- [x] Email service (SendGrid)
- [x] Analytics (Privacy-focused)
- [x] Error tracking (Sentry)

---

## ✅ Acceptance Testing Scenarios

### Scenario 1: Yeni Kullanıcı Onboarding
```gherkin
Given I am a new user who downloads the app
When I open the app for the first time
Then I should see a welcoming onboarding flow
And I should be able to create an account in under 2 minutes
And I should be able to set up my profile and goals
And I should receive a personalized workout program
And I should be able to start my first workout immediately
```

### Scenario 2: Günlük Workout Completion
```gherkin
Given I am a registered user with an active program
When I start today's workout
Then I should see the exercise list with visual guides
And I should be able to log sets and reps easily
And I should receive rest period notifications
And I should be able to complete the workout in expected time
And I should see a completion summary with progress update
```

### Scenario 3: Progress Tracking
```gherkin
Given I have completed workouts for 2 weeks
When I visit the Progress tab
Then I should see my workout frequency chart
And I should see improvements in exercise performance
And I should see overall fitness progress indicators
And I should be able to add body measurements
And I should receive motivational feedback based on progress
```

---

*Bu gereksinimler belgesi, ürün geliştirme sürecinde rehber olarak kullanılacak ve kullanıcı geri bildirimlerine göre güncellenecektir.*
