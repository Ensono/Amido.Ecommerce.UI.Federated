import React, { lazy } from 'react';

import { Parser, ProcessNodeDefinitions } from 'html-to-react'
import stringify from 'json-stringify-deterministic'
import fetch from 'node-fetch'

type Module = React.LazyExoticComponent<any>
type ModuleFactory = () => { default: Module }
interface ModulesContainer { init(shareScope: string): Promise<void>; get(module: string): Promise<ModuleFactory> }

interface Modules { [module: string]: Module }

interface RemotesContext {
  [remote: string]: Module | Modules
}

export const context: RemotesContext = {};

interface PrerenderedModule {
  chunks: string[];
  html: string;
}

interface RemoteUrls {
  [name: string]: string
}

function getClientComponent(
  ctx: RemotesContext,
  remote: string,
  module: string,
  shareScope: string,
) {
  ctx[remote] = ctx[remote] || {};
  const modules = ctx[remote] as Modules; 


  let Component = modules[module]

  if (!Component) {
    Component = modules[module] = lazy(async () => {
      const modulesContainer = (window as { [key: string]: any })[remote] as ModulesContainer;
      await __webpack_init_sharing__(shareScope);
      await modulesContainer.init(__webpack_share_scopes__.default);
      const factory = await modulesContainer.get(module);
      return factory();
    });
  }
  return Component;
}

function getServerComponent(ctx: RemotesContext,
  remote: string,
  module: string,
  props: {},
  remoteUrls: RemoteUrls
) {
  // We cache based on properties. This allows us to only
  // do one fetch for multiple references of a remote component.
  const id = stringify({ remote, module, props });

  let Component = ctx[id] as Module;

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
        .then((jsonRes: any) => {
          const { chunks, html } = jsonRes as PrerenderedModule;
          // Create an instance of the html->react parser
          const processNodeDefinitions = new ProcessNodeDefinitions(React);
          const parser = new Parser();

          return {
            default: ({ children }: { children: typeof React.Children }) => {
              const parseInstructions = [
                {
                  shouldProcessNode: (node: { type: string, data: string }) => {
                    // If the pre-rendered component rendered a children placeholder,
                    // we will process this ourselves.
                    if (node?.type === 'text' && node.data === '\u200Cchildren\u200C') {
                      return true;
                    }
                    return false;
                  },
                  processNode: (_: any, __: any, index: number) => {
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
  remoteUrls: RemoteUrls,
) {
  const FederatedComponent: React.FC = ({ children, ...props }) => {
    let Component: React.FC;

    if (typeof window !== 'undefined') {
      Component = getClientComponent(context, remote, module, shareScope);
    } else if (typeof window === 'undefined') {
      Component = getServerComponent(context, remote, module, props, remoteUrls);
    } else {
      return null
    }

    return <Component {...props}>{children}</Component>;
  };

  return FederatedComponent;
}
