package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ShortNavigationBar
import androidx.compose.material3.ShortNavigationBarItem
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
 * Must render the same scene as the showcase route `/reference/navigation-bar`: a 360dp short navigation bar with four
 * items, the second selected. Dots stand in for icons and bars for labels, so the scene doesn't depend on fonts.
 */
class NavigationBarTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @Test
  fun bar() {
    paparazzi.snapshot(name = "navigation-bar") {
      MaterialTheme {
        // A width on the bar itself reaches its items as a minimum width, so every item becomes 360dp wide.
        Box(Modifier.width(360.dp)) {
          ShortNavigationBar(windowInsets = WindowInsets(0)) {
            repeat(4) { index ->
              ShortNavigationBarItem(
                selected = index == 1,
                onClick = {},
                icon = { Dot() },
                label = { Label() },
              )
            }
          }
        }
      }
    }
  }
}

@Composable
private fun Dot() {
  Box(Modifier.size(24.dp).background(LocalContentColor.current, CircleShape))
}

@Composable
private fun Label() {
  Box(Modifier.size(width = 40.dp, height = 16.dp).background(LocalContentColor.current))
}
