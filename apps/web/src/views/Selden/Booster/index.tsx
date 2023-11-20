import { styled } from 'styled-components'
import { Flex, Grid } from '@pancakeswap/uikit'
import Page from 'views/Page'
import EBox from 'components/EBox'
import EPageHeader from 'components/EPageHeader'

import { displayNumber } from 'utils/eldenHelper'
import PositionList from './components/PositionList'
import { useDashboardData } from './hooks/useDashboardData'

const Instruction = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #6c6b6b;
  margin-top: 24px;
`
const BoosterGrid = styled(Grid)`
  width: 100%;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  gap: 16px;

  @media screen and (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`
const BoosterCard = styled(EBox)`
  padding: 16px 32px;
  display: flex;
  flex-direction: column;
`

const Booster = () => {
  const dashboardData = useDashboardData()

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
        <EPageHeader pageName="booster">
          <Instruction>Allocate sELDEN here to increase the yield of your staking positions up to +100%.</Instruction>
        </EPageHeader>

        <BoosterGrid>
          <BoosterCard>
            <span style={{ color: 'gray' }}>total allocations</span>
            <span>{displayNumber(dashboardData.totalAllocation)} sELDEN</span>
          </BoosterCard>
          <BoosterCard>
            <span style={{ color: 'gray' }}>your allocation</span>
            <span>{displayNumber(dashboardData.userAllocation)} sELDEN</span>
          </BoosterCard>
          <BoosterCard>
            <span style={{ color: 'gray' }}>deallocation fee</span>
            <span>{dashboardData.deAllocationFee}%</span>
          </BoosterCard>
        </BoosterGrid>

        <PositionList onRefetchData={dashboardData.refetchContracts} />
      </Flex>
    </Page>
  )
}

export default Booster
