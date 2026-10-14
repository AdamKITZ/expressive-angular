package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.CircularWavyProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.ide.common.rendering.api.SessionParams.RenderingMode
import com.android.resources.Density
import org.junit.Rule
import org.junit.Test

/**
 * Must render the same scene as the showcase route `/reference/circular-progress`; the indeterminate ones show their
 * first frame.
 */
class CircularProgressTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Test
  fun states() {
    paparazzi.snapshot(name = "circular-progress") {
      MaterialTheme {
        Row(
          Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp),
          horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
          CircularProgressIndicator(progress = { 0.3f })
          CircularWavyProgressIndicator(progress = { 0.3f })
          CircularWavyProgressIndicator(progress = { 0.7f })
          CircularWavyProgressIndicator(progress = { 0.05f })
          CircularProgressIndicator()
          CircularWavyProgressIndicator()
        }
      }
    }
  }
}
