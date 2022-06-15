import { Component, For, onMount, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { Structure } from '@plia/plia/types';

import { RendererMap } from './rendererMap';
import { extractStylesStructure } from '../normalizers/extractStylesStructure';
import { updateStylesView } from '../services/stylesView.service';
import { putStructureStyles } from '../stores/stylesStructure/reducers/styleReducers';

type RenderProps = {
  structure: Structure;
};

export const Renderer: Component<RenderProps> = (props) => {
  const insertStyleTag = () => {
    const style = document.createElement('style');
    document.head.append(style);
  };

  onMount(() => {
    insertStyleTag();

    const stylesStructure = extractStylesStructure(props.structure);

    stylesStructure.forEach((styles) => {
      putStructureStyles(styles.className, styles.cssProperties);
    });
    updateStylesView(stylesStructure);
  });

  const renderer = (structure: Structure) => (
    <Dynamic
      component={RendererMap.get(structure.component)}
      {...(structure?.props || {})}
      id={structure.id}
      class={structure.className}
    >
      <Show when={structure?.children?.length > 0}>
        <For each={structure.children}>{(child) => renderer(child)}</For>
      </Show>
    </Dynamic>
  );

  return renderer(props.structure);
};
