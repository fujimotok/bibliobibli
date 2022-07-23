export const state = () => ({
  title: "",
  searchCount: 0,
  isShowSearch: true,
  isShowAdd: true,
  isShowSave: false,
  isShowDel: false,
  isShowBack: false,
})

export const mutations = {
  CHANGE_TITLE (state, value) {
    state.title = value
  },
  CHANGE_SEARCH_COUNT (state, value) {
    state.searchCount = value
  },
  CHANGE_IS_SHOW_SEARCH (state, value) {
    state.isShowSearch = value
  },
  CHANGE_IS_SHOW_ADD (state, value) {
    state.isShowAdd = value
  },
  CHANGE_IS_SHOW_SAVE (state, value) {
    state.isShowSave = value
  },
  CHANGE_IS_SHOW_DEL (state, value) {
    state.isShowDel= value
  },
  CHANGE_IS_SHOW_BACK (state, value) {
    state.isShowBack= value
  },
}
