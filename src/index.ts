import { ViewPlugin } from '@codemirror/view';
import { syntaxHighlighting, LanguageSupport } from '@codemirror/language';
import { markdown } from '@codemirror/lang-markdown';

import tagParser from './tagParser';
import highlightStyle from './highlightStyle';
import RichEditPlugin from './richEdit';
import renderBlock from './renderBlock';

import type { Config } from '@markdoc/markdoc';

export type MarkdocPluginConfig = { lezer?: any, markdoc: Config };

export
function richdoc (config: MarkdocPluginConfig) {
  const plugin = ViewPlugin.fromClass(RichEditPlugin, {
      decorations: v => v.decorations,
      provide: v => [
        renderBlock(config?.markdoc ?? {}),
        syntaxHighlighting(highlightStyle)
      ],
      eventHandlers: {
        mousedown({ target }, view) {
          if (target instanceof Element && target.matches('.cm-markdoc-renderBlock *'))
            view.dispatch({ selection: { anchor: view.posAtDOM(target) } });
        }
      }
    })
  const mergedConfig = {
    ...config?.lezer ?? [],
    extensions: [tagParser, ...config?.lezer?.extensions ?? []]
  };
  const ls = markdown(mergedConfig);
  ls.language.name = 'richdoc'

  return new LanguageSupport(ls, plugin);
}
