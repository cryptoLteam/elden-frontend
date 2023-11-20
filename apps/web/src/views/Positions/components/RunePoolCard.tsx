import { useModal } from '@pancakeswap/uikit'
import { EsNFTCardRow } from 'components/EsNFTCardRow'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import { useLpPrice } from 'hooks/useLpPirce'
import { useStableLpPrice } from 'hooks/useStableLpPirce'
import { useRunePoolApr } from 'hooks/useRunePoolApr'
import { EsNFTControlModal } from './EsNFTControlModal'
import { EsNFTData, useEsNFTCardData } from '../hooks/useEsNFTCardData'

interface RunePoolCardProps {
  runeStakingPosition: any
  ethPrice: any
  runePoolApr?: any
}

const RunePoolCard = ({ runeStakingPosition, ethPrice }: RunePoolCardProps) => {
  const { data, refetchContracts: refetchNftData } = useEsNFTCardData({
    esNft: runeStakingPosition.nftStakingPosition,
    ethPrice,
  })
  const rewardsToken1Price = useTokenPriceBaseStableCoin(runeStakingPosition?.runePool?.rewardsToken0.id as string)
  const rewardsToken2Price = useTokenPriceBaseStableCoin(runeStakingPosition?.runePool?.rewardsToken1.id as string)

  const { lpPrice: stableLpPrice } = useStableLpPrice(runeStakingPosition.nftStakingPosition.pool.pair)
  const { lpPrice: v2LpPrice } = useLpPrice(
    runeStakingPosition.nftStakingPosition.pool.pair.token0.id,
    runeStakingPosition.nftStakingPosition.pool.pairAddress as string,
  )

  const lpPrice = runeStakingPosition.nftStakingPosition.pool.pair.router === undefined ? v2LpPrice : stableLpPrice

  const { apr1, apr2 } = useRunePoolApr(
    runeStakingPosition.runePool.id,
    lpPrice,
    rewardsToken1Price,
    rewardsToken2Price,
    runeStakingPosition.runePool?.rewardsToken0.decimals,
    runeStakingPosition.runePool?.rewardsToken1.decimals,
  )
  const [onPresentTransactionsModal] = useModal(
    <EsNFTControlModal
      data={data as EsNFTData}
      runeStakingPosition={runeStakingPosition}
      onRefetchNftData={refetchNftData}
      runePoolApr={{ apr1, apr2 }}
    />,
  )

  return data === undefined ? (
    <></>
  ) : (
    <EsNFTCardRow
      data={data}
      runePoolApr={{ apr1, apr2 }}
      isStakedInRunePool={true}
      onClick={onPresentTransactionsModal}
    />
  )
}

export default RunePoolCard
