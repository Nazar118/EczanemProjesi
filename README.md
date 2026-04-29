\# 🏥 Eczanem Projesi - Full Stack Yönetim Sistemi



Eczanem, bir eczanenin uçtan uca tüm operasyonel süreçlerini dijitalleştirmek için tasarlanmış kapsamlı bir sistemdir. "Monorepo" mimarisiyle inşa edilen bu proje; güçlü bir backend, eczacılar için modern bir web paneli ve son kullanıcılar için bir mobil uygulamadan oluşur.



\## 📸 Ekran Görüntüleri



\### 💻 Web Yönetim Paneli (Eczacı)

!\[Web Panel](images/web.png)



\### 📱 Mobil Uygulama (Kullanıcı)

!\[Mobile App](images/mobile.png)



\## 📁 Proje Katmanları (Monorepo)



\- \*\*`Eczanem/` (Backend):\*\* Sistemin çekirdeği. Veri güvenliği, iş mantığı ve API servisleri burada yönetilir.

\- \*\*`Eczanem.Client/` (Web Panel):\*\* Eczacıların stok, reçete ve sipariş takibini yapabildiği kullanıcı dostu React arayüzü.

\- \*\*`eczanem-mobile/` (Mobil Uygulama):\*\* Kullanıcıların ilaç sorgulayabildiği ve sipariş verebildiği React Native platformu.



\## 🚀 Öne Çıkan Özellikler



\- Merkezi Stok ve Reçete Yönetimi

\- Platformlar arası (Web \& Mobil) eşzamanlı veri senkronizasyonu

\- Rol Bazlı Yetkilendirme (Admin / Eczacı / Kullanıcı)

\- Modern ve Responsive Tasarım (Tailwind CSS)



\## 🛠️ Kullanılan Teknolojiler



\- \*\*Backend:\*\* C#, ASP.NET Core 9, Entity Framework Core, SQL Server

\- \*\*Frontend (Web):\*\* React.js, JavaScript/TypeScript, Tailwind CSS

\- \*\*Mobile:\*\* React Native, TypeScript



\## ⚙️ Kurulum (Geliştiriciler İçin)



Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:



1\. Repoyu klonlayın:

`git clone https://github.com/Nazar118/EczanemProjesi.git`



2\. Backend'i Ayağa Kaldırın (`Eczanem` klasörü):

\- `appsettings.json` içerisinden SQL Server bağlantınızı ayarlayın.

\- `dotnet ef database update` ile veritabanını oluşturun.

\- `dotnet run` ile API'yi başlatın.



3\. Web İstemcisini Başlatın (`Eczanem.Client` klasörü):

\- `npm install` ile bağımlılıkları yükleyin.

\- `npm run dev` ile projeyi çalıştırın.



4\. Mobil Uygulamayı Başlatın (`eczanem-mobile` klasörü):

\- `npm install` ile bağımlılıkları yükleyin.

\- `npx expo start` ile mobil ortamı başlatın.



\## 📌 Notlar

Bu proje modern yazılım mimarileri (Monorepo, REST API) kullanılarak geliştirilmiş kapsamlı bir portfolyo çalışmasıdır.

