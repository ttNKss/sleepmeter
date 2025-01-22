'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [genki, setGenki] = useState<number>(100)
  const [useCurrentTime, setUseCurrentTime] = useState<boolean>(true)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [manualTime, setManualTime] = useState<Date | null>(null)
  const [wakeUpTime, setWakeUpTime] = useState<Date | null>(null)
  const [predictedGenki, setPredictedGenki] = useState<number>(0)
  const [isOk, setIsOk] = useState<boolean>(false)

  useEffect(() => {
    // 初期値の設定
    const now = new Date()
    setCurrentTime(now)
    setManualTime(now)

    const target = new Date()
    target.setHours(7, 0, 0, 0)
    if (now.getHours() >= 7) {
      target.setDate(target.getDate() + 1)
    }
    setWakeUpTime(target)

    // 現在時刻を1秒ごとに更新
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
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
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <div className='flex flex-col gap-4 w-full max-w-md'>
          <div>
            <label className='block mb-2'>現在のげんき（0-150%）:</label>
            <input
              type='number'
              min='0'
              max='150'
              value={genki}
              onChange={e => setGenki(Number(e.target.value))}
              className='w-full p-2 border rounded'
            />
          </div>

          <div>
            <label className='block mb-2'>時間設定:</label>
            <div className='flex gap-4'>
              <label>
                <input
                  type='radio'
                  checked={useCurrentTime}
                  onChange={() => setUseCurrentTime(true)}
                />{' '}
                現在時刻を使用
              </label>
              <label>
                <input
                  type='radio'
                  checked={!useCurrentTime}
                  onChange={() => setUseCurrentTime(false)}
                />{' '}
                時間を指定
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
              className='w-full p-2 border rounded mt-2'
            />
            <p className='mt-2 text-sm text-gray-600'>
              現在時刻:{' '}
              {currentTime?.toLocaleString('ja-JP') || '読み込み中...'}
            </p>
          </div>

          <div>
            <label className='block mb-2'>起床時間:</label>
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
              className='w-full p-2 border rounded'
            />
          </div>

          <div className='mt-4 p-4 bg-gray-100 rounded'>
            <p>予測げんき: {predictedGenki}%</p>
            <p
              className={`font-bold ${isOk ? 'text-green-600' : 'text-red-600'}`}
            >
              判定: {isOk ? 'OK' : 'NG'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
