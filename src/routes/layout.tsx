import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return <>
    <nav class={"border-b-2 border-slate-200 dark:border-slate-800 py-4"}>
      <div class={"max-w-3xl mx-auto flex items-center px-5"}>
        <a class={"text-xl font-bold mr-4"} href="/">e45g</a>
        <ul class={"flex items-center"}>
          <li class={"mx-4"}><a class={"py-2 hover:underline"} href="/article/a">About</a></li>
          <li class={"mx-4"}><a class={"py-2 hover:underline"} href="/article/b">Contact</a></li>
        </ul>
      </div>
    </nav>

    <div class={"max-w-3xl mx-auto px-5 flex flex-col"}>
         <Slot/>
    </div>
  </>;
});

