export const state = () => ({
  title: "",
  searchCount: 0,
  isShowLeftMenu: true,
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
  CHANGE_IS_SHOW_LEFT_MENU (state, value) {
    state.isShowLeftMenu = value
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
