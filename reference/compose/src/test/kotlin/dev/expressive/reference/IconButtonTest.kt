package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.FilledTonalIconToggleButton
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.IconToggleButton
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.LocalMinimumInteractiveComponentSize
import androidx.compose.material3.MaterialTheme
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
 * Must render the same scene as the showcase route `/reference/icon-button`. The 48dp touch target is switched off
 * because on the web it doesn't take layout space. Standard buttons use the vibrant colours (on-surface-variant), which
 * the spec names; Compose's plain `iconButtonColors()` inherits `LocalContentColor` instead.
 */
class IconButtonTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Test
  fun states() {
    paparazzi.snapshot(name = "icon-button") {
      MaterialTheme {
        CompositionLocalProvider(LocalMinimumInteractiveComponentSize provides Dp.Unspecified) {
          Row(
            Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
          ) {
            val shapes = IconButtonDefaults.shapes()
            val toggleShapes = IconButtonDefaults.toggleableShapes()
            val standard = IconButtonDefaults.iconButtonVibrantColors()
            IconButton(onClick = {}, shapes = shapes, colors = standard) { Dot() }
            IconToggleButton(checked = true, onCheckedChange = {}, shapes = toggleShapes) { Dot() }
            FilledTonalIconButton(onClick = {}, shapes = shapes) { Dot() }
            FilledTonalIconToggleButton(checked = true, onCheckedChange = {}, shapes = toggleShapes) { Dot() }
            IconButton(onClick = {}, shapes = shapes, enabled = false, colors = standard) { Dot() }
            FilledTonalIconButton(onClick = {}, shapes = shapes, enabled = false) { Dot() }
          }
        }
      }
    }
  }
}

/** Stands in for an icon, so the scene doesn't depend on icon fonts. */
@Composable
private fun Dot() {
  Box(Modifier.size(24.dp).background(LocalContentColor.current, CircleShape))
}
