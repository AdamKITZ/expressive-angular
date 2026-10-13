package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.FloatingToolbarDefaults
import androidx.compose.material3.HorizontalFloatingToolbar
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.IconToggleButton
import androidx.compose.material3.IconToggleButtonColors
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.VerticalFloatingToolbar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.ide.common.rendering.api.SessionParams.RenderingMode
import com.android.resources.Density
import org.junit.Rule
import org.junit.Test

/**
 * Must render the same scenes as the showcase routes `/reference/floating-toolbar` and
 * `/reference/floating-toolbar-fab`. Items are the plain `IconButton` / `IconToggleButton` that Compose's `AppBarRow`
 * puts in toolbars. In the vibrant toolbar the selected toggle takes `FloatingToolbarTokens.VibrantButtonSelected*`
 * (SurfaceContainer, OnSurface), which Compose's defaults never apply but the library does.
 */
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
class FloatingToolbarTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  /** Standard and vibrant, horizontal and vertical. */
  @Test
  fun toolbars() {
    paparazzi.snapshot(name = "floating-toolbar") {
      Scene {
        HorizontalFloatingToolbar(expanded = true) { Items(vibrant = false) }
        HorizontalFloatingToolbar(
          expanded = true,
          colors = FloatingToolbarDefaults.vibrantFloatingToolbarColors(),
        ) { Items(vibrant = true) }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          VerticalFloatingToolbar(expanded = true) { Items(vibrant = false) }
          VerticalFloatingToolbar(
            expanded = true,
            colors = FloatingToolbarDefaults.vibrantFloatingToolbarColors(),
          ) { Items(vibrant = true) }
        }
      }
    }
  }

  /**
   * Expanded toolbars with a FAB, standard horizontal and vibrant vertical. A collapsed one is left out on purpose:
   * Compose keeps the expanded width while collapsed, the library shrinks to the FAB.
   */
  @Test
  fun withFab() {
    paparazzi.snapshot(name = "floating-toolbar-fab") {
      Scene {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.Top) {
          HorizontalFloatingToolbar(
            expanded = true,
            floatingActionButton = {
              FloatingToolbarDefaults.StandardFloatingActionButton(onClick = {}) { Dot() }
            },
          ) { Items(vibrant = false) }
          VerticalFloatingToolbar(
            expanded = true,
            colors = FloatingToolbarDefaults.vibrantFloatingToolbarColors(),
            floatingActionButton = {
              FloatingToolbarDefaults.VibrantFloatingActionButton(onClick = {}) { Dot() }
            },
          ) { Items(vibrant = true) }
        }
      }
    }
  }
}

@Composable
private fun Items(vibrant: Boolean) {
  val toggleColors: IconToggleButtonColors =
    if (vibrant) {
      IconButtonDefaults.iconToggleButtonColors(
        checkedContainerColor = MaterialTheme.colorScheme.surfaceContainer,
        checkedContentColor = MaterialTheme.colorScheme.onSurface,
      )
    } else {
      IconButtonDefaults.iconToggleButtonColors()
    }
  IconButton(onClick = {}) { Dot() }
  IconToggleButton(checked = true, onCheckedChange = {}, colors = toggleColors) { Dot() }
  IconToggleButton(checked = false, onCheckedChange = {}, colors = toggleColors) { Dot() }
  IconButton(onClick = {}, enabled = false) { Dot() }
}

@Composable
private fun Scene(content: @Composable () -> Unit) {
  MaterialTheme {
    Column(
      Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp),
      verticalArrangement = Arrangement.spacedBy(8.dp),
    ) { content() }
  }
}

/** Stands in for an icon, so the scenes don't depend on icon fonts. */
@Composable
private fun Dot() {
  Box(Modifier.size(24.dp).background(LocalContentColor.current, CircleShape))
}
