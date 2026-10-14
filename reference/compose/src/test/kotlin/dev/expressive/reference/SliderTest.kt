package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.ide.common.rendering.api.SessionParams.RenderingMode
import com.android.resources.Density
import org.junit.Rule
import org.junit.Test

/** Must render the same scene as the showcase route `/reference/slider`. */
class SliderTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @Test
  fun states() {
    paparazzi.snapshot(name = "slider") {
      MaterialTheme {
        Column(Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp).width(300.dp)) {
          Slider(value = 0.3f, onValueChange = {})
          Slider(value = 0.5f, onValueChange = {}, steps = 3)
          Slider(value = 0.25f, onValueChange = {}, steps = 3)
          Slider(value = 0f, onValueChange = {})
          Slider(value = 1f, onValueChange = {})
          Slider(value = 0.6f, onValueChange = {}, enabled = false)
          Slider(value = 0.75f, onValueChange = {}, steps = 3, enabled = false)
        }
      }
    }
  }
}
