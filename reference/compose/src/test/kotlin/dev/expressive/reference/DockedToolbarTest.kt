package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.BottomAppBarDefaults
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.FlexibleBottomAppBar
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconToggleButton
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
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
 * Must render the same scene as the showcase route `/reference/docked-toolbar`: a 360dp wide `FlexibleBottomAppBar`
 * with the default (SpaceBetween) and the fixed arrangement, without window insets.
 */
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
class DockedToolbarTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @Test
  fun arrangements() {
    paparazzi.snapshot(name = "docked-toolbar") {
      MaterialTheme {
        Column(
          Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp),
          verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
          FlexibleBottomAppBar(Modifier.width(360.dp), windowInsets = WindowInsets(0)) { Items() }
          FlexibleBottomAppBar(
            Modifier.width(360.dp),
            horizontalArrangement = BottomAppBarDefaults.FlexibleFixedHorizontalArrangement,
            windowInsets = WindowInsets(0),
          ) { Items() }
        }
      }
    }
  }
}

@Composable
private fun Items() {
  IconButton(onClick = {}) { Dot() }
  IconToggleButton(checked = true, onCheckedChange = {}) { Dot() }
  IconToggleButton(checked = false, onCheckedChange = {}) { Dot() }
  IconButton(onClick = {}, enabled = false) { Dot() }
}

/** Stands in for an icon, so the scene doesn't depend on icon fonts. */
@Composable
private fun Dot() {
  Box(Modifier.size(24.dp).background(LocalContentColor.current, CircleShape))
}
