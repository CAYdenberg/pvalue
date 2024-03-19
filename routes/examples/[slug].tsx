import { Fragment } from "preact/jsx-runtime";
import Editor from "../../islands/Editor.tsx";
import * as path from "$std/path/mod.ts";
import { Handler, PageProps } from "$fresh/server.ts";

interface Props {
  code: string;
}

export const handler: Handler<Props> = async (req, ctx) => {
  const code = await Deno.readTextFile(
    path.join(Deno.cwd(), `examples/${ctx.params.slug}.tsx`),
  );
  if (!code) {
    return ctx.renderNotFound();
  }

  return ctx.render({ code });
};

export default function Examples({ data }: PageProps<Props>) {
  return (
    <Fragment>
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item">
              pvalue
            </a>

            <a class="navbar-item">
              Documentation
            </a>

            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                Examples
              </a>

              <div class="navbar-dropdown">
                <a
                  class="navbar-item example-select"
                  href="/examples/line-chart"
                >
                  Pannable Line Chart
                </a>
                <a
                  class="navbar-item example-select"
                  href="/examples/bar-chart"
                >
                  Responsive Bar Chart
                </a>
                <a class="navbar-item example-select" href="/examples/dot-plot">
                  Dot and Tukey plot
                </a>
              </div>
            </div>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-primary" href="https://livingpixel.io">
                  <strong>Living Pixel</strong>
                </a>
                <a
                  class="button is-light"
                  href="https://gitlab.com/lpix/pvalue"
                >
                  GitLab
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div class="columns is-gapless m-0">
        <div class="column">
          <div class="is-scrollable">
            <Editor code={data.code} />
          </div>
        </div>

        <div class="column">
          <div id="output" class="output"></div>
        </div>
      </div>
    </Fragment>
  );
}
