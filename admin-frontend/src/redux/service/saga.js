import { put, takeLatest, select } from 'redux-saga/effects';
import { openLoading, closeLoading } from '../ui';
import { NotificationManager } from 'react-notifications';
import _ from "lodash"
import { saveService, getService, saveServiceCategory, getServiceCategory, saveServiceRequest, getServiceRequest } from '.';
import sService from '../../service/sService';
import { GET_SERVICE, ADD_SERVICE, EDIT_SERVICE, GET_SERVICE_CATEGORY, ADD_SERVICE_CATEGORY, EDIT_SERVICE_CATEGORY, GET_SERVICE_REQUEST, EDIT_SERVICE_REQUEST } from './action';


function* watchGetServicesWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.getService(action.data, token);
        if(!_.isEmpty(result?.services?.result)){
            yield put(saveService(result?.services?.result));

        } else {
            yield put(saveService([]));

        }
    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}


function* watchAddServicesWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.addService(action.data, token);
        if(!_.isEmpty(result)){
            const data = { itemsPage: 5, page: 1, query: '', active: '' }
            yield put(getService(data))
            NotificationManager.success('Thêm thành công', 'Thông báo')
        }

    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

function* watchEditServicesWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.editService(action.data, token);
        if(!_.isEmpty(result)){
            const data = { itemsPage: 5, page: 1, query: '', active: '' }
            yield put(getService(data))
            NotificationManager.success('Sửa thành công', 'Thông báo')
        }

    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

function* watchGetServicesCategoryWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.getServiceCategory(action.data, token);
        if(!_.isEmpty(result?.categorires)){
            yield put(saveServiceCategory(result?.categorires));

        } else {
            yield put(saveServiceCategory([]));

        }
    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

function* watchAddServiceCategoryWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.addServiceCategory(action.data, token);
        if(!_.isEmpty(result)){
            const data = { itemsPage: 5, page: 1, query: '', active: '' }
            yield put(getServiceCategory(data))
            NotificationManager.success('Thêm thành công', 'Thông báo')
        }

    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

function* watchEditServiceCategoryWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.editServiceCategory(action.data, token);
        if(!_.isEmpty(result)){
            const data = { itemsPage: 5, page: 1, query: '', active: '' }
            yield put(getServiceCategory(data))
            NotificationManager.success('Thêm thành công', 'Thông báo')
        }

    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

function* watchGetServiceRequestWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.getServiceRequest(action.data, token);
        if(!_.isEmpty(result?.serviceRequest)){
            yield put(saveServiceRequest(result?.serviceRequest))
        } else {
            yield put(saveServiceRequest([]))

        }
    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

function* watchEditServiceRequestWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.editServiceRequest(action.data, token);
        if(!_.isEmpty(result)){
            const data = { itemsPage: 5, page: 1, query: '' }
            yield put(getServiceRequest(data))
            NotificationManager.success('Sửa thành công', 'Thông báo')
        } 
    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}



export function* serviceSaga() {
    yield takeLatest(GET_SERVICE, watchGetServicesWorker);
    yield takeLatest(ADD_SERVICE, watchAddServicesWorker);
    yield takeLatest(EDIT_SERVICE, watchEditServicesWorker);
    yield takeLatest(GET_SERVICE_CATEGORY, watchGetServicesCategoryWorker);
    yield takeLatest(ADD_SERVICE_CATEGORY, watchAddServiceCategoryWorker);
    yield takeLatest(EDIT_SERVICE_CATEGORY, watchEditServiceCategoryWorker);
    yield takeLatest(GET_SERVICE_REQUEST, watchGetServiceRequestWorker);
    yield takeLatest(EDIT_SERVICE_REQUEST, watchEditServiceRequestWorker);
}