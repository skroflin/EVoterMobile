# EVoterMobile

## Opis projekta

**EVoterMobile** je mobilna aplikacija razvijena u tehnologiji **React Native** koja omogućuje sigurno i fleksibilno elektroničko glasovanje. Aplikacija je razvijena s ciljem poboljšanja dostupnosti, jednostavnosti i korisničkog iskustva pri korištenju sustava za elektroničko glasovanje na mobilnim uređajima.

---

## Preduvjeti

### Obavezni uvjeti

Za razvoj i pokretanje aplikacije potrebno je imati instalirano sljedeće:

* **Node.js** verzije 22.11.0 ili novije
* **npm** ili **Yarn** upravitelj paketima
* **Java Development Kit (JDK)** verzije 11 ili novije
* **Android SDK** za razvoj Android aplikacije
* **Android Emulator** ili fizički Android uređaj

---

## Instalacija Android emulatora

### 1. Instalacija Android Studija

1. Preuzmite **Android Studio** sa službene stranice: [developer.android.com](https://developer.android.com/studio)
2. Instalirajte Android Studio prema uputama za svoj operacijski sustav.
3. Pokrenite Android Studio i dovršite početno postavljanje razvojne okoline.

### 2. Instalacija Android SDK-a

1. Otvorite **Android Studio**.
2. Otvorite **Tools → SDK Manager**.
3. Na kartici **SDK Platforms** odaberite najmanje **Android 13 (API Level 33)** ili noviju verziju.
4. Na kartici **SDK Tools** provjerite jesu li instalirani:

   * **Android Emulator**
   * **Android SDK Platform-Tools**
   * **Android SDK Build-Tools**
5. Kliknite **Apply**, zatim **OK** i pričekajte da se instalacija dovrši.

### 3. Kreiranje virtualnog uređaja (AVD)

1. U Android Studiju otvorite **Tools → Device Manager** (u starijim verzijama **AVD Manager**).
2. Kliknite **+ Create Device**.
3. Odaberite željeni model uređaja. Preporučuje se **Pixel 6** ili noviji uređaj.
4. Kliknite **Next**.
5. Odaberite **Android 13** ili noviju verziju sustava.
6. Kliknite **Next** i dovršite postavljanje koristeći zadane postavke.
7. Nakon dovršetka virtualni uređaj bit će dostupan u **Device Manageru**.

### 4. Pokretanje emulatora

Emulator možete pokrenuti iz terminala:

```bash
# Prikaz dostupnih AVD uređaja
emulator -list-avds

# Pokretanje emulatora
emulator -avd <AVD_IME>
```

Emulator možete pokrenuti i izravno u Android Studiju klikom na gumb **Play** uz željeni virtualni uređaj.

---

## Instalacija i pokretanje projekta

### 1. Kloniranje i otvaranje projekta

Klonirajte repozitorij te se pozicionirajte u direktorij projekta:

```bash
cd c:\Users\Korisnik\Documents\GitHub\EVoterMobile
```

> Putanju prilagodite lokaciji na kojoj se projekt nalazi na vašem računalu.

### 2. Instalacija ovisnosti

Instalirajte sve potrebne ovisnosti projekta pomoću **npm-a** ili **Yarn-a**:

```bash
npm install
```

ili:

```bash
yarn install
```

### 3. Pokretanje Metro Bundlera

Pokrenite **Metro Bundler**:

```bash
npm start
```

ili:

```bash
yarn start
```

Ostavite ovaj terminal otvoren tijekom razvoja aplikacije.

### 4. Pokretanje aplikacije na Androidu

U novom terminalskom prozoru pokrenite:

```bash
npm run android
```

ili:

```bash
yarn android
```

Aplikacija će se automatski izgraditi i pokrenuti na pokrenutom Android emulatoru ili povezanom fizičkom uređaju.

---

## Ovisnosti projekta

### Glavne ovisnosti (Production)

| Paket                                       | Verzija | Namjena                                 |
| ------------------------------------------- | ------: | --------------------------------------- |
| `react`                                     |  19.2.3 | Osnovna React biblioteka                |
| `react-native`                              |  0.86.2 | Okvir za razvoj mobilnih aplikacija     |
| `@react-navigation/native`                  |  7.3.14 | Navigacija unutar aplikacije            |
| `@react-navigation/bottom-tabs`             | 7.18.14 | Navigacija pomoću donjih kartica        |
| `@react-navigation/native-stack`            |  7.18.6 | Stack navigacija                        |
| `axios`                                     |  1.19.0 | HTTP klijent za API pozive              |
| `@tanstack/react-query`                     | 5.101.4 | Upravljanje i dohvatom podataka         |
| `zustand`                                   |  5.0.14 | Upravljanje stanjem aplikacije          |
| `react-hook-form`                           |  7.84.0 | Upravljanje obrascima                   |
| `@hookform/resolvers`                       |   5.7.1 | Integracija validacije obrazaca         |
| `zod`                                       |   4.4.3 | Definiranje i validacija shema          |
| `@react-native-async-storage/async-storage` |   3.1.1 | Lokalno pohranjivanje podataka          |
| `react-native-keychain`                     |  10.0.0 | Sigurno pohranjivanje vjerodajnica      |
| `@react-native-clipboard/clipboard`         |  1.16.3 | Rad sa sadržajem međuspremnika          |
| `@react-native-community/datetimepicker`    |   9.1.0 | Odabir datuma i vremena                 |
| `dayjs`                                     | 1.11.21 | Rad s datumima i vremenom               |
| `react-native-safe-area-context`            |   5.8.0 | Upravljanje sigurnim područjima zaslona |
| `react-native-screens`                      |  4.26.2 | Native komponente za zaslone            |
| `react-native-svg`                          | 15.15.5 | Podrška za SVG                          |
| `react-native-toast-message`                |   2.4.0 | Prikaz toast obavijesti                 |
| `react-native-vector-icons`                 |  10.3.0 | Ikone                                   |
| `lucide-react-native`                       |  1.33.0 | Lucide ikone za React Native            |
| `@ant-design/react-native`                  |   5.4.3 | Ant Design komponente za React Native   |
| `@react-native/new-app-screen`              |  0.86.2 | Komponenta početnog zaslona aplikacije  |

### Razvojne ovisnosti (DevDependencies)

| Paket                                           | Verzija | Namjena                                      |
| ----------------------------------------------- | ------: | -------------------------------------------- |
| `@babel/core`                                   |  7.25.2 | Babel kompajler                              |
| `@babel/preset-env`                             |  7.25.3 | Babel preset za moderne značajke JavaScripta |
| `@babel/runtime`                                |  7.25.0 | Babel runtime                                |
| `@babel/plugin-transform-export-namespace-from` |  7.29.7 | Babel dodatak za transformaciju izvoza       |
| `@react-native/babel-preset`                    |  0.86.2 | Babel preset za React Native                 |
| `@react-native-community/cli`                   |  20.1.0 | React Native CLI                             |
| `@react-native-community/cli-platform-android`  |  20.1.0 | Android platforma za React Native CLI        |
| `@react-native-community/cli-platform-ios`      |  20.1.0 | iOS platforma za React Native CLI            |
| `@react-native/metro-config`                    |  0.86.2 | Konfiguracija Metro Bundlera                 |
| `@react-native/eslint-config`                   |  0.86.2 | ESLint konfiguracija za React Native         |
| `@react-native/jest-preset`                     |  0.86.2 | Jest preset za React Native                  |
| `@react-native/typescript-config`               |  0.86.2 | TypeScript konfiguracija za React Native     |
| `typescript`                                    |   5.8.3 | TypeScript kompajler                         |
| `eslint`                                        |  8.19.0 | Alat za statičku analizu koda                |
| `jest`                                          |  29.6.3 | Okvir za testiranje                          |
| `prettier`                                      |   2.8.8 | Alat za automatsko formatiranje koda         |
| `@types/react`                                  |  19.2.0 | TypeScript tipovi za React                   |
| `@types/jest`                                   | 29.5.13 | TypeScript tipovi za Jest                    |
| `@types/react-test-renderer`                    |  19.1.0 | TypeScript tipovi za React Test Renderer     |
| `react-test-renderer`                           |  19.2.3 | Testiranje React komponenti                  |

---

## Dostupne npm skripte

Sljedeće skripte dostupne su u projektu:

```bash
# Pokretanje aplikacije na Androidu
npm run android

# Pokretanje aplikacije na iOS-u (samo macOS)
npm run ios

# Pokretanje Metro Bundlera
npm start

# Pokretanje ESLint provjere
npm run lint

# Pokretanje testova
npm test
```

Ako koristite **Yarn**, odgovarajuće naredbe mogu se pokretati pomoću `yarn` umjesto `npm`.

---

## Struktura projekta

```text
src/
├── api/                # API pozivi i Axios konfiguracija
├── components/         # Ponovno upotrebljive React Native komponente
├── hooks/              # Prilagođeni React hookovi
├── navigation/         # Navigacijske strukture
├── screens/            # Zasloni aplikacije (auth, elections, votes, profile, admin)
├── store/              # Upravljanje stanjem pomoću Zustand-a
├── types/              # TypeScript tipske definicije
└── utils/              # Pomoćne funkcije i alati
```

---

## Otklanjanje poteškoća

### Emulator se ne pokreće

Provjerite dostupne AVD uređaje:

```bash
emulator -list-avds
```

Ako je potrebno, emulator pokrenite s dodatnim zapisima za dijagnostiku:

```bash
emulator -avd <AVD_IME> -verbose
```

### Metro Bundler nije dostupan

Ako Metro Bundler ne radi ispravno, pokušajte ponovno instalirati ovisnosti:

```bash
rm -r node_modules
npm install
```

Nakon toga ponovno pokrenite Metro Bundler:

```bash
npm start
```

> Na Windowsu, ako naredba `rm -r node_modules` nije dostupna, direktorij `node_modules` možete obrisati ručno ili upotrijebiti odgovarajuću PowerShell naredbu.

### Pogreške pri izgradnji Android aplikacije

Očistite Android build:

```bash
cd android
./gradlew clean
cd ..
```

Nakon toga ponovno pokrenite aplikaciju:

```bash
npm run android
```

### Pogreške povezane s dozvolama na Windowsu

Ako se tijekom instalacije ovisnosti ili izgradnje aplikacije pojave pogreške povezane s dozvolama, pokušajte pokrenuti **PowerShell** ili **Command Prompt** s administratorskim ovlastima:

```powershell
npm install
npm run android
```

---

## Zahtjevi sustava

### Preporučene specifikacije

* **RAM:** najmanje 8 GB; preporučuje se 16 GB ili više za ugodan rad s Android emulatorom
* **Diskovni prostor:** približno 15–20 GB za Android SDK, emulator i projekt
* **CPU:** višejezgreni procesor (Intel ili AMD)
* **Mrežna veza:** potrebna za preuzimanje Android SDK komponenti, ovisnosti i drugih potrebnih alata

### Podržana razvojna okruženja

* **Windows 10/11** s PowerShellom ili Command Promptom
* **macOS 11+**
* **Linux** (Ubuntu 20.04+)

---

## Kontakt i dokumentacija

Za dodatne informacije i službenu dokumentaciju pogledajte:

* [React Native dokumentacija](https://reactnative.dev/)
* [React Navigation dokumentacija](https://reactnavigation.org/)
* [Android Studio dokumentacija](https://developer.android.com/docs)
