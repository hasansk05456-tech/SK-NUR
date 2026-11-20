import express from 'express';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'sknur-store.json');
const SHARED_PUBLIC_URL =
  'https://ais-pre-44jbd5qtkei7m57an74paz-1008180750906.asia-east1.run.app';

let cachedSharedLive: {checkedAt: number; live: boolean} | null = null;

async function isSharedUrlLive(forceFresh = false): Promise<boolean> {
  const now = Date.now();
  if (!forceFresh && cachedSharedLive && now - cachedSharedLive.checkedAt < 20_000) {
    return cachedSharedLive.live;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(SHARED_PUBLIC_URL, {
      method: 'HEAD',
      redirect: 'manual',
      signal: controller.signal,
    });
    clearTimeout(timer);
    const live = res.status !== 404 && res.status < 500;
    cachedSharedLive = {checkedAt: now, live};
    return live;
  } catch {
    cachedSharedLive = {checkedAt: now, live: false};
    return false;
  }
}

function resolvePublicAppUrl(req: express.Request): string {
  const queryUrl = typeof req.query.appUrl === 'string' ? req.query.appUrl.trim() : '';
  if (
    queryUrl.startsWith('https://') &&
    !queryUrl.includes('localhost') &&
    !queryUrl.includes('127.0.0.1')
  ) {
    return queryUrl.replace(/\/+$/, '');
  }

  const envUrl = (process.env.APP_URL || '').trim();
  if (
    envUrl &&
    envUrl !== 'MY_APP_URL' &&
    envUrl.startsWith('http') &&
    !envUrl.includes('localhost') &&
    !envUrl.includes('127.0.0.1')
  ) {
    return envUrl.replace(/\/+$/, '');
  }

  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const rawHost =
    (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
  if (
    rawHost &&
    !rawHost.includes('localhost') &&
    !rawHost.includes('127.0.0.1') &&
    !rawHost.includes('0.0.0.0')
  ) {
    return `${proto}://${rawHost}`.replace(/\/+$/, '');
  }

  return SHARED_PUBLIC_URL;
}

interface StoreRecord {
  [userId: string]: {
    updatedAt: string;
    payload: Record<string, unknown>;
  };
}

function readStore(): StoreRecord {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return {};
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(raw) as StoreRecord;
  } catch {
    return {};
  }
}

function writeStore(store: StoreRecord): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {recursive: true});
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

async function buildAndroidStudioZip(appOrigin: string): Promise<Buffer> {
  const zip = new JSZip();
  const root = zip.folder('SK-NUR-Android-Studio-Project');
  if (!root) {
    throw new Error('Failed to initialize ZIP archive');
  }

  const safeUrl = appOrigin || 'https://sknur.app';

  root.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "SK NUR"
include(":app")
`
  );

  root.file(
    'build.gradle.kts',
    `plugins {
    id("com.android.application") version "8.5.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}
`
  );

  root.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`
  );

  root.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  const appDir = root.folder('app');
  if (appDir) {
    appDir.file(
      'build.gradle.kts',
      `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.sknur.islamicapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.sknur.islamicapp"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        buildConfigField("String", "SKNUR_APP_URL", "\\"${safeUrl}\\"")
    }

    signingConfigs {
        create("release") {
            val keystoreFile = System.getenv("SKNUR_KEYSTORE_FILE")
            if (keystoreFile != null) {
                storeFile = file(keystoreFile)
                storePassword = System.getenv("SKNUR_KEYSTORE_PASSWORD")
                keyAlias = System.getenv("SKNUR_KEY_ALIAS")
                keyPassword = System.getenv("SKNUR_KEY_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            if (System.getenv("SKNUR_KEYSTORE_FILE") != null) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
        debug {
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        buildConfig = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.core:core-splashscreen:1.0.1")
    implementation("androidx.webkit:webkit:1.11.0")
    implementation("com.google.android.material:material:1.12.0")
}
`
    );

    appDir.file(
      'proguard-rules.pro',
      `-keepclassmembers class com.sknur.islamicapp.MainActivity$SkNurBridge {
    @android.webkit.JavascriptInterface <methods>;
}
`
    );

    const mainDir = appDir.folder('src/main');
    if (mainDir) {
      mainDir.file(
        'AndroidManifest.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.SkNur.Splash"
        android:usesCleartextTraffic="false">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:launchMode="singleTop">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`
      );

      mainDir.file(
        'java/com/sknur/islamicapp/MainActivity.kt',
        `package com.sknur.islamicapp

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.View
import android.webkit.GeolocationPermissions
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { _ -> }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)

        window.statusBarColor = android.graphics.Color.parseColor("#064E3B")
        window.navigationBarColor = android.graphics.Color.parseColor("#042F24")

        webView = WebView(this).apply {
            layoutParams = android.view.ViewGroup.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT
            )
            overScrollMode = View.OVER_SCROLL_NEVER
        }
        setContentView(webView)

        requestRuntimePermissions()

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
            setGeolocationEnabled(true)
        }

        webView.addJavascriptInterface(SkNurBridge(this), "SkNurAndroid")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                return false
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                if (request?.isForMainFrame == true) {
                    view?.loadUrl("file:///android_asset/offline.html")
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onGeolocationPermissionsShowPrompt(
                origin: String?,
                callback: GeolocationPermissions.Callback?
            ) {
                callback?.invoke(origin, true, false)
            }
        }

        webView.loadUrl(BuildConfig.SKNUR_APP_URL)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }

    private fun requestRuntimePermissions() {
        val needed = mutableListOf<String>()
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            needed.add(Manifest.permission.ACCESS_FINE_LOCATION)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            needed.add(Manifest.permission.POST_NOTIFICATIONS)
        }
        if (needed.isNotEmpty()) {
            permissionLauncher.launch(needed.toTypedArray())
        }
    }

    class SkNurBridge(private val context: Context) {
        @JavascriptInterface
        fun vibrate(ms: Long) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vm = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vm.defaultVibrator.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                val v = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    v.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE))
                } else {
                    @Suppress("DEPRECATION")
                    v.vibrate(ms)
                }
            }
        }
    }
}
`
      );

      mainDir.file(
        'res/values/strings.xml',
        `<resources>
    <string name="app_name">SK NUR</string>
