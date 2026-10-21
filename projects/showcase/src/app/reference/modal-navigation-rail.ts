import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `ModalNavigationRailTest.rail` in reference/compose: the open modal rail without its
 * scrim, 260dp tall, with three items and the second selected. The dialog is shown with `open` instead of
 * `showModal()` and the transform on the scene keeps it inside the scene, so the screenshot holds only the rail.
 */
@Component({
  selector: 'app-modal-navigation-rail-reference',
  template: `
    <div class="scene" data-reference>
      <dialog open class="exp-modal-navigation-rail">
        <nav class="exp-navigation-rail exp-navigation-rail-expanded">
          @for (index of [0, 1, 2]; track index) {
            <a href="#" [attr.aria-current]="index === 1 ? 'page' : null">
              <span class="dot"></span>
              <span class="label"></span>
            </a>
          }
        </nav>
      </dialog>
    </div>
  `,
  styles: `
    @use '../../reference/compose-light-scheme' as compose;

    .scene {
      @include compose.compose-light-scheme;
      position: fixed;
      top: 0;
      left: 0;
      width: 220px;
      height: 260px;
      transform: translateZ(0);
    }

    .scene .exp-modal-navigation-rail {
      transition: none;
    }

    .dot {
      border-radius: 50%;
      background: currentColor;
    }

    .label {
      width: 40px;
      height: 16px;
      background: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalNavigationRailReference {}
