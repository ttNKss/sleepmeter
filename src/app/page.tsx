'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [genki, setGenki] = useState<number>(100)
  const [useCurrentTime, setUseCurrentTime] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [manualTime, setManualTime] = useState<Date | null>(null)
  const [wakeUpTime, setWakeUpTime] = useState<Date | null>(null)
  const [predictedGenki, setPredictedGenki] = useState<number>(0)
  const [isOk, setIsOk] = useState<boolean>(false)

  useEffect(() => {
    // 初期値の設定
    const now = new Date()

    // 現在時刻
    setCurrentTime(now)
    // 1秒ごとに更新する
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // 手動時刻
    const manualInitialTime = new Date()
    manualInitialTime.setHours(22, 0, 0, 0)
    setManualTime(manualInitialTime)

    // 起床時刻
    const target = new Date()
    target.setHours(7, 0, 0, 0)
    if (now.getHours() >= 7) {
      target.setDate(target.getDate() + 1)
    }
    setWakeUpTime(target)

    return () => clearInterval(timer)
  }, [])

  // 時刻が設定されるまでは計算しない
  useEffect(() => {
    if (!currentTime || !manualTime || !wakeUpTime) return

    // げんきの予測値を計算
    const timeDiff =
      wakeUpTime.getTime() -
      (useCurrentTime ? currentTime : manualTime).getTime()

    // 時差がマイナス（起床時間が前）の場合は変化なし
    if (timeDiff <= 0) {
      setPredictedGenki(genki)
      setIsOk(genki >= 80)
      return
    }

    const minutesDiff = Math.floor(timeDiff / (1000 * 60))
    const decreaseAmount = Math.floor(minutesDiff / 10)
    const predicted = Math.max(0, Math.min(150, genki - decreaseAmount))
    setPredictedGenki(predicted)
    setIsOk(predicted >= 80)
  }, [currentTime, manualTime, wakeUpTime, genki, useCurrentTime])

  const addJSTOffset = (date: Date) => {
    return new Date(date.getTime() + 9 * 60 * 60 * 1000)
  }

  return (
    <div className='min-h-screen bg-base-100 p-8 pb-20 sm:p-20'>
      <main className='container mx-auto'>
        <div className='card bg-base-200 shadow-xl max-w-md mx-auto p-6'>
          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text'>現在のげんき（0-150%）:</span>
            </label>
            <input
              type='range'
              min='0'
              max='150'
              value={genki}
              onChange={e => setGenki(Number(e.target.value))}
              className='range range-primary'
            />
            <div className='text-center mt-2'>
              <span className='text-2xl font-bold'>{genki}%</span>
            </div>
          </div>
          <div className='form-control w-full mt-4'>
            <label className='label'>
              <span className='label-text'>時刻設定:</span>
            </label>
            <div className='flex gap-4'>
              <label className='label cursor-pointer'>
                <input
                  type='radio'
                  name='time-setting'
                  className='radio radio-primary'
                  checked={!useCurrentTime}
                  onChange={() => setUseCurrentTime(false)}
                />
                <span className='label-text ml-2'>時刻を指定</span>
              </label>
              <label className='label cursor-pointer'>
                <input
                  type='radio'
                  name='time-setting'
                  className='radio radio-primary'
                  checked={useCurrentTime}
                  onChange={() => setUseCurrentTime(true)}
                />
                <span className='label-text ml-2'>現在時刻を使用</span>
              </label>
            </div>
            <input
              type='datetime-local'
              value={
                manualTime
                  ? addJSTOffset(manualTime).toISOString().slice(0, 16)
                  : ''
              }
              onChange={e => {
                setManualTime(new Date(e.target.value))
              }}
              disabled={useCurrentTime}
              className='input input-bordered w-full mt-2'
            />
            <p className='text-sm opacity-70 mt-2'>
              現在時刻:{' '}
              {currentTime?.toLocaleString('ja-JP') || '読み込み中...'}
            </p>
          </div>

          <div className='form-control w-full mt-4'>
            <label className='label'>
              <span className='label-text'>起床時刻:</span>
            </label>
            <input
              type='datetime-local'
              value={
                wakeUpTime
                  ? addJSTOffset(wakeUpTime).toISOString().slice(0, 16)
                  : ''
              }
              onChange={e => {
                setWakeUpTime(new Date(e.target.value))
              }}
              className='input input-bordered w-full'
            />
          </div>

          <div className='alert mt-6'>
            <div>
              <h3 className='font-bold'>予測げんき: {predictedGenki}%</h3>
              <div
                className={`text-lg ${isOk ? 'text-success' : 'text-error'}`}
              >
                {isOk ? '交換OK!' : '交換NG'}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
