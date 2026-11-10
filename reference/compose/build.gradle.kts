plugins {
  id("com.android.library") version "8.13.2"
  id("org.jetbrains.kotlin.android") version "2.3.0"
  id("org.jetbrains.kotlin.plugin.compose") version "2.3.0"
  id("app.cash.paparazzi") version "2.0.0-alpha05"
}

android {
  namespace = "dev.expressive.reference"
  compileSdk = 36
  defaultConfig { minSdk = 24 }
  buildFeatures { compose = true }
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
  }
}

kotlin { jvmToolchain(21) }

dependencies {
  // Keep in step with tools/tokens/generate.ts: CMP material3 1.11.0-alpha07 is built from androidx material3 1.5.0-alpha17.
  implementation("androidx.compose.material3:material3:1.5.0-alpha17")
  testImplementation("junit:junit:4.13.2")
}

val dumpShapesSources by tasks.registering {
  doLast {
    val id = configurations.getByName("debugRuntimeClasspath").incoming.resolutionResult.allComponents
      .map { it.moduleVersion!! }.first { it.group == "androidx.graphics" && it.name.startsWith("graphics-shapes") }
    val jar = configurations.detachedConfiguration(
      project.dependencies.create("${id.group}:${id.name}:${id.version}:sources")
    ).apply { isTransitive = false }.singleFile
    val out = file("src/test/snapshots/tmp-shapes-src")
    copy { from(zipTree(jar)); into(out) }
    file("src/test/snapshots/tmp-shapes-src/VERSION").writeText("${id.name} ${id.version}\n")
  }
}
tasks.matching { it.name == "recordPaparazziDebug" }.configureEach { dependsOn(dumpShapesSources) }
