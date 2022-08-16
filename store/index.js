export const state = () => ({
  listTitle: "",
  contentTitle: "",
  searchCount: 0,
  hasHeader: true,
})

export const mutations = {
  CHANGE_LIST_TITLE (state, value) {
    state.listTitle = value
  },
  CHANGE_CONTENT_TITLE (state, value) {
    state.contentTitle = value
  },
  CHANGE_SEARCH_COUNT (state, value) {
    state.searchCount = value
  },
  CHANGE_HAS_HEADER (state, value) {
    state.hasHeader = value
  },
}
