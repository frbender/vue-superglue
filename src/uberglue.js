import sticky from './sticky';

export default {
  install(Vue) {
    Vue.directive('sticky', sticky);
  },
};
