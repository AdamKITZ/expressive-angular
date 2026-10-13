package dev.expressive.reference

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.FilledIconToggleButton
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.FilledTonalIconToggleButton
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.IconButtonDefaults.IconButtonWidthOption
import androidx.compose.material3.IconButtonShapes
import androidx.compose.material3.IconToggleButton
import androidx.compose.material3.IconToggleButtonShapes
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.LocalMinimumInteractiveComponentSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedIconButton
import androidx.compose.material3.OutlinedIconToggleButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.ide.common.rendering.api.SessionParams.RenderingMode
import com.android.resources.Density
import org.junit.Rule
import org.junit.Test

/**
 * Must render the same scenes as the showcase routes `/reference/icon-button-colors` and `/reference/icon-button-sizes`.
 * The 48dp touch target is switched off because on the web it doesn't take layout space. Standard and outlined buttons
 * use the vibrant colours, which the spec names; Compose's plain action colours inherit `LocalContentColor` instead.
 */
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
class IconButtonTest {
  @get:Rule
  val paparazzi = Paparazzi(
    deviceConfig = DeviceConfig.PIXEL_5.copy(density = Density.MEDIUM),
    renderingMode = RenderingMode.SHRINK,
  )

  /** Rows filled, tonal, outlined, standard; columns action, unchecked, checked, checked without morph, disabled. */
  @Test
  fun colors() {
    paparazzi.snapshot(name = "icon-button-colors") {
      Scene {
        val shapes = IconButtonDefaults.shapes()
        val toggleShapes = IconButtonDefaults.toggleableShapes()
        val round = IconButtonDefaults.smallRoundShape
        val static = IconButtonDefaults.toggleableShapes(shape = round, pressedShape = round, checkedShape = round)
        Row(Modifier, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          FilledIconButton(onClick = {}, shapes = shapes) { Dot() }
          FilledIconToggleButton(checked = false, onCheckedChange = {}, shapes = toggleShapes) { Dot() }
          FilledIconToggleButton(checked = true, onCheckedChange = {}, shapes = toggleShapes) { Dot() }
          FilledIconToggleButton(checked = true, onCheckedChange = {}, shapes = static) { Dot() }
          FilledIconButton(onClick = {}, shapes = shapes, enabled = false) { Dot() }
          FilledIconToggleButton(checked = true, onCheckedChange = {}, shapes = toggleShapes, enabled = false) { Dot() }
        }
        Row(Modifier, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          FilledTonalIconButton(onClick = {}, shapes = shapes) { Dot() }
          FilledTonalIconToggleButton(checked = false, onCheckedChange = {}, shapes = toggleShapes) { Dot() }
          FilledTonalIconToggleButton(checked = true, onCheckedChange = {}, shapes = toggleShapes) { Dot() }
          FilledTonalIconToggleButton(checked = true, onCheckedChange = {}, shapes = static) { Dot() }
          FilledTonalIconButton(onClick = {}, shapes = shapes, enabled = false) { Dot() }
          FilledTonalIconToggleButton(checked = true, onCheckedChange = {}, shapes = toggleShapes, enabled = false) {
            Dot()
          }
        }
        Row(Modifier, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          val colors = IconButtonDefaults.outlinedIconButtonVibrantColors()
          OutlinedIconButton(
            onClick = {},
            shapes = shapes,
            colors = colors,
            border = IconButtonDefaults.outlinedIconButtonVibrantBorder(true),
          ) { Dot() }
          OutlinedIconToggleButton(checked = false, onCheckedChange = {}, shapes = toggleShapes) { Dot() }
          OutlinedIconToggleButton(checked = true, onCheckedChange = {}, shapes = toggleShapes) { Dot() }
          OutlinedIconToggleButton(checked = true, onCheckedChange = {}, shapes = static) { Dot() }
          OutlinedIconButton(
            onClick = {},
            shapes = shapes,
            enabled = false,
            colors = colors,
            border = IconButtonDefaults.outlinedIconButtonVibrantBorder(false),
          ) { Dot() }
          OutlinedIconToggleButton(checked = true, onCheckedChange = {}, shapes = toggleShapes, enabled = false) {
            Dot()
          }
        }
        Row(Modifier, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          val colors = IconButtonDefaults.iconButtonVibrantColors()
          IconButton(onClick = {}, shapes = shapes, colors = colors) { Dot() }
          IconToggleButton(checked = false, onCheckedChange = {}, shapes = toggleShapes) { Dot() }
          IconToggleButton(checked = true, onCheckedChange = {}, shapes = toggleShapes) { Dot() }
          IconToggleButton(checked = true, onCheckedChange = {}, shapes = static) { Dot() }
          IconButton(onClick = {}, shapes = shapes, enabled = false, colors = colors) { Dot() }
          IconToggleButton(checked = true, onCheckedChange = {}, shapes = toggleShapes, enabled = false) { Dot() }
        }
      }
    }
  }

