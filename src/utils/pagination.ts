export const ITEMS_PER_PAGE_1 = 15;
export const ITEMS_PER_PAGE_2 = 24;
export const ITEMS_PER_PAGE_3 = 24; // Define items per page for the third page
export const FOOTER_THRESHOLD_1 = 11;
export const FOOTER_THRESHOLD_2 = 30; // Footer for page 2
export const FOOTER_THRESHOLD_3 = 61; // Define threshold for the third page

export const calculateTotalPages = (totalItems: number): number => {
  if (totalItems > FOOTER_THRESHOLD_3) {
    return Math.ceil((totalItems - FOOTER_THRESHOLD_3) / ITEMS_PER_PAGE_3) + 3;
  } else if (totalItems > FOOTER_THRESHOLD_2) {
    return 3;
  } else if (totalItems > FOOTER_THRESHOLD_1) {
    return 2;
  }
  return 1;
};

export const getItemsForPage = (items: any[], pageNumber: number) => {
  if (pageNumber === 1) {
    return items.slice(0, ITEMS_PER_PAGE_1);
  } else if (pageNumber === 2) {
    // Adjust the slice to show items up to the 35th item
    return items.slice(ITEMS_PER_PAGE_1, Math.min(ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_2, 35));
  } else if (pageNumber === 3) {
    // Page 3 will show remaining items after the 30th
    return items.slice(FOOTER_THRESHOLD_2, FOOTER_THRESHOLD_3);
  }
  return items.slice(FOOTER_THRESHOLD_3);
};

export const shouldShowFooterOnPage = (totalItems: number, pageNumber: number): boolean => {
  if (pageNumber === 1) {
    return totalItems <= FOOTER_THRESHOLD_1;
  } else if (pageNumber === 2) {
    // Footer should jump to page 3 when items exceed 30
    return totalItems > FOOTER_THRESHOLD_1 && totalItems <= FOOTER_THRESHOLD_2;
  } else if (pageNumber === 3) {
    // Footer should appear on page 3 when item count exceeds 35
    return totalItems > FOOTER_THRESHOLD_2 && totalItems <= FOOTER_THRESHOLD_3;
  }
  return totalItems > FOOTER_THRESHOLD_3;
};
