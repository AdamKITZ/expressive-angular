package dev.expressive.reference

import androidx.compose.animation.core.AnimationVector1D
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.VectorConverter
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.LoadingIndicatorDefaults
import androidx.graphics.shapes.Cubic
import androidx.graphics.shapes.Morph
import java.io.File
import kotlin.math.max
import kotlin.math.min
import org.junit.Test

/**
 * Records what Compose's indeterminate `LoadingIndicator` draws, for tools/tokens/generate.ts to turn into
 * TypeScript: each morph's matched cubics at progress 0 and 1, the shape scale, and the morph spring sampled per frame
 * until Compose ends it. Mirrors `LoadingIndicatorImpl` and `calculateScaleFactor` in LoadingIndicator.kt.
 */
class LoadingIndicatorMorphsTest {
  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Test
  fun record() {
    val polygons = LoadingIndicatorDefaults.IndeterminateIndicatorPolygons
    val morphs = polygons.indices.map { i ->
      Morph(polygons[i].normalized(), polygons[(i + 1) % polygons.size].normalized())
    }

    var shapeScale = 1f
    for (polygon in polygons) {
      val bounds = polygon.calculateBounds()
      val maxBounds = polygon.calculateMaxBounds()
      val scaleX = (bounds[2] - bounds[0]) / (maxBounds[2] - maxBounds[0])
      val scaleY = (bounds[3] - bounds[1]) / (maxBounds[3] - maxBounds[1])
      shapeScale = min(shapeScale, max(scaleX, scaleY))
    }
    val indicatorScale =
      LoadingIndicatorDefaults.IndicatorSize.value /
        min(LoadingIndicatorDefaults.ContainerWidth.value, LoadingIndicatorDefaults.ContainerHeight.value)

    val spring = spring(dampingRatio = 0.6f, stiffness = 200f, visibilityThreshold = 0.1f)
      .vectorize(Float.VectorConverter)
    val from = AnimationVector1D(0f)
    val to = AnimationVector1D(1f)
    val durationNanos = spring.getDurationNanos(from, to, from)
    val frameNanos = 1_000_000_000L / 60
    val progress = (0..(durationNanos / frameNanos).toInt()).map { frame ->
      spring.getValueFromNanos(frame * frameNanos, from, to, from).value
    } + 1f

    val json = buildString {
      append("{\n")
      append("  \"scale\": ${round(shapeScale * indicatorScale)},\n")
      append("  \"morphDurationMs\": ${durationNanos / 1_000_000},\n")
      append("  \"morphProgress\": [${progress.joinToString(", ") { round(it) }}],\n")
      append("  \"morphs\": [\n")
      append(morphs.joinToString(",\n") { morph ->
        "    { \"start\": ${cubics(morph.asCubics(0f))}, \"end\": ${cubics(morph.asCubics(1f))} }"
      })
      append("\n  ]\n}\n")
    }
    File("src/test/snapshots/loading-indicator.json").writeText(json)
  }

  private fun cubics(cubics: List<Cubic>): String =
    cubics.joinToString(", ", "[", "]") { cubic ->
      listOf(
        cubic.anchor0X, cubic.anchor0Y, cubic.control0X, cubic.control0Y,
        cubic.control1X, cubic.control1Y, cubic.anchor1X, cubic.anchor1Y,
      ).joinToString(", ", "[", "]") { round(it) }
    }

  private fun round(value: Float): String = "%.4f".format(java.util.Locale.ROOT, value).trimEnd('0').trimEnd('.')
}
