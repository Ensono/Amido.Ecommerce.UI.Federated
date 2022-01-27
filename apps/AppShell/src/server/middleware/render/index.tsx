import { createElement } from "react"
import { renderToPipeableStream } from 'react-dom/server'
import App from '../../../App'
// @ts-ignore
export const renderMiddleware = (req, res) => {
  if (req.path !== "/") {
    res.status(404);
    res.send();
    return;
  }

  let didError = false;
  const ctx = {};
  const { pipe, abort } = renderToPipeableStream(
    .createElement(
      App.context.Provider,
      { value: ctx },
      .createElement(App.default)
    ),
    {
      onCompleteAll() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200;
        res.contentType("html");
        res.write("<!DOCTYPE html>");
        pipe(res);
      },
      onError(x: string) {
        didError = true;
        console.error(x);
      },
    }
  );

  setTimeout(abort as AbortRenderToPipe, 5000);
};

type AbortRenderToPipe = () => void