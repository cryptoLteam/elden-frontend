import { useCallback } from 'react'
import { useSEldenContract } from 'hooks/useContract1'

const options = {}

const convertElden = async (sEldenContract, amountToConvert) => {
  return sEldenContract.write.convert([amountToConvert], { ...options })
}

const useConvertElden = () => {
  const sEldenContract = useSEldenContract()

  const handleConvert = useCallback(
    async (amountToConvert) => {
      return convertElden(sEldenContract, amountToConvert)
    },
    [sEldenContract],
  )

  return { onConvert: handleConvert }
}

export default useConvertElden
