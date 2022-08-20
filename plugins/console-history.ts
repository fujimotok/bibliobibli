import Vue from 'vue'

// コンソールログを保持する変数
const history: string[] = []

// 元の関数を退避
const _log = console.log;
const _info = console.info;
const _warn = console.warn;
const _error = console.error;


// 新しい関数で上書き
console.log = (...args: any[]) => {
  history.push('l> ' + args.join(' '))
  _log.apply(console, args)
}

console.info = (...args: any[]) => {
  history.push('i> ' + args.join(' '))
  _info.apply(console, args);
}

console.warn = (...args: any[]) => {
  history.push('w> ' + args.join(' '))
  _warn.apply(console, args);
}

console.error = (...args: any[]) => {
  history.push('e> ' + args.join(' '))
  _error.apply(console, args)
}


// プラグインの型宣言
declare module 'vue/types/vue' {
  interface Vue {
    $logHistory(): string[]
  }
}

// プラグインとして登録
Vue.prototype.$logHistory = () => history
