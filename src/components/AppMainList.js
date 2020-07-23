import React from 'react';
import AppNewBillButton from './AppNewBillButton';
import AppMainListHeader from './AppMainListHeader';
import AppMainListFilters from './AppMainListFilters';
import AppMainListBills from './AppMainListBills';

function AppMainList() {
  return (
    <Fragment>
      <AppMainListHeader />
      <AppMainListFilters />
      <AppMainListBills />
      <AppNewBillButton />
    </Fragment>
  );
}

export default React.memo(AppMainList);
