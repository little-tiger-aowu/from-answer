import axios from 'axios';
import { Toast } from 'vant';
// import { getToken } from '@/utils/auth';
// import store from '@/store';
// import qs from 'qs';
import baseURL from './baseUrl'
import router from '@/router'
// import {getCookie} from "@/utils/auth"

const service = axios.create({
  baseURL: baseURL,
  timeout: 50000, // 请求超时时间
  transformRequest: [function (data) {
    if (Object.prototype.toString.call(data) === '[object FormData]') {
      return data
    }
    
   
    data = JSON.stringify(data);
    // console.log(data);
    return data;
  }]
});

// request拦截器
service.interceptors.request.use(
   config => {
      // let token = store.getters['user/token']
      // config.headers['Authorization'] = token;
      config.headers['Content-Type'] = 'application/json';
      // config.headers['Authorization'] = getCookie();
      return config;
  },
  error => {
    // Do something with request error
    // console.log(error); // for debug
    Promise.reject(error);
  }
);

let toastFail,errorFail;
// respone拦截器
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (errorFail) {
      errorFail.clear();
    }
    console.dir(error); // for debug
    errorFail = Toast.fail('网络请求超时！')
    return Promise.reject(error);
  }
);

export default service;
