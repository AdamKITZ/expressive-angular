package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.MaterialShapes
import androidx.compose.material3.toShape
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.graphics.shapes.Cubic
import androidx.graphics.shapes.Morph
import androidx.graphics.shapes.RoundedPolygon
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.ide.common.rendering.api.SessionParams.RenderingMode
import com.android.resources.Density
import java.io.File
import org.junit.Rule
import org.junit.Test

/**
 * Records Compose's 35 `MaterialShapes` for tools/tokens/generate.ts: per shape the cubics `toShape` draws and the
 * features `Morph` matches, and renders them for the showcase route `/reference/material-shapes`.
 */
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
class MaterialShapesTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  private val shapes: List<Pair<String, RoundedPolygon>> = with(MaterialShapes) {
    listOf(
      "circle" to Circle, "square" to Square, "slanted" to Slanted, "arch" to Arch, "fan" to Fan,
      "arrow" to Arrow, "semiCircle" to SemiCircle, "oval" to Oval, "pill" to Pill, "triangle" to Triangle,
      "diamond" to Diamond, "clamShell" to ClamShell, "pentagon" to Pentagon, "gem" to Gem, "sunny" to Sunny,
      "verySunny" to VerySunny, "cookie4Sided" to Cookie4Sided, "cookie6Sided" to Cookie6Sided,
      "cookie7Sided" to Cookie7Sided, "cookie9Sided" to Cookie9Sided, "cookie12Sided" to Cookie12Sided,
      "ghostish" to Ghostish, "clover4Leaf" to Clover4Leaf, "clover8Leaf" to Clover8Leaf, "burst" to Burst,
      "softBurst" to SoftBurst, "boom" to Boom, "softBoom" to SoftBoom, "flower" to Flower, "puffy" to Puffy,
      "puffyDiamond" to PuffyDiamond, "pixelCircle" to PixelCircle, "pixelTriangle" to PixelTriangle,
      "bun" to Bun, "heart" to Heart,
    )
  }

  @Test
  fun record() {
    val entries = shapes.map { (name, polygon) ->
      val features = features(polygon).joinToString(", ", "[", "]") { (type, featureCubics) ->
        "{ \"type\": \"$type\", \"cubics\": ${cubics(featureCubics)} }"
      }
      "  \"$name\": { \"cubics\": ${cubics(polygon.cubics)}, \"features\": $features }"
    }
    File("src/test/snapshots/material-shapes.json").writeText("{\n${entries.joinToString(",\n")}\n}\n")
  }

  /** Morphs between neighbouring shapes and shapes seven apart, as fixtures for the TypeScript port of `Morph`. */
  @Test
  fun recordMorphs() {
    val entries = shapes.indices.flatMap { i -> listOf(i to (i + 1) % shapes.size, i to (i + 7) % shapes.size) }
      .map { (from, to) ->
        val morph = Morph(shapes[from].second, shapes[to].second)
        "  { \"from\": \"${shapes[from].first}\", \"to\": \"${shapes[to].first}\", " +
          "\"start\": ${cubics(morph.asCubics(0f))}, \"end\": ${cubics(morph.asCubics(1f))} }"
      }
    File("src/test/snapshots/material-shape-morphs.json").writeText("[\n${entries.joinToString(",\n")}\n]\n")
  }

  @Test
  fun all() {
    paparazzi.snapshot(name = "material-shapes") {
      Column(
        Modifier.background(Color.White).padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
      ) {
        shapes.chunked(7).forEach { row ->
          Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            row.forEach { (_, polygon) ->
              Box(Modifier.size(48.dp).background(Color.Black, polygon.toShape()))
            }
          }
        }
      }
    }
  }

  /**
   * The polygon's features as `Morph` sees them: corner (convex or concave) or edge, with their cubics. graphics-shapes
   * 1.1.0 keeps `features` and `Feature` internal, hence the reflection.
   */
  private fun features(polygon: RoundedPolygon): List<Pair<String, List<Cubic>>> {
    val getter = RoundedPolygon::class.java.methods.first { it.name.startsWith("getFeatures") }
    return (getter.invoke(polygon) as List<*>).map { feature ->
      val type = feature!!::class.java
      @Suppress("UNCHECKED_CAST")
      val cubics = type.methods.first { it.name.startsWith("getCubics") }.invoke(feature) as List<Cubic>
      val kind =
        if (type.simpleName == "Corner") {
          val convex = type.methods.first { it.name.startsWith("getConvex") }.invoke(feature) as Boolean
          if (convex) "convex" else "concave"
        } else {
          "edge"
        }
      kind to cubics
    }
  }

  private fun cubics(cubics: List<Cubic>): String =
    cubics.joinToString(", ", "[", "]") { cubic ->
      listOf(
        cubic.anchor0X, cubic.anchor0Y, cubic.control0X, cubic.control0Y,
        cubic.control1X, cubic.control1Y, cubic.anchor1X, cubic.anchor1Y,
      ).joinToString(", ", "[", "]") { round(it) }
    }

  private fun round(value: Float): String = "%.5f".format(java.util.Locale.ROOT, value).trimEnd('0').trimEnd('.')
}
