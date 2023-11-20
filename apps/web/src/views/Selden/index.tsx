import { useState } from 'react'
import { styled } from 'styled-components'
import { Flex, Grid, useToast } from '@pancakeswap/uikit'
import Page from 'views/Page'
import EPageHeader from 'components/EPageHeader'
import { displayNumber } from 'utils/eldenHelper'
import SeldenCard from './components/SeldenCard'
import ProtocolCard from './components/ProtocolCard'
import GetSeldenCard from './components/GetSeldenCard'
import RedeemCard from './components/RedeemCard'
import { useDashboardData } from './hooks/useDashboardData'
import VestListCard from './components/VestListCard'

const Instruction = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #6c6b6b;
  margin-top: 24px;
`
const SeldenCardGrid = styled(Grid)`
  gap: 12px;
  flex-grow: 1;
  grid-template-columns: repeat(4, minmax(250px, 1fr));

  @media screen and (max-width: 1320px) {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(1, minmax(80vw, 1fr));
  }
`
const ProtocolCardGrid = styled(Grid)`
  flex-grow: 1;
  grid-template-columns: repeat(3, minmax(250px, 1fr));

  @media screen and (max-width: 1320px) {
    grid-template-columns: repeat(1, minmax(250px, 1fr));
  }
`
const BottomCardGrid = styled(Grid)`
  flex-grow: 1;
  gap: 20px;
  margin-top: 24px;
  grid-template-columns: repeat(2, minmax(250px, 1fr));

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(1, minmax(250px, 1fr));
  }
`

const Selden = () => {
  const { toastError, toastSuccess } = useToast()
  const data = useDashboardData()

  const [refresh, setRefresh] = useState(false)

  return (
    <Page>
      <Flex
        flexDirection="column"
        width="100%"
        height="100%"
        position="relative"
        alignItems="center"
        style={{ gap: 16 }}
      >
        <EPageHeader pageName="selden">
          <Instruction>Convert your ELDEN, redeem your sELDEN and manage your sELDEN plugins allocations.</Instruction>
        </EPageHeader>

        <Flex marginTop={36} flexWrap="wrap" justifyContent="center" alignItems="center">
          <img src="/efi/selden-white.png" alt="selden" />
          <SeldenCardGrid>
            <SeldenCard
              icon="/efi/icons/ph_wallet.png"
              title="Total sELDEN"
              value={displayNumber(data.sEldenWalletBalance + data.allocation + data.redeemingBalance)}
            />
            <SeldenCard
              icon="/efi/icons/mdi_hand-coin-outline.png"
              title="Avaliable sELDEN"
              value={displayNumber(data.sEldenWalletBalance)}
            />
            <SeldenCard
              icon="/efi/icons/grommet-icons_pie-chart.png"
              title="Allocated sELDEN"
              value={displayNumber(data.allocation)}
            />
            <SeldenCard
              icon="/efi/icons/material-symbols_redeem.png"
              title="Redeeming sELDEN"
              value={displayNumber(data.redeemingBalance)}
            />
          </SeldenCardGrid>
        </Flex>

        <ProtocolCardGrid>
          <ProtocolCard
            title="Dividends"
            content="Earn real yield from protocol earnings by staking your sELDEN here."
            href="/selden/dividends"
            userAllocation={data.dividensAllocation}
            protocolAllocation={data.dividensProtocolAllocation}
            deAllocationFee={data.dividensDeAllocationFee}
          />
          <ProtocolCard
            title="Yield booster"
            content={<>Boost your staking yields by up to 100% by adding sELDEN to any bligible position.</>}
            href="/selden/booster"
            userAllocation={data.boosterAllocation}
            protocolAllocation={data.boosterProtocolAllocation}
            deAllocationFee={data.boosterDeAllocationFee}
          />
          <ProtocolCard
            title="Launchpad"
            content="Get perks and benefits from every project on Eldenfis launchpad by staking your sELDEN here."
            href="/selden/launchpad"
            userAllocation={data.launchpadAllocation}
            protocolAllocation={data.launchpadProtocolAllocation}
            deAllocationFee={data.launchpadDeAllocationFee}
          />
        </ProtocolCardGrid>

        <BottomCardGrid>
          <Flex flexDirection="column" style={{ gap: '8px' }}>
            <GetSeldenCard onRefetchData={data.refetchContracts} />
            <RedeemCard setRefresh={setRefresh} onRefetchData={data.refetchContracts} />
          </Flex>
          <VestListCard onRefetchData={data.refetchContracts} refresh={refresh} setRefresh={setRefresh} />
        </BottomCardGrid>
      </Flex>
    </Page>
  )
}

export default Selden
