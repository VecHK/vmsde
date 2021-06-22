import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './index.css'

function initLangCode() {
  let currentLangCode: string = localStorage.i18nextLng || 'zh-CN'
  if (currentLangCode === 'dev') {
    currentLangCode = 'zh-cn'
  }
  return currentLangCode
}

export default () => {
  const [currentLangCode, setCurrentLangCode] = useState(initLangCode())

  const langMap: Array<[string, RegExp, string]> = [
    ['汉', /zh/, 'zh'],
    ['あ', /ja/, 'ja'],
  ]

  const { i18n } = useTranslation()

  const selectedIdx = langMap.findIndex(([langIcon, exp]) => {
    return exp.test(currentLangCode)
  })

  const toggleLanguage = (currentIdx: number = selectedIdx) => {
    const nextLang = langMap[currentIdx + 1]
    if (nextLang) {
      setCurrentLangCode(nextLang[2])
      i18n.changeLanguage(nextLang[2])
    } else {
      toggleLanguage(-1)
    }
  }

  return (
    <div className="language-select" onClick={() => toggleLanguage()}>
      {langMap.map(([langIcon], idx) => {
        const isCurrent = selectedIdx === idx

        return (
          <span
            key={langIcon}
            className={`lang-icon ${isCurrent ? 'current' : ''}`}
          >
            {langIcon}
          </span>
        )
      })}
    </div>
  )
}
