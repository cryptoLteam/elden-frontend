import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { Dots, Flex, Grid, Text, useModal } from '@pancakeswap/uikit'
import Page from 'views/Page'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import EButton from 'components/EButton'
import EBox from 'components/EBox'
import EPageHeader from 'components/EPageHeader'
import { ELDEN_ADDRESS } from 'config/constants/elden'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import { useLpPrice } from 'hooks/useLpPirce'
import { useStableLpPrice } from 'hooks/useStableLpPirce'
import useEsNFTListsByAccountAndPool from 'hooks/useEsNFTListsByAccountAndPool'
import useRunePoolStakingPositions from 'hooks/useRunePoolStakingPositions'
import useRunePoolData from 'hooks/useRunePoolData'
import { useRunePoolApr } from 'hooks/useRunePoolApr'
import { useEsNFTAprs } from 'hooks/useEsNFTAprs'
import { formatAmount } from 'utils/formatCurrencyAmount'
import { zeroAddress } from 'viem'

import HarvestModal from './components/HarvestModal'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'
import { useRewards } from './hooks/useRewards'
import RunePoolInfo from './components/RunePoolInfo'
import { isEnableToDeposit, isEnableToHarvest } from './helpers'
import PositionsList from './components/PositionTable'
import RunePoolCard from './components/RunePoolCard'

const EarnInfo = styled(Grid)`
  margin-top: 12px;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`
const EarnCard = styled(Flex)`
  flex-direction: column;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 4px 12px;
`

