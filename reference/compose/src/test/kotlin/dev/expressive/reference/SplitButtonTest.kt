package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.LocalMinimumInteractiveComponentSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SplitButtonDefaults
import androidx.compose.material3.SplitButtonLayout
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
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
 * Must render the same scenes as the showcase routes `/reference/split-button` and `/reference/split-button-sizes`.
 * "Checked" is the trailing button with its menu open. The 48dp touch target is switched off because on the web it
 * doesn't take layout space.
 */
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
class SplitButtonTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  /** Rows filled, tonal, elevated, outlined; columns default, checked, disabled. */
  @Test
  fun styles() {
    paparazzi.snapshot(name = "split-button") {
      Scene {
        for (style in Style.entries) {
          Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Split(style, checked = false, enabled = true)
            Split(style, checked = true, enabled = true)
            Split(style, checked = false, enabled = false)
          }
        }
      }
    }
  }

  /** Tonal at XS to XL, default and checked. */
  @Test
  fun sizes() {
    paparazzi.snapshot(name = "split-button-sizes") {
      Scene {
        for (height in listOf(
          SplitButtonDefaults.ExtraSmallContainerHeight,
          SplitButtonDefaults.SmallContainerHeight,
          SplitButtonDefaults.MediumContainerHeight,
          SplitButtonDefaults.LargeContainerHeight,
          SplitButtonDefaults.ExtraLargeContainerHeight,
        )) {
          Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Split(Style.Tonal, checked = false, enabled = true, height = height)
            Split(Style.Tonal, checked = true, enabled = true, height = height)
          }
        }
      }
    }
  }
}

private enum class Style { Filled, Tonal, Elevated, Outlined }

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
private fun Split(style: Style, checked: Boolean, enabled: Boolean, height: Dp = SplitButtonDefaults.SmallContainerHeight) {
  val leadingShapes = SplitButtonDefaults.leadingButtonShapesFor(height)
  val trailingShapes = SplitButtonDefaults.trailingButtonShapesFor(height)
  val leadingPadding = SplitButtonDefaults.leadingButtonContentPaddingFor(height)
  val trailingPadding = SplitButtonDefaults.trailingButtonContentPaddingFor(height)
  val leadingIcon = SplitButtonDefaults.leadingButtonIconSizeFor(height)
  val trailingIcon = SplitButtonDefaults.trailingButtonIconSizeFor(height)
  val modifier = Modifier.height(height)
  SplitButtonLayout(
    leadingButton = {
      when (style) {
        Style.Filled -> SplitButtonDefaults.LeadingButton(
          onClick = {}, modifier = modifier, enabled = enabled, shapes = leadingShapes, contentPadding = leadingPadding,
        ) { Dot(leadingIcon) }
        Style.Tonal -> SplitButtonDefaults.TonalLeadingButton(
          onClick = {}, modifier = modifier, enabled = enabled, shapes = leadingShapes, contentPadding = leadingPadding,
        ) { Dot(leadingIcon) }
        Style.Elevated -> SplitButtonDefaults.ElevatedLeadingButton(
          onClick = {}, modifier = modifier, enabled = enabled, shapes = leadingShapes, contentPadding = leadingPadding,
        ) { Dot(leadingIcon) }
        Style.Outlined -> SplitButtonDefaults.OutlinedLeadingButton(
          onClick = {}, modifier = modifier, enabled = enabled, shapes = leadingShapes, contentPadding = leadingPadding,
        ) { Dot(leadingIcon) }
      }
    },
    trailingButton = {
      when (style) {
        Style.Filled -> SplitButtonDefaults.TrailingButton(
          checked = checked, onCheckedChange = {}, modifier = modifier, enabled = enabled,
          shapes = trailingShapes, contentPadding = trailingPadding,
        ) { Dot(trailingIcon) }
        Style.Tonal -> SplitButtonDefaults.TonalTrailingButton(
          checked = checked, onCheckedChange = {}, modifier = modifier, enabled = enabled,
          shapes = trailingShapes, contentPadding = trailingPadding,
        ) { Dot(trailingIcon) }
        Style.Elevated -> SplitButtonDefaults.ElevatedTrailingButton(
          checked = checked, onCheckedChange = {}, modifier = modifier, enabled = enabled,
          shapes = trailingShapes, contentPadding = trailingPadding,
        ) { Dot(trailingIcon) }
        Style.Outlined -> SplitButtonDefaults.OutlinedTrailingButton(
          checked = checked, onCheckedChange = {}, modifier = modifier, enabled = enabled,
          shapes = trailingShapes, contentPadding = trailingPadding,
        ) { Dot(trailingIcon) }
      }
    },
  )
}

@Composable
private fun Scene(content: @Composable () -> Unit) {
  MaterialTheme {
    CompositionLocalProvider(LocalMinimumInteractiveComponentSize provides Dp.Unspecified) {
      Column(
        Modifier.background(MaterialTheme.colorScheme.surface).padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
      ) { content() }
    }
  }
}

/** Stands in for an icon, so the scenes don't depend on icon fonts. */
@Composable
private fun Dot(size: Dp) {
  Box(Modifier.size(size).background(LocalContentColor.current, CircleShape))
}
