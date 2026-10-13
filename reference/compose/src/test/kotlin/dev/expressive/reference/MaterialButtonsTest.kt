package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ElevatedButton
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.LocalMinimumInteractiveComponentSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.TextButton
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
 * Must render the same scene as the showcase route `/reference/material-buttons`: plain Angular Material buttons
 * under the `material-buttons` mixin. The 48dp touch target is switched off because on the web it doesn't take
 * layout space. The icon button takes the vibrant colours, as `expIconButton` does: its default colours follow
 * LocalContentColor, which the web has no equivalent of.
 */
class MaterialButtonsTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Test
  fun variants() {
    paparazzi.snapshot(name = "material-buttons") {
      MaterialTheme {
        CompositionLocalProvider(LocalMinimumInteractiveComponentSize provides Dp.Unspecified) {
          Row(
            Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
          ) {
            Button(onClick = {}, shapes = ButtonDefaults.shapes()) { Dot(20) }
            ElevatedButton(onClick = {}, shapes = ButtonDefaults.shapes()) { Dot(20) }
            FilledTonalButton(onClick = {}, shapes = ButtonDefaults.shapes()) { Dot(20) }
            OutlinedButton(onClick = {}, shapes = ButtonDefaults.shapes()) { Dot(20) }
            TextButton(onClick = {}, shapes = ButtonDefaults.shapes()) { Dot(20) }
            Button(onClick = {}, shapes = ButtonDefaults.shapes(), enabled = false) { Dot(20) }
            IconButton(
              onClick = {},
              shapes = IconButtonDefaults.shapes(),
              colors = IconButtonDefaults.iconButtonVibrantColors(),
            ) {
              Dot(24)
            }
          }
        }
      }
    }
  }
}

/** Stands in for a label or an icon, so the scene doesn't depend on fonts. */
@Composable
private fun Dot(size: Int) {
  Box(Modifier.size(size.dp).background(LocalContentColor.current, CircleShape))
}
