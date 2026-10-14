package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RangeSlider
import androidx.compose.material3.Slider
import androidx.compose.material3.VerticalSlider
import androidx.compose.material3.rememberSliderState
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.ide.common.rendering.api.SessionParams.RenderingMode
import com.android.resources.Density
import org.junit.Rule
import org.junit.Test

/** Each snapshot must render the same scene as the showcase route of its name. */
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

  @Test
  fun ranges() {
    paparazzi.snapshot(name = "range-slider") {
      MaterialTheme {
        Column(Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp).width(300.dp)) {
          RangeSlider(value = 0.2f..0.7f, onValueChange = {})
          RangeSlider(value = 0.25f..0.75f, onValueChange = {}, steps = 3)
          RangeSlider(value = 0f..1f, onValueChange = {}, steps = 3)
          RangeSlider(value = 0.5f..0.5f, onValueChange = {})
          RangeSlider(value = 0.3f..0.6f, onValueChange = {}, enabled = false)
        }
      }
    }
  }

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Test
  fun verticals() {
    paparazzi.snapshot(name = "vertical-slider") {
      MaterialTheme {
        Row(Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp).height(200.dp)) {
          VerticalSlider(state = rememberSliderState(value = 0.3f))
          VerticalSlider(state = rememberSliderState(value = 0.06f))
          VerticalSlider(state = rememberSliderState(value = 0.5f, steps = 3))
          VerticalSlider(state = rememberSliderState(value = 0f))
          VerticalSlider(state = rememberSliderState(value = 1f))
          VerticalSlider(state = rememberSliderState(value = 0.3f), reverseDirection = true)
          VerticalSlider(state = rememberSliderState(value = 0.6f), enabled = false)
        }
      }
    }
  }
}
