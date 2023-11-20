import { useModal } from '@pancakeswap/uikit'
import { EsNFTCardRow } from 'components/EsNFTCardRow'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import { useLpPrice } from 'hooks/useLpPirce'
import { useRunePoolApr } from 'hooks/useRunePoolApr'
import { EsNFTControlModal } from 'views/Positions/components/EsNFTControlModal'
import { EsNFTData, useEsNFTCardData } from 'views/Positions/hooks/useEsNFTCardData'

interface RunePoolCardProps {
  runeStakingPosition: any
  ethPrice: any
  runePoolApr?: any
}

const RunePoolCard = ({ runeStakingPosition, runePoolApr, ethPrice }: RunePoolCardProps) => {
  const { data, refetchContracts: refetchNftData } = useEsNFTCardData({
    esNft: runeStakingPosition.nftStakingPosition,
    ethPrice,
  })

  const [onPresentTransactionsModal] = useModal(
    <EsNFTControlModal
      data={data as EsNFTData}
      runeStakingPosition={runeStakingPosition}
      onRefetchNftData={refetchNftData}
      runePoolApr={runePoolApr}
    />,
  )

  return data === undefined ? (
    <></>
  ) : (
    <EsNFTCardRow
      data={data}
      runePoolApr={runePoolApr}
      isStakedInRunePool={true}
      onClick={onPresentTransactionsModal}
    />
  )
}

export default RunePoolCard
