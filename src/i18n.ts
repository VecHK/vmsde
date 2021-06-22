import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
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
