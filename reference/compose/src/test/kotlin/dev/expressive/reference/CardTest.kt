package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Card
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
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
 * Must render the same scene as the showcase route `/reference/card`: a filled, an elevated and an outlined card, each
 * holding a dot with 16dp padding, on Surface.
 */
class CardTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  @Test
  fun cards() {
    paparazzi.snapshot(name = "card") {
      MaterialTheme {
        Column(
          Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp).width(240.dp),
          verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
          Card(onClick = {}, modifier = Modifier.fillMaxWidth()) { Dot() }
          ElevatedCard(onClick = {}, modifier = Modifier.fillMaxWidth()) { Dot() }
          OutlinedCard(onClick = {}, modifier = Modifier.fillMaxWidth()) { Dot() }
        }
      }
    }
  }
}

/** Stands in for the card's content, so the scene doesn't depend on fonts. */
@Composable
private fun Dot() {
  Box(Modifier.padding(16.dp).size(20.dp).background(LocalContentColor.current, CircleShape))
}
