import bills from '../data/bill.json';
import categories from '../data/categories.json';

// API MOCK

export async function fetchAllBills() {
  return await new Promise((resolve) => {
    return resolve({
      code: 0,
      result: bills,
    });
  });
}

export async function fetchAllCategories() {
  return await new Promise((resolve) =>
    resolve({
      code: 0,
      result: categories,
    })
  );
}
