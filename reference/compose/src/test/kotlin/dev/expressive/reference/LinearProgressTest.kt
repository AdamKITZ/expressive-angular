package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.LinearWavyProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.ide.common.rendering.api.SessionParams.RenderingMode
import com.android.resources.Density
import org.junit.Rule
import org.junit.Test

/** Must render the same scene as the showcase route `/reference/linear-progress`. */
class LinearProgressTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Test
  fun states() {
    paparazzi.snapshot(name = "linear-progress") {
      MaterialTheme {
        Column(
          Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp),
          verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
          LinearProgressIndicator(progress = { 0.5f })
          LinearWavyProgressIndicator(progress = { 0.5f })
          LinearWavyProgressIndicator(progress = { 0.05f })
          LinearWavyProgressIndicator(progress = { 1f })
          LinearProgressIndicator()
          LinearWavyProgressIndicator()
        }
      }
    }
  }
}