  /** Rows XS to XL in filled tonal; columns narrow, uniform, wide, square, checked round, checked square. */
  @Test
  fun sizes() {
    paparazzi.snapshot(name = "icon-button-sizes") {
      Scene {
        SizeRow(
          { IconButtonDefaults.extraSmallContainerSize(it) },
          IconButtonDefaults.extraSmallIconSize,
          IconButtonDefaults.extraSmallRoundShape,
          IconButtonDefaults.extraSmallSquareShape,
          IconButtonDefaults.extraSmallPressedShape,
          IconButtonDefaults.extraSmallSelectedRoundShape,
          IconButtonDefaults.extraSmallSelectedSquareShape,
        )
        SizeRow(
          { IconButtonDefaults.smallContainerSize(it) },
          IconButtonDefaults.smallIconSize,
          IconButtonDefaults.smallRoundShape,
          IconButtonDefaults.smallSquareShape,
          IconButtonDefaults.smallPressedShape,
          IconButtonDefaults.smallSelectedRoundShape,
          IconButtonDefaults.smallSelectedSquareShape,
        )
        SizeRow(
          { IconButtonDefaults.mediumContainerSize(it) },
          IconButtonDefaults.mediumIconSize,
          IconButtonDefaults.mediumRoundShape,
          IconButtonDefaults.mediumSquareShape,
          IconButtonDefaults.mediumPressedShape,
          IconButtonDefaults.mediumSelectedRoundShape,
          IconButtonDefaults.mediumSelectedSquareShape,
        )
        SizeRow(
          { IconButtonDefaults.largeContainerSize(it) },
          IconButtonDefaults.largeIconSize,
          IconButtonDefaults.largeRoundShape,
          IconButtonDefaults.largeSquareShape,
          IconButtonDefaults.largePressedShape,
          IconButtonDefaults.largeSelectedRoundShape,
          IconButtonDefaults.largeSelectedSquareShape,
        )
        SizeRow(
          { IconButtonDefaults.extraLargeContainerSize(it) },
          IconButtonDefaults.extraLargeIconSize,
          IconButtonDefaults.extraLargeRoundShape,
          IconButtonDefaults.extraLargeSquareShape,
          IconButtonDefaults.extraLargePressedShape,
          IconButtonDefaults.extraLargeSelectedRoundShape,
          IconButtonDefaults.extraLargeSelectedSquareShape,
        )
      }
    }
  }
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

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
private fun SizeRow(
  containerSize: (IconButtonWidthOption) -> DpSize,
  iconSize: Dp,
  round: Shape,
  square: Shape,
  pressed: Shape,
  selectedRound: Shape,
  selectedSquare: Shape,
) {
  val uniform = Modifier.size(containerSize(IconButtonWidthOption.Uniform))
  val roundShapes = IconButtonShapes(shape = round, pressedShape = pressed)
  Row(Modifier, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
    FilledTonalIconButton(
      onClick = {},
      shapes = roundShapes,
      modifier = Modifier.size(containerSize(IconButtonWidthOption.Narrow)),
    ) { Dot(iconSize) }
    FilledTonalIconButton(onClick = {}, shapes = roundShapes, modifier = uniform) { Dot(iconSize) }
    FilledTonalIconButton(
      onClick = {},
      shapes = roundShapes,
      modifier = Modifier.size(containerSize(IconButtonWidthOption.Wide)),
    ) { Dot(iconSize) }
    FilledTonalIconButton(
      onClick = {},
      shapes = IconButtonShapes(shape = square, pressedShape = pressed),
      modifier = uniform,
    ) { Dot(iconSize) }
    FilledTonalIconToggleButton(
      checked = true,
      onCheckedChange = {},
      shapes = IconToggleButtonShapes(shape = round, pressedShape = pressed, checkedShape = selectedRound),
      modifier = uniform,
    ) { Dot(iconSize) }
    FilledTonalIconToggleButton(
      checked = true,
      onCheckedChange = {},
      shapes = IconToggleButtonShapes(shape = square, pressedShape = pressed, checkedShape = selectedSquare),
      modifier = uniform,
    ) { Dot(iconSize) }
  }
}

/** Stands in for an icon, so the scenes don't depend on icon fonts. */
@Composable
private fun Dot(size: Dp = 24.dp) {
  Box(Modifier.size(size).background(LocalContentColor.current, CircleShape))
}
