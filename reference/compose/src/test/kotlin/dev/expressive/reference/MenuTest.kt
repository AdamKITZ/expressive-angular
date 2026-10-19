package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.DropdownMenuGroup
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.MenuDefaults
import androidx.compose.runtime.Composable
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
 * Must render the same scene as the showcase route `/reference/menu`: a menu of one group with a plain, a selected,
 * an icon and a disabled item, and a menu of two groups, the first with a label. The groups are drawn without their
 * popup, which Paparazzi does not render.
 */
class MenuTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Test
  fun groups() {
    paparazzi.snapshot(name = "menu") {
      MaterialTheme {
        Row(
          Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp),
          horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
          DropdownMenuGroup(shapes = MenuDefaults.groupShape(0, 1), modifier = Modifier.width(200.dp)) {
            Item(index = 0, count = 4)
            Item(index = 1, count = 4, selected = true)
            Item(index = 2, count = 4, icon = true)
            Item(index = 3, count = 4, enabled = false)
          }
          Column {
            DropdownMenuGroup(shapes = MenuDefaults.groupShape(0, 2), modifier = Modifier.width(200.dp)) {
              MenuDefaults.Label { Bar(60.dp) }
              Item(index = 0, count = 2)
              Item(index = 1, count = 2)
            }
            Spacer(Modifier.height(MenuDefaults.GroupSpacing))
            DropdownMenuGroup(shapes = MenuDefaults.groupShape(1, 2), modifier = Modifier.width(200.dp)) {
              Item(index = 0, count = 1)
            }
          }
        }
      }
    }
  }
}

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
private fun Item(index: Int, count: Int, selected: Boolean = false, icon: Boolean = false, enabled: Boolean = true) {
  DropdownMenuItem(
    selected = selected,
    onClick = {},
    text = { Bar(80.dp) },
    shapes = MenuDefaults.itemShape(index, count),
    leadingIcon = if (icon) ({ Box(Modifier.size(24.dp).background(LocalContentColor.current, CircleShape)) }) else null,
    enabled = enabled,
  )
}

/** Stands in for a label, so the scene doesn't depend on fonts; 20dp is the labelLarge line height. */
@Composable
private fun Bar(width: Dp) {
  Box(Modifier.size(width, 20.dp).background(LocalContentColor.current))
}
