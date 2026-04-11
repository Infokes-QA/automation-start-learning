import type { PageContext } from "../fixtures/pages.fixture";

export function getPageContext(page: any, pages: any): PageContext {
  return {
    page,
    pages,
  };
};