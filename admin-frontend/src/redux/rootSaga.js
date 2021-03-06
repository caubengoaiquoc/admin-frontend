import { all } from 'redux-saga/effects';
import { uiSaga } from './ui/saga';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import { authSaga } from './auth/saga';
import { userSaga } from './user/saga';
import { packageSaga } from './package/saga';
import { serviceSaga } from './service/saga';
import { customerSaga } from './customer/saga';
import { staffSaga } from './staff/saga';
import { statisticSaga } from './statistic/saga';
import { formSaga } from './form/saga';
import { notifySaga } from './notification/saga';
import { emailSaga } from './email/saga';

export function* rootSaga() {
  yield all([
    loadingBarMiddleware(),
    authSaga(),
    uiSaga(),
    userSaga(),
    packageSaga(),
    serviceSaga(),
    staffSaga(),
    statisticSaga(),
    customerSaga(),
    formSaga(),
    notifySaga(),
    emailSaga()
  ]);
}
