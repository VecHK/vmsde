import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Button from 'src/components/Button'
import Cell from 'src/components/Cell'

import { ConfigForm, loadConfig, form2Config, saveConfig } from 'src/config'
import { CreateVMSByMData } from 'src/vms-logic'
import GameMap from '../home/components/GameMap'

import './index.css'

const MIN_WIDTH = 10
const MAX_WIDTH = 99
const MIN_HEIGHT = 10
const MAX_HEIGHT = 99

function CellLine({ str }: { str: string }) {
  return (
    <div className="row" style={{ justifyContent: 'flex-start' }}>
      {str.split('').map((ch, idx) => (
        <Cell
          key={idx}
          innerType="hollow"
          innerContent={ch}
          nColor={Math.floor(Math.random() * 10) as 0}
        />
      ))}
    </div>
  )
}

function PrintStringCell({ str }: { str: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const handler = setInterval(() => {
      setCount((c) => c + 1)
    }, 1000)

    return () => clearInterval(handler)
  })

  const lines = str.split('\n')

  return (
    <div className="about-logo">
      {lines.map((line, idx) => {
        return <CellLine key={`${count} + ${idx}`} str={line} />
      })}
    </div>
  )
}

export default () => {
  const { t } = useTranslation()
  const config = loadConfig()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ConfigForm>({ defaultValues: config })
  const onSubmit = (data: ConfigForm) => {
    console.warn('onsubmit', data)

    const newConfig = form2Config(data)
    saveConfig(newConfig)
    location.replace('#?t=Home')
  }

  const maxBomb = Number(watch('width')) * Number(watch('height')) - 1
  if (Number(watch('bomb_number')) > maxBomb) {
    setValue('bomb_number', maxBomb)
  } else if (Number(watch('bomb_number')) < 1) {
    setValue('bomb_number', 1)
  }

  const customDiffcultyNode = (
    <div className="custom-diffculty">
      <div className="field">
        <label>{t('宽度')}</label>
        <div>
          <input
            className="c-input"
            type="number"
            defaultValue={config.width}
            {...register('width', {
              required: true,
              min: MIN_WIDTH,
              max: MAX_WIDTH,
            })}
          />
          {errors.width && (
            <span>
              {MIN_WIDTH}～{MAX_WIDTH}
            </span>
          )}
        </div>
      </div>

      <div className="field">
        <label>{t('高度')}</label>
        <div>
          <input
            className="c-input"
            type="number"
            defaultValue={config.height}
            {...register('height', {
              required: true,
              min: MIN_HEIGHT,
              max: MAX_HEIGHT,
            })}
          />
          {errors.height && (
            <span>
              {MIN_HEIGHT}～{MAX_HEIGHT}
            </span>
          )}
        </div>
      </div>

      <div className="field">
        <label>{t('雷数')}</label>
        <div>
          <input
            className="c-input"
            type="number"
            defaultValue={config.bomb_number}
            {...register('bomb_number', {
              required: true,
              min: 1,
              max: maxBomb,
            })}
          />
          {errors.bomb_number && <span>1～{maxBomb}</span>}
        </div>
      </div>
    </div>
  )

  return (
    <div className="setting">
      <article className="about">
        <h1>{t('关于')}</h1>
        <PrintStringCell
          str={'Mine      \nSweeper   \nDefinitive\nEdition   '}
        />
        <PrintStringCell str={`          `} />
        <PrintStringCell str={`Ver ${process.env.REACT_APP_VERSION} `} />
      </article>

      <form className="setting-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="multi-col">
          <div className="sf-col">
            <h1>{t('难度设定')}</h1>
            <div className="diffculty-setting">
              <div className="diff-select">
                <label>
                  <div className="ds-title">
                    <input
                      className="c-ratio"
                      type="radio"
                      {...register('diffculty')}
                      defaultValue="EASY"
                    />
                    <span className="my-ratio"></span>
                    <span className="d-title">{t('简单')}</span>
                  </div>
                  <div className="d-desc">{t('谁都能玩的程度')}</div>
                </label>
                <label>
                  <div className="ds-title">
                    <input
                      className="c-ratio"
                      type="radio"
                      {...register('diffculty')}
                      defaultValue="HARD"
                    />
                    <span className="my-ratio"></span>
                    <span className="d-title">{t('困难')}</span>
                  </div>
                  <div className="d-desc">{t('需要点功夫')}</div>
                </label>
                <label>
                  <div className="ds-title">
                    <input
                      className="c-ratio"
                      type="radio"
                      {...register('diffculty')}
                      defaultValue="LUNATIC"
                    />
                    <span className="my-ratio"></span>
                    <span className="d-title">{t('大佬')}</span>
                  </div>
                  <div className="d-desc">
                    {t('能玩完这关才好意思说自己会玩扫雷')}
                  </div>
                </label>

                <label>
                  <div className="ds-title">
                    <input
                      className="c-ratio"
                      type="radio"
                      {...register('diffculty')}
                      defaultValue="CUSTOM"
                    />
                    <span className="my-ratio"></span>
                    <span className="d-title">{t('自定义')}</span>
                  </div>
                  <div className="d-desc">{t('骨灰级玩家最爱的')}</div>
                </label>
              </div>

              <div className="diff-custom">
                {watch('diffculty') === 'CUSTOM' && customDiffcultyNode}
              </div>
            </div>
          </div>

          <div className="sf-col">
            <h1 className="other-setting-h1">{t('其它的一些设定')}</h1>
            <div className="field">
              <label>
                <div className="ds-title">
                  <input
                    className="c-ratio"
                    type="checkbox"
                    {...register('edge_bomb')}
                    defaultValue={1}
                  />
                  <span className="my-ratio"></span>
                  <span className="d-title">{t('边缘不放置地雷')}</span>
                </div>
                <div
                  className="d-desc"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                  }}
                >
                  <div>{t('可以避免这种情况')}</div>
                  <GameMap
                    status="WIN"
                    vms={CreateVMSByMData({
                      width: 5,
                      height: 4,
                      mData: '__!__\n__?__\n_XXX_\n_____',
                    })}
                    setVMS={() => {
                      //
                    }}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
        <Button style={{ margin: '50px 0', width: '150px' }} type="submit">
          {t('保存并返回')}
        </Button>
      </form>
    </div>
  )
}
