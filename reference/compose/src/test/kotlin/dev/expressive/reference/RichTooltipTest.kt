package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RichTooltip
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TooltipScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.LayoutCoordinates
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntRect
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.PopupPositionProvider
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.ide.common.rendering.api.SessionParams.RenderingMode
import com.android.resources.Density
import org.junit.Rule
import org.junit.Test

/**
 * Must render the same scene as the showcase route `/reference/rich-tooltip`. The tooltips are drawn in place instead of
 * in a popup, which Paparazzi doesn't capture; their width is fixed so the scene doesn't depend on text measurement.
 */
@OptIn(ExperimentalMaterial3Api::class)
class RichTooltipTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  /** Subhead, text and action; subhead and text; text only. */
  @Test
  fun variants() {
    paparazzi.snapshot(name = "rich-tooltip") {
      MaterialTheme {
        Column(
          Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp),
          verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
          val modifier = Modifier.width(240.dp)
          with(tooltipScope()) {
            RichTooltip(
              modifier = modifier,
              title = { Text("Title") },
              action = { TextButton(onClick = {}) { Text("Action") } },
            ) { Text("Supporting text") }
            RichTooltip(modifier = modifier, title = { Text("Title") }) { Text("Supporting text") }
            RichTooltip(modifier = modifier) { Text("Supporting text") }
          }
        }
      }
    }
  }
}

/** `TooltipScope` is sealed; its only implementation is internal, and `RichTooltip` without a caret never calls it. */
private fun tooltipScope(): TooltipScope {
  val noPosition = object : PopupPositionProvider {
    override fun calculatePosition(
      anchorBounds: IntRect,
      windowSize: IntSize,
      layoutDirection: LayoutDirection,
      popupContentSize: IntSize,
    ): IntOffset = IntOffset.Zero
  }
  val noAnchor: () -> LayoutCoordinates? = { null }
  val constructor = Class.forName("androidx.compose.material3.TooltipScopeImpl").declaredConstructors.single()
  constructor.isAccessible = true
  return constructor.newInstance(noAnchor, noPosition) as TooltipScope
}
