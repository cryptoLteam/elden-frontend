import { Text, Dots, Flex } from '@pancakeswap/uikit'
import { CHAIN_IDS } from 'utils/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { useMemo, useState } from 'react'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import ESearchBox from 'components/ESearchBox'
import EBox from 'components/EBox'
import { EsNFTCardHeader } from 'components/EsNFTCardRow/EsNFTCardHeader'
import useEsNFTListsByAccount from 'hooks/useEsNFTListsByAccount'
import { STABLE_PAIRS } from 'config/constants/stablePairs'
import EsNFTCard from './EsNFTCard'

export default function PositionList({ onRefetchData }) {
  const { t } = useTranslation()
  const { account, chainId } = useAccountActiveChain()

  const [searchKey, setSearchKey] = useState<string>('')

  const { data: esNFTs, error: esNFTError, isLoading: esNFTLoading } = useEsNFTListsByAccount(account, 30000)

  let esNFTsSection: null | JSX.Element[] = null

  const findPairOfStableNftPool = (pairAddress) => {
    for (let i = 0; i < STABLE_PAIRS.length; i++) {
      if (STABLE_PAIRS[i].id.toLowerCase() === pairAddress) return STABLE_PAIRS[i]
    }
    return null
  }

  if (esNFTs?.stakingPositions.length) {
    esNFTsSection = esNFTs.stakingPositions.map((esNft) => {
      // eslint-disable-next-line
      if (!esNft.pool.pair) esNft.pool.pair = findPairOfStableNftPool(esNft.pool.pairAddress)
      return <EsNFTCard key={`${esNft.id}`} esNft={esNft} ethPrice={esNFTs.bundles[0]} onRefetchData={onRefetchData} />
    })
  }

  const filteredWithQueryFilter = useMemo(() => {
    if (esNFTsSection) {
      return esNFTsSection
        .filter((pair) => {
          const pairToken0 = pair?.props?.esNft?.pool?.pair?.token0
          const pairToken1 = pair?.props?.esNft?.pool?.pair?.token1

          if (!pairToken0 || !pairToken1) return null

          const searchStr = searchKey.toLowerCase()
          if (searchStr.length === 0) return pair

          const token0Address = pairToken0.id.toLowerCase()
          const token1Address = pairToken1.id.toLowerCase()
          const token0Name = pairToken0.name.toLowerCase()
          const token1Name = pairToken1.name.toLowerCase()
          const token0Symbol = pairToken0.symbol.toLowerCase()
          const token1Symbol = pairToken1.symbol.toLowerCase()

          if (
            token0Address.indexOf(searchStr) >= 0 ||
            token1Address.indexOf(searchStr) >= 0 ||
            token0Name.indexOf(searchStr) >= 0 ||
            token1Name.indexOf(searchStr) >= 0 ||
            token0Symbol.indexOf(searchStr) >= 0 ||
            token1Symbol.indexOf(searchStr) >= 0
          ) {
            return pair
          }

          return null
        })
        .filter(Boolean)
    }

    return []
  }, [esNFTsSection, searchKey])

  const mainSection = useMemo(() => {
    let resultSection: null | JSX.Element | (JSX.Element[] | null | undefined)[] = null
    if (esNFTLoading) {
      resultSection = (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    } else if (!esNFTsSection || !filteredWithQueryFilter) {
      resultSection = (
        <Text color="textSubtle" textAlign="center">
          {t('No liquidity found.')}
        </Text>
      )
    } else {
      resultSection = [filteredWithQueryFilter]
    }

    return resultSection
  }, [t, esNFTLoading, esNFTsSection, filteredWithQueryFilter])

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
      <ESearchBox value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />

      <EBox style={{ width: '100%', gap: '8px', display: 'flex', flexDirection: 'column' }}>
        <EsNFTCardHeader />
        {mainSection}
      </EBox>

      <V3SubgraphHealthIndicator />
    </Flex>
  )
}

PositionList.chains = CHAIN_IDS
