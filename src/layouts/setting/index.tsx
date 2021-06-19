import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import Button from 'src/components/Button'

import { ConfigForm, loadConfig, form2Config, saveConfig } from 'src/config'

import './index.css'

const MIN_WIDTH = 10
const MAX_WIDTH = 99
const MIN_HEIGHT = 10
const MAX_HEIGHT = 99

export default () => {
  const config = loadConfig()
  console.log('config', config)

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

  console.log(watch('diffculty'))

  const customDiffcultyNode = (
    <div className="custom-diffculty">
      <div className="field">
        <label>宽度</label>
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
          {errors.width && <span>10～99</span>}
        </div>
      </div>

      <div className="field">
        <label>高度</label>
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
          {errors.height && <span>10～99</span>}
        </div>
      </div>

      <div className="field">
        <label>雷数</label>
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
        <h1>关于</h1>
        <p>Vec Minesweeper -Definitive Edition-</p>
        <p>Version: {`${process.env.REACT_APP_VERSION}`}</p>
      </article>

      <h1>难度设定</h1>
      <form className="setting-form" onSubmit={handleSubmit(onSubmit)}>
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
                <span className="d-title">简单</span>
              </div>
              <div className="d-desc">谁都能玩的程度</div>
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
                <span className="d-title">困难</span>
              </div>
              <div className="d-desc">需要点功夫</div>
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
                <span className="d-title">大佬</span>
              </div>
              <div className="d-desc">能玩完这关才好意思说自己会玩扫雷</div>
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
                <span className="d-title">自定义</span>
              </div>
              <div className="d-desc">骨灰级玩家最爱的</div>
            </label>
          </div>

          <div className="diff-custom">
            {watch('diffculty') === 'CUSTOM' && customDiffcultyNode}
          </div>
        </div>

        <Button style={{ margin: '50px 0', width: '150px' }} type="submit">
          保存并返回
        </Button>
      </form>
    </div>
  )
}
