import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { Dots, Flex, Modal, Text, useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useState } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButton from 'components/EButton'
import EBox from 'components/EBox'
import styled from 'styled-components'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useRunePoolCalls from 'views/RunePools/hooks/useRunePoolCalls'
import RunePoolRow from './RunePoolRow'
import { EsNFTData } from '../hooks/useEsNFTCardData'
import useGetRunePoolAddress from '../hooks/useGetRunePoolAddress'

const Inner = styled(Flex)`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
`

export interface StakeModalProps {
  onDismiss?: Handler
  mode?: string
  data: EsNFTData
  onRefetchNftData: () => void
}

export const StakeModal: React.FC<React.PropsWithChildren<StakeModalProps>> = ({
  onDismiss,
  data,
  onRefetchNftData,
}) => {
  const { account, chainId } = useAccountActiveChain()
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [selectedRunePool, setSelectedRunePool] = useState<string | undefined>(undefined)
  const { onDeposit } = useRunePoolCalls(selectedRunePool, data.poolAddress, account)

  const { pools: runePools } = useGetRunePoolAddress(data.poolAddress, 30000)

  const [isLoading, setLoading] = useState(false)

  const handleStake = async () => {
    if (!selectedRunePool) return

    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onDeposit(data.nftId)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchNftData()
      onDismiss()
      toastSuccess(
        'Stake',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Stake Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={`${data.name} ${data.type} esNFT`} onDismiss={onDismiss}>
      <Text fontSize="20px" textAlign="center">
        Stake into a Rune Pool
      </Text>
      <Text fontSize="14px" color="gray" textAlign="center">
        Deposit your esNFT into a Rune to earn additional yield
      </Text>

      <EBox style={{ marginTop: '12px', marginBottom: '12px' }}>
        <Inner>
          {(!runePools || runePools.length <= 0) && (
            <Text width="100%" color="gray" textAlign="center">
              No compatible Rune Pool
            </Text>
          )}
          {runePools &&
            runePools.map((runePool: any) => {
              return (
                <RunePoolRow
                  key={runePool?.id}
                  runePool={runePool}
                  selectedRunePool={selectedRunePool}
                  setSelectedRunePool={setSelectedRunePool}
                />
              )
            })}
        </Inner>
      </EBox>

      <Flex justifyContent="space-around" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          cancel
        </EButton>
        <EButton handleClick={handleStake} disabled={!selectedRunePool} isLoading={isLoading} mt={5}>
          {isLoading ? <Dots>stake</Dots> : <>stake</>}
        </EButton>
      </Flex>
    </Modal>
  )
}