</resources>
`
      );

      mainDir.file(
        'res/values/colors.xml',
        `<resources>
    <color name="sk_emerald">#064E3B</color>
    <color name="sk_emerald_deep">#042F24</color>
    <color name="sk_gold">#D4AF37</color>
    <color name="sk_white">#FFFFFF</color>
</resources>
`
      );

      mainDir.file(
        'res/values/themes.xml',
        `<resources>
    <style name="Theme.SkNur.Splash" parent="Theme.SplashScreen">
        <item name="windowSplashScreenBackground">@color/sk_emerald_deep</item>
        <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher</item>
        <item name="postSplashScreenTheme">@style/Theme.SkNur</item>
    </style>

    <style name="Theme.SkNur" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">@color/sk_emerald</item>
        <item name="colorSecondary">@color/sk_gold</item>
        <item name="android:statusBarColor">@color/sk_emerald</item>
    </style>
</resources>
`
      );

      const publicIcon512 = path.resolve(__dirname, 'public', 'pwa-512x512.png');
      const publicIcon192 = path.resolve(__dirname, 'public', 'pwa-192x192.png');
      if (fs.existsSync(publicIcon512)) {
        mainDir.file('res/mipmap-xxxhdpi/ic_launcher.png', fs.readFileSync(publicIcon512));
        mainDir.file('res/mipmap-xxhdpi/ic_launcher.png', fs.readFileSync(publicIcon512));
      }
      if (fs.existsSync(publicIcon192)) {
        mainDir.file('res/mipmap-xhdpi/ic_launcher.png', fs.readFileSync(publicIcon192));
        mainDir.file('res/mipmap-hdpi/ic_launcher.png', fs.readFileSync(publicIcon192));
      }

      mainDir.file(
        'assets/offline.html',
        `<!doctype html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>SK NUR — অফলাইন মোড</title>
  <style>
    body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#042F24;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center}
    .card{max-width:420px;width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(212,175,55,.4);border-radius:24px;padding:28px}
    h1{margin:0 0 8px;color:#F5E6BE;font-size:28px}
    p{font-size:14px;line-height:1.6;color:#d1fae5;margin:0 0 18px}
    .tasbih{background:rgba(0,0,0,.3);border-radius:16px;padding:16px;margin-bottom:18px}
    .cnt{font-size:36px;font-weight:700;color:#D4AF37;margin:6px 0}
    button{width:100%;padding:14px;border:0;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;margin-top:8px}
    .primary{background:#D4AF37;color:#042F24}
    .secondary{background:#065f46;color:#fff}
  </style>
</head>
<body>
  <div class="card">
    <h1>SK NUR</h1>
    <p>ইন্টারনেট সংযোগ নেই। অফলাইন তসবি ব্যবহার করুন অথবা সংযোগ চালু হলে পুনরায় চেষ্টা করুন।</p>
    <div class="tasbih">
      <div>সুবহানাল্লাহ · আলহামদুলিল্লাহ · আল্লাহু আকবার</div>
      <div class="cnt" id="c">0</div>
      <button class="primary" onclick="document.getElementById('c').innerText=++n">তসবি গণনা (+1)</button>
    </div>
    <button class="secondary" onclick="location.href='${safeUrl}'">পুনরায় অ্যাপ চালু করুন</button>
  </div>
  <script>var n=0;</script>
</body>
</html>`
      );
    }
  }

  root.file(
    '.github/workflows/build-apk.yml',
    `name: Build SK NUR APK & AAB

on:
  workflow_dispatch:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3
      - name: Build Debug & Release APK + AAB
        run: |
          gradle assembleRelease bundleRelease
      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: SK-NUR-APK-AAB
          path: |
            app/build/outputs/apk/release/*.apk
            app/build/outputs/bundle/release/*.aab
`
  );

  root.file(
    'README_BENGALI.md',
    `# SK NUR Android Studio ও APK তৈরি নির্দেশিকা (বাংলায়)

প্যাকেজ আইডি: \`com.sknur.islamicapp\`
অ্যাপের নাম: \`SK NUR\`

## পদ্ধতি ১: Android Studio ব্যবহার করে APK এবং AAB তৈরি
1. \`SK-NUR-Android-Studio-Project.zip\` ফাইলটি আনজিপ (Unzip) করুন।
2. Android Studio ওপেন করে **Open** -> এই ফোল্ডারটি সিলেক্ট করুন।
3. Gradle Sync সম্পূর্ণ হলে উপরের মেনু থেকে **Build > Generate Signed Bundle / APK** সিলেক্ট করুন।
4. **APK** (সরাসরি ফোনে ইনস্টলের জন্য) অথবা **Android App Bundle (AAB)** (Google Play Store-এর জন্য) সিলেক্ট করুন।
5. নতুন Keystore তৈরি করে **Release** মোডে বিল্ড করুন।
6. \`app/release/app-release.apk\` ফাইলটি \`SK-NUR.apk\` নামে সেভ করুন এবং Android ফোনে ইনস্টল করুন।

## পদ্ধতি ২: GitHub Actions দিয়ে অটোমেটিক APK তৈরি (পিসি ছাড়া)
1. GitHub-এ একটি নতুন Repository তৈরি করে এই ফোল্ডারের সব ফাইল আপলোড করুন।
2. **Actions** ট্যাবে গিয়ে **Build SK NUR APK & AAB** রান করুন।
3. ২-৩ মিনিটের মধ্যে \`SK-NUR-APK-AAB\` নামে APK ও AAB ডাউনলোড লিংক পাবেন।

## Google Drive-এ আপলোড ও শেয়ার করার নিয়ম
1. SK NUR অ্যাপের **More > Android APK & Drive** পেজ থেকে এক ক্লিকেই প্রজেক্ট বা লোগো Google Drive-এ আপলোড করতে পারবেন।
2. অথবা ফোনে/পিসিতে তৈরি হওয়া \`SK-NUR.apk\` ফাইলটি Google Drive-এ আপলোড করে **Share > Anyone with the link > Viewer** সেট করে লিংক কপি করুন।
`
  );

  return zip.generateAsync({type: 'nodebuffer', compression: 'DEFLATE'});
}

async function startServer() {
  const app = express();
  app.use(express.json({limit: '2mb'}));

  app.get('/api/health', (_req, res) => {
    res.json({status: 'ok', app: 'SK NUR', packageId: 'com.sknur.islamicapp'});
  });

  app.get('/api/sync/:userId', (req, res) => {
    const userId = req.params.userId.replace(/[^a-zA-Z0-9_@.-]/g, '');
    const store = readStore();
    const record = store[userId];
    if (!record) {
      res.status(404).json({error: 'No backup found'});
      return;
    }
    res.json(record);
  });

  app.post('/api/sync/:userId', (req, res) => {
    const userId = req.params.userId.replace(/[^a-zA-Z0-9_@.-]/g, '');
    if (!userId) {
      res.status(400).json({error: 'Invalid user identifier'});
      return;
    }
    const store = readStore();
    store[userId] = {
      updatedAt: new Date().toISOString(),
      payload: req.body as Record<string, unknown>,
    };
    writeStore(store);
    res.json({ok: true, updatedAt: store[userId].updatedAt});
  });

  app.get('/api/install-info', async (req, res) => {
    const appUrl = resolvePublicAppUrl(req);
    const forceFresh = req.query.fresh === '1';
    const sharedLive = await isSharedUrlLive(forceFresh);
    const publicOrCurrent = sharedLive ? SHARED_PUBLIC_URL : appUrl;
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      appName: 'SK NUR',
      packageId: 'com.sknur.islamicapp',
      appUrl,
      sharedUrl: SHARED_PUBLIC_URL,
      sharedUrlLive: sharedLive,
      pwabuilderUrl: `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(publicOrCurrent)}`,
      androidZipUrl: `/api/download/android-project.zip?appUrl=${encodeURIComponent(publicOrCurrent)}`,
      logoUrl: '/api/download/sk-nur-logo.png',
    });
  });

  app.get('/api/download/android-project.zip', async (req, res) => {
    try {
      const origin = resolvePublicAppUrl(req);
      const zipBuffer = await buildAndroidStudioZip(origin);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="SK-NUR-Android-Studio-Project.zip"');
      res.setHeader('Cache-Control', 'no-store');
      res.send(zipBuffer);
    } catch (err) {
      console.error('Failed to build Android project zip:', err);
      res.status(500).json({error: 'Failed to generate Android Studio project archive'});
    }
  });

  app.get('/api/download/sk-nur-logo.png', (_req, res) => {
    const logoPath = path.resolve(__dirname, 'public', 'sk-nur-logo.png');
    if (!fs.existsSync(logoPath)) {
      res.status(404).json({error: 'Logo not found'});
      return;
    }
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="SK-NUR-Logo.png"');
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(logoPath);
  });

  if (process.env.NODE_ENV !== 'production') {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SK NUR server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failure:', err);
  process.exit(1);
});
