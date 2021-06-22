import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      PlayingTips: 'Please click "<1></1>"',
      '胜败乃兵家常事，大侠请重新来过': 'YOU LOSE',
      无序连败早该管管了: '😥',
      '✌️你赢了': '✌️YOU WIN',
      '✌️赢麻了': 'WIN WIN WIN WIN WIN',
      '✌️四赢': '✌️WIN 4 times',
      '✌️三赢': '✌️WIN 3 times',
      '✌️双赢': '✌️WIN twice',
      再来一把: 'Replay',
      关于: 'About',
      宽度: 'Width',
      高度: 'Height',
      雷数: 'Bomb number',

      难度设定: 'Diffculty',
      简单: 'EASY',
      谁都能玩的程度: 'anyone',

      困难: 'HARD',
      需要点功夫: 'need patience',

      大佬: 'PROFESSIONAL',
      能玩完这关才好意思说自己会玩扫雷: 'Minesweeper expert',

      自定义: 'CUSTOM',
      骨灰级玩家最爱的: 'to Fanatic',

      其它的一些设定: 'Other setting',
      边缘不放置地雷: 'no mines on edge',
      可以避免这种情况: 'can skip this case',
      保存并返回: 'save & back',
    },
  },

  'zh-Hant': {
    translation: {
      PlayingTips: '點擊<1></1>就完事了',
      '胜败乃兵家常事，大侠请重新来过': '勝敗乃兵家常事，大俠請重新來過',
      无序连败早该管管了: '無序連敗早該管管了',
      '✌️你赢了': '✌️你贏了',
      '✌️赢麻了': '✌️贏麻了',
      '✌️四赢': '✌️四贏',
      '✌️三赢': '✌️三贏',
      '✌️双赢': '✌️雙贏',
      再来一把: '再來一局',
      关于: '關於',
      宽度: '寬度',
      高度: '高度',
      雷数: '雷數',

      难度设定: '難度設定',
      简单: '簡單',
      谁都能玩的程度: '誰都能玩的程度',

      困难: '困難',
      需要点功夫: '需要點功夫',

      大佬: '高手',
      能玩完这关才好意思说自己会玩扫雷: '能玩完這關才好意思說自己會玩掃雷',

      自定义: '自定義',
      骨灰级玩家最爱的: '骨灰級玩家最愛的',

      其它的一些设定: '其它的一些設定',
      边缘不放置地雷: '邊緣不放置地雷',
      可以避免这种情况: '可以避免這種情況',
      保存并返回: '保存並返回',
    },
  },

  ja: {
    translation: {
      PlayingTips: '<1></1>をクリックしてください',
      '胜败乃兵家常事，大侠请重新来过': '失敗した',
      无序连败早该管管了: '満身創痍',
      '✌️你赢了': '勝ちだ！',
      '✌️赢麻了': '凄い！連続勝利５回以上',
      '✌️四赢': '四回勝ち',
      '✌️三赢': '三回勝ち',
      '✌️双赢': '二回勝ち',
      再来一把: 'もう一回',
      关于: 'このゲームについて',
      宽度: '宽度',
      高度: '高度',
      雷数: '地雷数',

      难度设定: '難易度調整',
      简单: '簡単',
      谁都能玩的程度: '誰でも遊べるのレベル',

      困难: '困難',
      需要点功夫: 'ある努力が必要、ちょっと難しいのレベル',

      大佬: '達者',
      能玩完这关才好意思说自己会玩扫雷:
        'このレベルをクリアしたら、”マインスイーパ分かる”と言うのはできるでしょ',

      自定义: 'カスタム',
      骨灰级玩家最爱的: 'マインスイーパ マニアのあなたへ',

      其它的一些设定: '他の設定',
      边缘不放置地雷: '边缘のマスが地雷放置禁止',
      可以避免这种情况: 'こういう状況が回避できる',
      保存并返回: 'セーブして戻る',
    },
  },
}

export default i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,

    detection: {
      order: [
        // 'querystring',
        // 'cookie',
        'localStorage',
        // 'sessionStorage',
        'navigator',
        // 'htmlTag',
        // 'path',
        // 'subdomain',
      ],
    },

    interpolation: {
      escapeValue: false,
    },
  })
