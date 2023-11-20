import { useCallback } from 'react'
import { useDividendsContract, useSEldenContract } from 'hooks/useContract1'
import { useAccount } from 'wagmi'
import { DIVIDENDS_ADDRESS } from 'config/constants/elden'

const options = {}

const harvestAll = async (sEldenContract) => {
  return sEldenContract.write.harvestAllDividends([], { ...options })
}

const useHarvestAll = () => {
  const sEldenContract = useDividendsContract()

  const handleHarvestAll = useCallback(async () => {
    return harvestAll(sEldenContract)
  }, [sEldenContract])

  return { onHarvestAll: handleHarvestAll }
}

export default useHarvestAll
