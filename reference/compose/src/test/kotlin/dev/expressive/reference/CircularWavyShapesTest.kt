package dev.expressive.reference

import androidx.graphics.shapes.CornerRounding
import androidx.graphics.shapes.Cubic
import androidx.graphics.shapes.Morph
import androidx.graphics.shapes.RoundedPolygon
import androidx.graphics.shapes.circle
import androidx.graphics.shapes.star
import java.io.File
import org.junit.Test

/**
 * Records the shapes Compose's `CircularWavyProgressIndicator` strokes, for tools/tokens/generate.ts to turn into
 * TypeScript: per vertex count, the star's own cubics, which Compose strokes until the amplitude first changes, and
 * the circle-to-star morph's matched cubics at progress 0 and 1, which it strokes from then on. Mirrors `CircularShapes.update` in CircularWavyProgressModifiers.kt. Vertex counts 5 to 12 cover
 * indicators up to about 60px with the default 15dp wavelength.
 */
class CircularWavyShapesTest {
  @Test
  fun record() {
    val shapes = (5..12).map { vertices ->
      val circle = RoundedPolygon.circle(numVertices = vertices).normalized()
      val star =
        RoundedPolygon.star(
            numVerticesPerRadius = vertices,
            innerRadius = 0.75f,
            rounding = CornerRounding(radius = 0.35f, smoothing = 0.4f),
            innerRounding = CornerRounding(radius = 0.5f),
          )
          .normalized()
      val morph = Morph(circle, star)
      "    \"$vertices\": { \"star\": ${cubics(star.cubics)}, \"start\": ${cubics(morph.asCubics(0f))}, " +
        "\"end\": ${cubics(morph.asCubics(1f))} }"
    }
    File("src/test/snapshots/circular-wavy-progress.json").writeText("{\n${shapes.joinToString(",\n")}\n}\n")
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
