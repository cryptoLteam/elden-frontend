import { CardBody, Text, Dots, Flex, Tag, ButtonMenu, useModal, ButtonMenuItem } from '@pancakeswap/uikit'
import { PositionDetails } from '@pancakeswap/farms'
import { STABLE_PAIRS } from 'config/constants/stablePairs'
import { useRouter } from 'next/router'
import { styled } from 'styled-components'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { CHAIN_IDS } from 'utils/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useV2PairsByAccount from 'hooks/useV2Pairs'
import useStableConfig, {
  LPStablePair,
  StableConfigContext,
  useLPTokensWithBalanceByAccount,
} from 'views/Swap/hooks/useStableConfig'
import { useEffect, useMemo, useState } from 'react'
import { V2PairCard } from 'views/AddLiquidityV3/components/V2PairCard'
import { StablePairCard } from 'views/AddLiquidityV3/components/StablePairCard'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import { useAtom } from 'jotai'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import EButton from 'components/EButton'
import ESearchBox from 'components/ESearchBox'
import EBox from 'components/EBox'
import { EsNFTCardHeader } from 'components/EsNFTCardRow/EsNFTCardHeader'
import { StableCardTableHeader } from 'components/StableCardRow/StableCardTableHeader'
import { V2CardTableHeader } from 'components/V2CardRow/V2CardTableHeader'
import { V3CardRow } from 'components/V3CardRow'
import { V3CardTableHeader } from 'components/V3CardRow/V3CardTableHeader'
import useEsNFTListsByAccount from 'hooks/useEsNFTListsByAccount'
import useRunePoolStakingPositions from 'hooks/useRunePoolStakingPositions'
import { NewPositionModal } from './NewPositionModal'
import RunePoolCard from './RunePoolCard'
import EsNFTCard from './EsNFTCard'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

export const StableContextProvider = (props: { pair: LPStablePair; account: string | undefined }) => {
  const stableConfig = useStableConfig({
    tokenA: props.pair?.token0,
    tokenB: props.pair?.token1,
  })

  if (!stableConfig.stableSwapConfig) return null

  return (
    <StableConfigContext.Provider value={stableConfig}>
      <StablePairCard {...props} />
    </StableConfigContext.Provider>
  )
}

enum FILTER {
  esNFT = 0,
  V3 = 1,
  STABLE = 2,
  V2 = 3,
}

const hideClosePositionAtom = atomWithStorageWithErrorCatch('pcs:hide-close-position', false)

function useHideClosePosition() {
  return useAtom(hideClosePositionAtom)
}

