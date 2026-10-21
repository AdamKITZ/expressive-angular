package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.WideNavigationRail
import androidx.compose.material3.WideNavigationRailDefaults
import androidx.compose.material3.WideNavigationRailItem
import androidx.compose.material3.WideNavigationRailValue
import androidx.compose.material3.rememberWideNavigationRailState
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
 * Must render the same scene as the showcase route `/reference/modal-navigation-rail`: the open modal rail without its
 * scrim, 260dp tall, with three items and the second selected. Paparazzi can't render the dialog window that
 * `ModalWideNavigationRail` opens, so this draws what it puts in it: an expanded rail with the modal container colour
 * and shape. Dots stand in for icons and bars for labels, so the scene doesn't depend on fonts.
 */
class ModalNavigationRailTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Test
  fun rail() {
    paparazzi.snapshot(name = "modal-navigation-rail") {
      MaterialTheme {
        Box(Modifier.height(260.dp)) {
          WideNavigationRail(
            state = rememberWideNavigationRailState(WideNavigationRailValue.Expanded),
            shape = WideNavigationRailDefaults.modalExpandedShape,
            colors = WideNavigationRailDefaults.colors(containerColor = MaterialTheme.colorScheme.surfaceContainer),
            windowInsets = WindowInsets(0),
          ) {
            repeat(3) { index ->
              WideNavigationRailItem(
                selected = index == 1,
                onClick = {},
                icon = { Dot() },
                label = { Label() },
                railExpanded = true,
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
