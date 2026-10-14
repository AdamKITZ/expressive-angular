package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.ListItemDefaults
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SegmentedListItem
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.ide.common.rendering.api.SessionParams.RenderingMode
import com.android.resources.Density
import org.junit.Rule
import org.junit.Test

/**
 * Must render the same scene as the showcase route `/reference/segmented-list`: a list of three items, then a list of
 * one, on SurfaceContainer so that the Surface items stand out.
 */
class SegmentedListTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Test
  fun lists() {
    paparazzi.snapshot(name = "segmented-list") {
      MaterialTheme {
        Column(
          Modifier.background(MaterialTheme.colorScheme.surfaceContainer).padding(12.dp).width(240.dp),
          verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
          Column(verticalArrangement = Arrangement.spacedBy(ListItemDefaults.SegmentedGap)) {
            repeat(3) { index ->
              SegmentedListItem(onClick = {}, shapes = ListItemDefaults.segmentedShapes(index, 3)) { Dot() }
            }
          }
          SegmentedListItem(onClick = {}, shapes = ListItemDefaults.segmentedShapes(0, 1)) { Dot() }
        }
      }
    }
  }
}

/** Stands in for a label, so the scene doesn't depend on fonts. */
@Composable
private fun Dot() {
  Box(Modifier.size(20.dp).background(LocalContentColor.current, CircleShape))
}
