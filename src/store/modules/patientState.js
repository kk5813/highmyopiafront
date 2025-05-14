export default {
    namespaced: true,
    state: {
      filters: {
        currentPage: -1,
        pageSize: 10,
        currentCommand: "",
        timeRange: [],
        diaDoctor: "",
        searchForm: {}
      }
    },
    mutations: {
      SET_FILTERS(state, payload) {
        state.filters = { ...state.filters, ...payload };
      }
    },
    getters: {
      getFilters: (state) => state.filters 
    }
  };