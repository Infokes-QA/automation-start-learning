import type { PageContext } from "../fixtures/pages.fixture";

/** Builds a lightweight page context so step definitions can reuse helper APIs. */
export function getPageContext(page: any, pages: any): PageContext {
  return {
    page,
    pages,
  };
};