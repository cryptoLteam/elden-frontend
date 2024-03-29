import { useTranslation } from '@pancakeswap/localization'
import { Card, Heading, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import useInfoUserSavedTokensAndPools from 'hooks/useInfoUserSavedTokensAndPoolsList'
import { useMemo } from 'react'
import { useChainIdByQuery, usePoolDatasSWR } from 'state/info/hooks'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { useNonSpamPoolsData } from '../hooks/usePoolsData'

const PoolsOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { poolsData, stableSwapsAprs } = useNonSpamPoolsData()
  const chainId = useChainIdByQuery()
  const { savedPools } = useInfoUserSavedTokensAndPools(chainId)
  const watchlistPools = usePoolDatasSWR(savedPools)
  const watchlistPoolsData = useMemo(
    () =>
      watchlistPools.map((pool) => {
        return { ...pool, ...(stableSwapsAprs && { lpApr7d: stableSwapsAprs[pool.address] }) }
      }),
    [watchlistPools, stableSwapsAprs],
  )

  return (
    <Page>
      <Heading scale="lg" mb="16px" id="info-pools-title">
        {t('All Pairs')}
      </Heading>
      <PoolTable poolDatas={poolsData} />
    </Page>
  )
}

export default PoolsOverview
