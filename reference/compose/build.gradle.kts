plugins {
  id("com.android.library") version "8.12.0"
  id("org.jetbrains.kotlin.android") version "2.2.20"
  id("org.jetbrains.kotlin.plugin.compose") version "2.2.20"
  id("app.cash.paparazzi") version "2.0.0-alpha05.1"
}

android {
  namespace = "dev.expressive.reference"
  compileSdk = 36
  defaultConfig { minSdk = 24 }
  buildFeatures { compose = true }
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
}

kotlin { jvmToolchain(17) }

dependencies {
  // Keep in step with tools/tokens/generate.ts: CMP material3 1.9.0 is built from androidx material3 1.4.0.
  implementation("androidx.compose.material3:material3:1.4.0")
  testImplementation("junit:junit:4.13.2")
}
