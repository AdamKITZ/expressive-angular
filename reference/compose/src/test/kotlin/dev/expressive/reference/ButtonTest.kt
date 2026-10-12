package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.LocalMinimumInteractiveComponentSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.TonalToggleButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.ide.common.rendering.api.SessionParams.RenderingMode
import com.android.resources.Density
import org.junit.Rule
import org.junit.Test

/**
 * Must render the same scene as the showcase route `/reference/button`. The 48dp touch target is switched off because
 * on the web it doesn't take layout space.
 */
class ButtonTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Test
  fun states() {
    paparazzi.snapshot(name = "button") {
      MaterialTheme {
        CompositionLocalProvider(LocalMinimumInteractiveComponentSize provides Dp.Unspecified) {
          Row(
            Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
          ) {
            TonalToggleButton(checked = false, onCheckedChange = {}) { Dot() }
            TonalToggleButton(checked = true, onCheckedChange = {}) { Dot() }
            TonalToggleButton(checked = false, onCheckedChange = {}, enabled = false) { Dot() }
          }
        }
      }
    }
  }
}

/** Stands in for a label, so the scene doesn't depend on fonts; 20dp is the small button's line height. */
@Composable
private fun Dot() {
  Box(Modifier.size(20.dp).background(LocalContentColor.current, CircleShape))
}
