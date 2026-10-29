package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.BottomSheetDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
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
 * Must render the same scene as the showcase route `/reference/bottom-sheet`: an open 360dp bottom sheet without its
 * scrim, holding a dot with 16dp padding under its drag handle. Paparazzi can't render the dialog window that
 * `ModalBottomSheet` opens, so this draws what it puts in it: a Surface with the sheet's shape and colour, the default
 * drag handle centred above the content. The scene sits on Surface so the sheet's top corners show.
 */
class BottomSheetTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3Api::class)
  @Test
  fun sheet() {
    paparazzi.snapshot(name = "bottom-sheet") {
      MaterialTheme {
        Box(Modifier.background(MaterialTheme.colorScheme.surface)) {
          Surface(
            modifier = Modifier.width(360.dp),
            shape = BottomSheetDefaults.ExpandedShape,
            color = BottomSheetDefaults.ContainerColor,
          ) {
            Column {
              Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) { BottomSheetDefaults.DragHandle() }
              Dot()
            }
          }
        }
      }
    }
  }
}

/** Stands in for the sheet's content, so the scene doesn't depend on fonts. */
@Composable
private fun Dot() {
  Box(Modifier.padding(16.dp).size(20.dp).background(LocalContentColor.current, CircleShape))
}
