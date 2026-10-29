package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.ExperimentalMaterial3Api
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
 * Must render the same scene as the showcase route `/reference/standard-bottom-sheet`: a 360 × 240dp scaffold on
 * Surface whose folded sheet shows its top 100dp, the drag handle and a dot with 16dp padding, of a 300dp sheet.
 */
class StandardBottomSheetTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3Api::class)
  @Test
  fun sheet() {
    paparazzi.snapshot(name = "standard-bottom-sheet") {
      MaterialTheme {
        Box(Modifier.size(width = 360.dp, height = 240.dp)) {
          BottomSheetScaffold(
            sheetContent = {
              Dot()
              Spacer(Modifier.height(200.dp))
            },
            sheetPeekHeight = 100.dp,
          ) {
            Box(Modifier.fillMaxSize().background(MaterialTheme.colorScheme.surface))
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
