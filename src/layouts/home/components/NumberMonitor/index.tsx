import Cell from 'src/components/Cell'

const createEmptyArray = (len: number) => Array.from(Array(len))

export default function NumberMonitor({
  len,
  str,
}: {
  len: number
  str: string
}) {
  const digitList = createEmptyArray(len)
    .map((_, idx) => str.split('').reverse()[idx])
    .reverse()

  return (
    <div className="row">
      {digitList.map((n, id) => {
        return <Cell key={id} innerType={'hollow'} innerContent={n} />
      })}
    </div>
  )
}
