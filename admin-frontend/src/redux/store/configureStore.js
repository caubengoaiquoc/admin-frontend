import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from '../rootSaga';
import { uiReducer } from '../ui/reducer';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { authReducer } from '../auth/reducer';
import { userReducer, userStaffReducer } from '../user/reducer';
import { packageReducer } from '../package/reducer';
import { serviceReducer } from '../service/reducer';
import { customerReducer } from '../customer/reducer';
import { staffReducer,doctorReducer } from '../staff/reducer';
import { statisticReducer } from '../statistic/reducer';
import { formReducer } from '../form/reducer';
import { notifyReducer } from '../notification/reducer';
import { emailReducer } from '../email/reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'] // only navigation will be persisted
};

const rootReducers = combineReducers({
  loadingBar: loadingBarReducer,
  auth: authReducer,
  ui: uiReducer,
  user: userReducer,
  package: packageReducer,
  userStaff: userStaffReducer,
  service: serviceReducer,
  staff: staffReducer,
  doctor: doctorReducer,
  statistic: statisticReducer,
  customer: customerReducer,
  form: formReducer,
  notify: notifyReducer,
  email: emailReducer
});

const saga = createSagaMiddleware();
const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = createStore(persistedReducer, applyMiddleware(saga));
saga.run(rootSaga);

export default () => {
  let persistor = persistStore(store);
  return { store, persistor };
};
