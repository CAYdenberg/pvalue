import "../examples/global.ts";
import data from "../examples/precipitation.ts";

import { h, render } from "preact";
import { useCallback, useRef } from "preact/hooks";
import { basicSetup, EditorView } from "codemirror/codemirror/dist/index.js";
import { drawSelection, ViewUpdate } from "codemirror/view/dist/index.js";
import { oneDark } from "codemirror/theme-one-dark/dist/index.js";
import { javascript } from "codemirror/lang-javascript/dist/index.js";
import * as Babel from "npm:@babel/standalone";
import { Container } from "../components/Container.tsx";
import { ErrorState } from "../components/ErrorState.tsx";

interface Props {
  code: string;
}

export default function Editor({ code }: Props) {
  const editor = useRef<EditorView>();

  const onMount = useCallback((parent: HTMLDivElement | null) => {
    if (!parent) return;

    editor.current?.destroy();

    let timer: number;

    editor.current = new EditorView({
      doc: code,
      extensions: [
        basicSetup,
        drawSelection(),
        javascript({
          jsx: true,
          typescript: true,
        }),
        oneDark,
        EditorView.updateListener.of((update: ViewUpdate) => {
          const code = update.state.doc.toString();
          if (!script) {
            execute(code);
            return;
          }

          if (!update.docChanged) return;

          clearTimeout(timer);
          timer = setTimeout(() => {
            execute(code);
          }, 1000);
        }),
      ],
      parent,
    });

    execute(code);
  }, []);

  return <div id="input" ref={onMount}></div>;
}

let script: HTMLScriptElement | null = null;
let root: HTMLElement | null = null;

function reset() {
  root && render(null, root);

  if (script) {
    try {
      document.body.removeChild(script);
    } catch (e) {
      console.error(e);
    }
  }

  script = null;
}

function execute(code: string) {
  reset();

  root = document.getElementById("output");
  if (!root) return;

  try {
    const jscode = Babel.transform(code, {
      filename: "code.tsx",
      presets: ["env", "react", "typescript"],
    }).code;
    if (!jscode) {
      return;
    }

    script = document.createElement("script");
    script.textContent = jscode;
    document.body.appendChild(script);

    render(
      h(Container, {
        data,
        // @ts-ignore: render preact manually
        app: (width) => h(App, { data, width }),
      }),
      root,
    );
  } catch (error) {
    reset();
    render(h(ErrorState, { error }), root);
  }
}
