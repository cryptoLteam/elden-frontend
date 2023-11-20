import { useModal } from '@pancakeswap/uikit'
import { STABLE_PAIRS } from 'config/constants/stablePairs'
import { EsNFTCardRow } from 'components/EsNFTCardRow'
import { EsNFTControlModal } from './EsNFTControlModal'
import { EsNFTData, useEsNFTCardData } from '../hooks/useEsNFTCardData'

interface EsNFTCardProps {
  esNft: any
  ethPrice: any
  runePoolApr?: any
}

const EsNFTCard = ({ esNft, ethPrice, runePoolApr = undefined }: EsNFTCardProps) => {
  const { data, refetchContracts: onRefetchNftData } = useEsNFTCardData({ esNft, ethPrice })

  // eslint-disable-next-line
  let _esNft = esNft
  if (_esNft.pool.pair === null) {
    for (let i = 0; i < STABLE_PAIRS.length; i++) {
      if (STABLE_PAIRS[i].id.toLowerCase() === _esNft.pool.pairAddress) {
        _esNft.pool.pair = STABLE_PAIRS[i]
        break
      }
    }
  }

  const [onPresentTransactionsModal] = useModal(
    <EsNFTControlModal data={data as EsNFTData} onRefetchNftData={onRefetchNftData} />,
  )

  return data === undefined ? (
    <></>
  ) : (
    <EsNFTCardRow data={data} runePoolApr={runePoolApr} onClick={onPresentTransactionsModal} />
  )
}

export default EsNFTCard
