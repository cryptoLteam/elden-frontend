import { Tag, useModal } from '@pancakeswap/uikit'
import { EsNFTCardRow } from 'components/EsNFTCardRow'
import { EsNFTData, useEsNFTCardData } from 'views/Positions/hooks/useEsNFTCardData'
import BoosterModal from './BoosterModal'

const EsNFTCard = ({ esNft, ethPrice, onRefetchData }) => {
  const { data, refetchContracts: refetchNftData } = useEsNFTCardData({ esNft, ethPrice })
  const [onPresentTransactionsModal] = useModal(
    <BoosterModal data={data as EsNFTData} onRefetchData={onRefetchData} onRefetchNftData={refetchNftData} />,
  )

  return <EsNFTCardRow data={data} onClick={onPresentTransactionsModal} />
}

export default EsNFTCard