export default function PositionList() {
  const { t } = useTranslation()
  const router = useRouter()
  const { account, chainId } = useAccountActiveChain()

  const [onPresentNewPositionModal] = useModal(<NewPositionModal />)

  const [selectedTypeIndex, setSelectedTypeIndex] = useState(FILTER.esNFT)

  const [searchKey, setSearchKey] = useState('')

  const { positions, loading: v3Loading } = useV3Positions(account)

  const { data: v2Pairs, loading: v2Loading } = useV2PairsByAccount(account)

  const { data: esNFTs, isLoading: esNFTLoading } = useEsNFTListsByAccount(account, 30000)

  const { stakingPositions: runePoolStakingPositions, isLoading: isLoadingRunePoolStakingPositions } =
    useRunePoolStakingPositions(account, 30000, false)

  const stablePairs = useLPTokensWithBalanceByAccount(account)

  const { type } = router.query
  useEffect(() => {
    if (Number(type) === 1) setSelectedTypeIndex(FILTER.STABLE)
    if (Number(type) === 2) setSelectedTypeIndex(FILTER.V2)
    if (Number(type) === 3) setSelectedTypeIndex(FILTER.V3)
  }, [type])

  let v2PairsSection: null | JSX.Element[] = null

  if (v2Pairs?.length) {
    v2PairsSection = v2Pairs.map((pair, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <V2PairCard key={`${pair?.token0}-${pair?.token1}-${index}`} pair={pair} account={account} />
    ))
  }

  const findPairOfStableNftPool = (pairAddress) => {
    for (let i = 0; i < STABLE_PAIRS.length; i++) {
      if (STABLE_PAIRS[i].id.toLowerCase() === pairAddress) return STABLE_PAIRS[i]
    }
    return null
  }

  let positionsSection: null | JSX.Element[] = null

  if (esNFTs?.stakingPositions.length || runePoolStakingPositions?.length) {
    const esNFTSection =
      esNFTs &&
      esNFTs.stakingPositions.map((esNft) => {
        // eslint-disable-next-line
        if (esNft.pool.pair === null) esNft.pool.pair = findPairOfStableNftPool(esNft.pool.pairAddress)
        return <EsNFTCard key={`${esNft.id}`} esNft={esNft} ethPrice={esNFTs.bundles[0]} />
      })

    const runeSection =
      runePoolStakingPositions &&
      runePoolStakingPositions.map((runePosition) => {
        if (runePosition.nftStakingPosition.pool.pair === null) {
          // eslint-disable-next-line
          runePosition.nftStakingPosition.pool.pair = findPairOfStableNftPool(
            runePosition.nftStakingPosition.pool.pairAddress,
          )
        }
        return (
          <RunePoolCard
            key={`${runePosition.id}`}
            runeStakingPosition={runePosition}
            ethPrice={runePosition.ethPrice}
          />
        )
      })
    positionsSection = [esNFTSection, runeSection]
  }

  let stablePairsSection: null | JSX.Element[] = null

  if (stablePairs?.length) {
    stablePairsSection = stablePairs.map((pair) => (
      <StableContextProvider key={pair.lpAddress} pair={pair} account={account} />
    ))
  }

  let v3PairsSection: null | JSX.Element[] = null

  if (positions?.length) {
    const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
      (acc, p) => {
        acc[p.liquidity === 0n ? 1 : 0].push(p)
        return acc
      },
      [[], []],
    ) ?? [[], []]

    const filteredPositions = [...openPositions] // , ...(hideClosedPositions ? [] : closedPositions)

    v3PairsSection = filteredPositions.map((p) => {
      return <V3CardRow key={p.tokenId.toString()} positionDetails={p} />
    })
  }

  const filteredV3Sections = useMemo(() => {
    if (v3PairsSection) {
      return v3PairsSection
        .filter((pair) => {
          if (!searchKey || searchKey.length === 0) return pair
          const pairToken0 = pair?.props?.positionDetails?.token0?.toLowerCase()
          const pairToken1 = pair?.props?.positionDetails?.token1?.toLowerCase()

          const subString = searchKey.toLowerCase()

          if (subString === pairToken0 || subString === pairToken1) return pair

          return null
        })
        .filter(Boolean)
    }

    return []
  }, [searchKey, v3PairsSection])

  const filteredV2Sections = useMemo(() => {
    if (v2PairsSection) {
      return v2PairsSection
        .filter((pair) => {
          if (!searchKey || searchKey.length === 0) return pair

          const pairToken0 = pair?.props?.pair?.token0
          const pairToken1 = pair?.props?.pair?.token1
          const pairToken0Address = pairToken0.address.toLowerCase()
          const pairToken1Address = pairToken1.address.toLowerCase()
          const pairToken0Symbol = pairToken0.symbol.toLowerCase()
          const pairToken1Symbol = pairToken1.symbol.toLowerCase()
          const subString = searchKey.toLowerCase()

          if (
            pairToken0Address.indexOf(subString) >= 0 ||
            pairToken1Address.indexOf(subString) >= 0 ||
            pairToken0Symbol.indexOf(subString) >= 0 ||
            pairToken1Symbol.indexOf(subString) >= 0
          ) {
            return pair
          }

          return null
        })
        .filter(Boolean)
    }

    return []
  }, [searchKey, v2PairsSection])

  const filteredStableSections = useMemo(() => {
    if (stablePairsSection) {
      return stablePairsSection
        .filter((pair) => {
          if (!searchKey || searchKey.length === 0) return pair

          const pairToken0 = pair?.props?.pair?.token0
          const pairToken1 = pair?.props?.pair?.token1
          const pairToken0Address = pairToken0.address.toLowerCase()
          const pairToken1Address = pairToken1.address.toLowerCase()
          const pairToken0Symbol = pairToken0.symbol.toLowerCase()
          const pairToken1Symbol = pairToken1.symbol.toLowerCase()
          const subString = searchKey.toLowerCase()

          if (
            pairToken0Address.indexOf(subString) >= 0 ||
            pairToken1Address.indexOf(subString) >= 0 ||
            pairToken0Symbol.indexOf(subString) >= 0 ||
            pairToken1Symbol.indexOf(subString) >= 0
          ) {
            return pair
          }

          return null
        })
        .filter(Boolean)
    }

    return []
  }, [searchKey, stablePairsSection])

  const filteredEsNFTSections = useMemo(() => {
    if (positionsSection) {
      return positionsSection
        .filter((pair) => {
          if (!searchKey || searchKey.length === 0) return pair

          const poolAddress = pair.props.esNft.id
          const pairToken0 = pair?.props?.esNft?.pool?.pair?.token0
          const pairToken1 = pair?.props?.esNft?.pool?.pair?.token1
          const pairToken0Address = pairToken0.id.toLowerCase()
          const pairToken1Address = pairToken1.id.toLowerCase()
          const pairToken0Symbol = pairToken0.symbol.toLowerCase()
          const pairToken1Symbol = pairToken1.symbol.toLowerCase()

          const subString = searchKey.toLowerCase()

          if (
            poolAddress.indexOf(subString) >= 0 ||
            pairToken0Address.indexOf(subString) >= 0 ||
            pairToken1Address.indexOf(subString) >= 0 ||
            pairToken0Symbol.indexOf(subString) >= 0 ||
            pairToken1Symbol.indexOf(subString) >= 0
          ) {
            return pair
          }

          return null
        })
        .filter(Boolean)
    }

    return []
  }, [searchKey, positionsSection])

  const mainSection = useMemo(() => {
    let resultSection: null | JSX.Element | (JSX.Element[] | null | undefined)[] = null

    if (esNFTLoading || v3Loading || v2Loading) {
      resultSection = (
        <Text color="textSubtle" textAlign="center">
          <Dots>Loading</Dots>
        </Text>
      )
    } else {
      const sections = [filteredEsNFTSections, filteredV3Sections, filteredStableSections, filteredV2Sections]
      resultSection = sections.filter((_, index) => selectedTypeIndex === index)

      if (!resultSection) {
        resultSection = (
          <Text color="textSubtle" textAlign="center">
            No liquidity found.
          </Text>
        )
      }
    }

    return resultSection
  }, [
    selectedTypeIndex,
    v2Loading,
    esNFTLoading,
    v3Loading,
    filteredEsNFTSections,
    filteredV3Sections,
    filteredV2Sections,
    filteredStableSections,
  ])

  return (
    <Flex
      flexDirection="column"
      maxWidth={1024}
      width="100%"
      height="100%"
      position="relative"
      alignItems="center"
      style={{ gap: 16 }}
    >
      <Flex width="100%" marginTop={36} flexWrap="wrap" style={{ gap: '12px' }}>
        <ButtonMenu
          scale="sm"
          activeIndex={selectedTypeIndex}
          onItemClick={(index) => setSelectedTypeIndex(index)}
          variant="subtle"
        >
          <ButtonMenuItem>esNFT</ButtonMenuItem>
          <ButtonMenuItem>v3</ButtonMenuItem>
          <ButtonMenuItem>StableSwap</ButtonMenuItem>
          <ButtonMenuItem>v2</ButtonMenuItem>
        </ButtonMenu>

        <Flex flexGrow={1} justifyContent="end">
          <EButton mt={5} handleClick={onPresentNewPositionModal}>
            new position
          </EButton>
        </Flex>
      </Flex>

      <ESearchBox value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />

      <EBox style={{ width: '100%', gap: '8px', display: 'flex', flexDirection: 'column' }}>
        {selectedTypeIndex === FILTER.esNFT && <EsNFTCardHeader />}
        {selectedTypeIndex === FILTER.STABLE && <StableCardTableHeader />}
        {selectedTypeIndex === FILTER.V2 && <V2CardTableHeader />}
        {selectedTypeIndex === FILTER.V3 && <V3CardTableHeader />}
        {mainSection}
      </EBox>

      <V3SubgraphHealthIndicator />
    </Flex>
  )
}

PositionList.chains = CHAIN_IDS