const RunePoolDetail = () => {
  const { address: account } = useAccount()
  const router = useRouter()
  const { poolId } = router.query

  const [averageApr, setAverageApr] = useState<number | undefined>(undefined)

  const { poolData, isLoading: isLoadingPoolData } = useRunePoolData(account, poolId as string, 30000)

  const rewardsToken1Price = useTokenPriceBaseStableCoin(poolData?.rewardsToken0.id as string)
  const rewardsToken2Price = useTokenPriceBaseStableCoin(poolData?.rewardsToken1.id as string)
  const eldenPrice = useTokenPriceBaseStableCoin(ELDEN_ADDRESS)

  const { lpPrice: stableLpPrice } = useStableLpPrice(poolData?.pair)
  const { lpPrice: v2LpPrice } = useLpPrice(poolData?.token0Address, poolData?.pairAddress as string)

  const lpPrice = poolData?.pair.router === undefined ? v2LpPrice : stableLpPrice

  const { isLoading: isLoadingEsNFTs, data: esNFTs } = useEsNFTListsByAccountAndPool(
    account,
    poolData?.nftPoolAddress as string,
    30000,
  )

  const { stakingPositions: runePoolStakingPositions, isLoading: isLoadingRunePoolStakingPositions } =
    useRunePoolStakingPositions(account, 30000, true, poolData?.id as string)

  const rewards = useRewards(
    poolData?.id,
    poolData?.rewardsToken0.decimals,
    poolData?.rewardsToken1.decimals,
    esNFTs,
    runePoolStakingPositions,
  )

  const { apr: esNFTApr } = useEsNFTAprs(poolData?.nftPoolAddress, eldenPrice, lpPrice)
  const { apr1, apr2 } = useRunePoolApr(
    poolId,
    lpPrice,
    rewardsToken1Price,
    rewardsToken2Price,
    poolData?.rewardsToken0.decimals,
    poolData?.rewardsToken1.decimals,
  )

  useEffect(() => {
    let _apr = 0
    if (esNFTApr) _apr += esNFTApr
    if (apr1) _apr += apr1
    if (apr2) _apr += apr2
    setAverageApr(_apr)
  }, [esNFTApr, apr1, apr2])

  const [onPresentHarvestModal] = useModal(
    <HarvestModal
      data={poolData}
      esNFTs={esNFTs}
      rewards={rewards}
      priceData={{ rewardsToken1Price, rewardsToken2Price, lpPrice, eldenPrice }}
    />,
  )

  const [onPresentDepositModal] = useModal(
    <DepositModal
      data={poolData}
      esNFTStakingPositions={esNFTs}
      rewards={rewards}
      priceData={{ rewardsToken1Price, rewardsToken2Price, lpPrice, eldenPrice }}
    />,
  )
  const [onPresentWithdrawModal] = useModal(
    <WithdrawModal
      data={poolData}
      runePoolStakingPositions={runePoolStakingPositions}
      rewards={rewards}
      priceData={{ rewardsToken1Price, rewardsToken2Price, lpPrice, eldenPrice }}
    />,
  )

  return (
    <Page>
      <Flex
        flexDirection="column"
        maxWidth={1024}
        width="100%"
        height="100%"
        position="relative"
        alignItems="center"
        style={{ gap: 16 }}
      >
        <EPageHeader pageName="runepools" />

        {!isLoadingPoolData && poolData ? (
          <Flex style={{ gap: '20px' }} flexDirection="column">
            <RunePoolInfo
              poolData={poolData}
              priceData={{ rewardsToken1Price, rewardsToken2Price, lpPrice }}
              apr={{ esNFTApr, apr1, apr2 }}
            />

            <EBox style={{ padding: '20px' }}>
              <Flex justifyContent="space-between">
                <Text fontSize="24px">Staked Positions</Text>
                <Flex style={{ gap: 8 }} flexWrap="wrap" justifyContent="right">
                  <EButton
                    mt={5}
                    handleClick={onPresentHarvestModal}
                    disabled={!isEnableToHarvest(poolData.harvestStartTime)}
                  >
                    harvest
                  </EButton>
                  <EButton
                    mt={5}
                    handleClick={onPresentWithdrawModal}
                    disabled={!runePoolStakingPositions || runePoolStakingPositions.length <= 0}
                  >
                    {isLoadingRunePoolStakingPositions ? <Dots>withdraw</Dots> : <>withdraw</>}
                  </EButton>
                  <EButton
                    mt={5}
                    handleClick={onPresentDepositModal}
                    disabled={
                      !isEnableToDeposit(poolData.endTime, poolData.depositEndTime) || !esNFTs || esNFTs.length <= 0
                    }
                  >
                    {isLoadingEsNFTs ? <Dots>deposit</Dots> : <>deposit</>}
                  </EButton>
                </Flex>
              </Flex>

              <EarnInfo>
                <EarnCard>
                  <Text color="gray">average apr</Text>
                  <Text>{averageApr ? `${formatAmount(averageApr)} %` : '-'}</Text>
                </EarnCard>
                <EarnCard>
                  <Text color="gray">total deposits</Text>
                  <Text fontSize="12px">
                    {formatAmount(poolData.totalDepositAmount)} {poolData.pairName}
                  </Text>
                </EarnCard>
                <EarnCard>
                  <Text color="gray">pending rewards</Text>
                  <Flex flexDirection="column">
                    <Text fontSize="12px">
                      {formatAmount(rewards.pendingReward1)} {poolData?.rewardsToken0?.symbol}
                    </Text>
                    {poolData && poolData.rewardsToken1.id !== zeroAddress && (
                      <Text fontSize="12px">
                        {formatAmount(rewards.pendingReward2)} {poolData?.rewardsToken1?.symbol}
                      </Text>
                    )}
                  </Flex>
                </EarnCard>
              </EarnInfo>

              {runePoolStakingPositions ? (
                <PositionsList>
                  {runePoolStakingPositions.map((runePosition) => (
                    <RunePoolCard
                      key={`${runePosition.id}`}
                      runeStakingPosition={runePosition}
                      runePoolApr={{ apr1, apr2 }}
                      ethPrice={runePosition.ethPrice}
                    />
                  ))}
                  {/* <EsNFTCard
                    key={item.nftId}
                    esNft={item.nftStakingPosition}
                    ethPrice={0}
                    runePoolApr={{ apr1, apr2 }}
                  /> */}
                </PositionsList>
              ) : null}
            </EBox>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
    </Page>
  )
}

export default RunePoolDetail
