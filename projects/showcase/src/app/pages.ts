export interface Page {
  path: string;
  label: string;
  icon: string;
  sections: readonly Section[];
}

export interface Section {
  title: string;
  id: string;
}

export const PAGES: readonly Page[] = [
  {
    path: 'buttons',
    label: 'Buttons',
    icon: 'smart_button',
    sections: [
      { title: 'Icon button', id: 'icon-button' },
      { title: 'Split button', id: 'split-button' },
      { title: 'Toggle button', id: 'toggle-button' },
      { title: 'Button group', id: 'button-group' },
      { title: 'Toolbars', id: 'toolbars' },
    ],
  },
  {
    path: 'progress',
    label: 'Progress',
    icon: 'donut_large',
    sections: [
      { title: 'Loading indicator', id: 'loading-indicator' },
      { title: 'Linear progress', id: 'linear-progress' },
      { title: 'Circular progress', id: 'circular-progress' },
    ],
  },
  { path: 'sliders', label: 'Sliders', icon: 'tune', sections: [{ title: 'Slider', id: 'slider' }] },
  {
    path: 'lists',
    label: 'Lists',
    icon: 'list',
    sections: [
      { title: 'Segmented list', id: 'segmented-list' },
      { title: 'Card', id: 'card' },
      { title: 'Menu', id: 'menu' },
    ],
  },
  {
    path: 'navigation',
    label: 'Navigation',
    icon: 'explore',
    sections: [
      { title: 'Navigation bar', id: 'navigation-bar' },
      { title: 'Navigation rail', id: 'navigation-rail' },
      { title: 'Modal navigation rail', id: 'modal-navigation-rail' },
      { title: 'Search', id: 'search' },
    ],
  },
  {
    path: 'sheets',
    label: 'Sheets',
    icon: 'call_to_action',
    sections: [{ title: 'Bottom sheet', id: 'bottom-sheet' }],
  },
];
