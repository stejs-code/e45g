import {$, component$} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import type {ImageTransformerProps} from "qwik-image";
import { useImageProvider} from "qwik-image";

// const imageTransformer$ = $(({ src, width, height }: ImageTransformerProps): string => {
//     return `${src}?w=${width}&h=${height}&format=webp`;
// });
//
// // Provide your default options
// useImageProvider({
//     // you can set this property to overwrite default values [640, 960, 1280, 1920, 3840]
//     resolutions: [640],
//     // you we can define the source from which to load our image
//     imageTransformer$,
// });

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   *
   * uwu
   */

  const imageTransformer$ = $(
      ({ src, width, height }: ImageTransformerProps): string => {
          // Here you can set your favorite image loaders service
          return `${src}?height=${height}&width=${width}&webp=true`;
      }
  );

    // Global Provider (required)
    useImageProvider({
        // You can set this prop to overwrite default values [3840, 1920, 1280, 960, 640]
        imageTransformer$,
    });

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en" class={"overflow-x-hidden dark:bg-slate-950 dark:text-slate-100"}>
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
