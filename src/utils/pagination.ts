export const ITEMS_PER_PAGE_1 = 23;
export const ITEMS_PER_PAGE_2 = 23;
export const FOOTER_THRESHOLD_1 = 11;
export const FOOTER_THRESHOLD_2 = 40;

export const calculateTotalPages = (totalItems: number): number => {
  if (totalItems > FOOTER_THRESHOLD_2) {
    return Math.ceil((totalItems - FOOTER_THRESHOLD_2) / ITEMS_PER_PAGE_2) + 3;
  }
  return totalItems > FOOTER_THRESHOLD_1 ? 2 : 1;
};

export const getItemsForPage = (items: any[], pageNumber: number) => {
  if (pageNumber === 1) {
    return items.slice(0, ITEMS_PER_PAGE_1);
  } else if (pageNumber === 2) {
    return items.slice(ITEMS_PER_PAGE_1, FOOTER_THRESHOLD_2);
  }
  return items.slice(FOOTER_THRESHOLD_2);
};

export const shouldShowFooterOnPage = (totalItems: number, pageNumber: number): boolean => {
  if (pageNumber === 1) {
    return totalItems <= FOOTER_THRESHOLD_1;
  } else if (pageNumber === 2) {
    return totalItems > FOOTER_THRESHOLD_1 && totalItems <= FOOTER_THRESHOLD_2;
  }
  return totalItems > FOOTER_THRESHOLD_2;
};