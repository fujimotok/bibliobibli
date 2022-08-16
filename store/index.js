export const state = () => ({
  searchCount: 0,
})

export const mutations = {
  CHANGE_SEARCH_COUNT (state, value) {
    state.searchCount = value
  },
}
