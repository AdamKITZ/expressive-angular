package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SearchBar
import androidx.compose.material3.SearchBarDefaults
import androidx.compose.material3.rememberSearchBarState
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
 * Must render the same scene as the showcase route `/reference/search`: a 360dp collapsed search bar with a dot as its
 * leading icon and no text, so the scene doesn't depend on fonts.
 */
class SearchBarTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @OptIn(ExperimentalMaterial3Api::class)
  @Test
  fun bar() {
    paparazzi.snapshot(name = "search") {
      MaterialTheme {
        val state = rememberSearchBarState()
        SearchBar(
          state = state,
          modifier = Modifier.width(360.dp),
          inputField = {
            SearchBarDefaults.InputField(
              textFieldState = rememberTextFieldState(),
              searchBarState = state,
              onSearch = {},
              leadingIcon = { Dot() },
            )
          },
        )
      }
    }
  }
}

@Composable
private fun Dot() {
  Box(Modifier.size(24.dp).background(LocalContentColor.current, CircleShape))
}
