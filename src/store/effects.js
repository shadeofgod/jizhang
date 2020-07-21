import { actionsTypes, fetchDataDone } from './actions';
import { fetchAllBills, fetchAllCategories } from '../apis';

export const effects = {
  [actionsTypes.FETCH_DATA]: async (_, { dispatch }) => {
    try {
      const [{ result: bills }, { result: categories }] = await Promise.all([
        fetchAllBills(),
        fetchAllCategories(),
      ]);

      dispatch(fetchDataDone(bills, categories));
    } catch (e) {
      // TODO error handling
    }
  },
};
