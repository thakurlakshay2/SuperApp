import _axios, { AxiosPromise, AxiosRequestConfig } from "axios";

export default function axios<T>(config: AxiosRequestConfig) {
  return _axios(config) as AxiosPromise<T>;
}
