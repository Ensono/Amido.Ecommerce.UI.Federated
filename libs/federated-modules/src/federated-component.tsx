import React, { createContext, lazy } from 'react';

import { Parser, ProcessNodeDefinitions } from 'html-to-react';
import stringify from 'json-stringify-deterministic';
import fetch from 'node-fetch';

export interface ModulesContext {
  [key: string]: JSX.Element | { [key: string]: JSX.Element };
}

export const context = createContext<ModulesContext>({});

function getClientComponent(
  ctx: ModulesContext,
  remote: string,
  module: string,
  shareScope: string,
) {
  ctx[remote] = ctx[remote] || {};

  let Component = ctx[remote][module];

  if (!Component) {
    Component = ctx[remote][module] = lazy(async () => {
      const container = window[remote];
      await __webpack_init_sharing__(shareScope);
      await container.init(__webpack_share_scopes__.default);
      const factory = await container.get(module);
      const Module = factory();
      return Module;
    });
  }
  return Component;
}

function getServerComponent(ctx, remote, module, props, remoteUrls) {
  // We cache based on properties. This allows us to only
  // do one fetch for multiple references of a remote component.
  const id = stringify({ remote, module, props });

  let Component = ctx[id];

  if (!Component) {
    Component = ctx[id] = lazy(() =>
      // Do the post request to pre-render the federated component
      fetch(`${remoteUrls[remote]}/prerender`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: stringify({
          module,
          props,
        }),
      })
        .then((res) => res.json())
        .then(({ chunks, html }) => {
          // Create an instance of the html->react parser
          const processNodeDefinitions = new ProcessNodeDefinitions(React);
          const parser = new Parser();

          return {
            default: ({ children }) => {
              const parseInstructions = [
                {
                  shouldProcessNode: (node) => {
                    // If the pre-rendered component rendered a children placeholder,
                    // we will process this ourselves.
                    if (node?.type === 'text' && node.data === '\u200Cchildren\u200C') {
                      return true;
                    }
                    return false;
                  },
                  processNode: (_, __, index) => {
                    // Instead of retaining the children placeholder, render out
                    // the children components. This even allows for recursive
                    // federated components!
                    return <React.Fragment key={index}>{children}</React.Fragment>;
                  },
                },
                {
                  // Process all other nodes with the lib defaults.
                  shouldProcessNode: () => true,
                  processNode: processNodeDefinitions.processDefaultNode,
                },
              ];

              // Turn the pre-rendered HTML string into a react element
              // while rendering out the children.
              const reactElement = parser.parseWithInstructions(
                html,
                () => true,
                parseInstructions,
              );

              return (
                <>
                  {/* Add style chunks and async script tags for the script chunks. */}
                  {chunks.map((chunk) =>
                    chunk.endsWith('.css') ? (
                      <link
                        key={chunk}
                        rel="stylesheet"
                        href={`${remoteUrls[remote]}/build/${chunk}`}
                      />
                    ) : (
                      <script
                        key={chunk}
                        async
                        src={`${remoteUrls[remote]}/build/${chunk}`}
                      />
                    ),
                  )}
                  {/* Render the re-constructed react element */}
                  {reactElement}
                </>
              );
            },
          };
        }),
    );
  }

  return Component;
}

export default function federatedComponent(
  remote: string,
  module: string,
  shareScope = 'default',
  remoteUrls: ,
) {
  const FederatedComponent = ({ children, ...props }) => {
    let Component;

    if (typeof window !== 'undefined') {
      Component = getClientComponent(context, remote, module, shareScope);
    }

    if (typeof window === 'undefined') {
      Component = getServerComponent(context, remote, module, props, remoteUrls);
    }

    return <Component {...props}>{children}</Component>;
  };

  return FederatedComponent;
}
