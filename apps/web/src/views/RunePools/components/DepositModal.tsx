import { useState } from 'react'
import { Modal, Text, Flex, useToast, Dots } from '@pancakeswap/uikit'

import useCatchTxError from 'hooks/useCatchTxError'
import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import EBox from 'components/EBox'
import EButton from 'components/EButton'
import { useAccount } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import useRunePoolCalls from '../hooks/useRunePoolCalls'
import ItemRow from './ItemRow'

export interface RunePoolDepositProps {
  onDismiss?: Handler
  mode?: string
  data: any
  esNFTStakingPositions: any
  rewards: any
  priceData: any
}

const RunePoolDepositModal: React.FC<React.PropsWithChildren<RunePoolDepositProps>> = ({
  onDismiss,
  data,
  esNFTStakingPositions,
  rewards,
  priceData,
}) => {
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { address: account } = useAccount()

  const { onDeposit } = useRunePoolCalls(data.id, data.nftPoolAddress, account)

  const [isLoading, setLoading] = useState(false)

  const [selectedId, setSelectId] = useState<number | undefined>(undefined)
  const handleDeposit = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onDeposit(selectedId)
    })
    setLoading(false)
    if (receipt?.status) {
      // rewards.refetchEsNFTRewards()
      onDismiss()
      toastSuccess(
        'Deposit',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deposit Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={'Deposit Position'} onDismiss={onDismiss}>
      <Flex justifyContent="center" mb="12px">
        <Text fontSize="14px" color="gray" textAlign="center" maxWidth="360px">
          Stake your esNFT into a Rune Pool to earn extra yield.
        </Text>
      </Flex>

      <EBox style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {esNFTStakingPositions &&
          esNFTStakingPositions.map((item) => {
            return (
              <ItemRow
                poolData={data}
                positionData={item}
                priceData={priceData}
                rewards={rewards}
                isSelected={selectedId === item.nftId}
                onClick={() => setSelectId(item.nftId)}
              />
            )
          })}
      </EBox>

      <Flex justifyContent="space-around" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          cancel
        </EButton>
        <EButton handleClick={handleDeposit} disabled={!selectedId || isLoading} mt={5}>
          {isLoading ? <Dots>deposit</Dots> : <>deposit</>}
        </EButton>
      </Flex>
    </Modal>
  )
}

export default RunePoolDepositModal
