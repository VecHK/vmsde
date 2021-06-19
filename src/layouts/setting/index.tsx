import { useForm } from 'react-hook-form'
import { ConfigForm, loadConfig, form2Config, saveConfig } from 'src/config'

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

  return (
    <form className="setting" onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <div>宽度：</div>
        <div>
          <input
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
        <div>高度：</div>
        <div>
          <input
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
        <div>雷数：</div>
        <div>
          <input
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

      <input type="submit" value="保存" />
    </form>
  )
}
