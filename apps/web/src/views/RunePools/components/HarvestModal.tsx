import { useState } from 'react'
import { Modal, Flex, useToast, Text, Dots } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButton from 'components/EButton'
import useCatchTxError from 'hooks/useCatchTxError'
import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { useAccount } from 'wagmi'
import { formatAmount } from 'utils/formatCurrencyAmount'
import useRunePoolCalls from '../hooks/useRunePoolCalls'

export interface RunePoolHarvestProps {
  onDismiss?: Handler
  mode?: string
  data: any
  esNFTs: any
  rewards: any
  priceData: any
}

const RunePoolHarvestModal: React.FC<React.PropsWithChildren<RunePoolHarvestProps>> = ({
  onDismiss,
  data,
  esNFTs,
  rewards,
  priceData,
}) => {
  const { address } = useAccount()
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { onHarvestRunePoolReward, onHarvestEsNFTReward } = useRunePoolCalls(data.id, data.nftPoolAddress)

  const [isHarvestingRune, setHarvestingRune] = useState(false)
  const [isHarvestingEsNFT, setHarvestingEsNFT] = useState(false)

  const getTotalEsNFTRewards = () => {
    if (!rewards.esNFTRewards) return 0
    if (rewards.esNFTRewards.length <= 0) return 0
    const totalRewards = rewards.esNFTRewards.reduce((prev, next) => prev + next.amount, 0)
    return totalRewards
  }

  const handleHarvestEsNFT = async () => {
    setHarvestingEsNFT(true)
    const receipt = await fetchWithCatchTxError(() => {
      const nftIds = esNFTs.map((item) => item.nftId)
      return onHarvestEsNFTReward(nftIds, address)
    })
    setHarvestingEsNFT(false)
    if (receipt?.status) {
      rewards.refetchEsNFTRewards()
      onDismiss()
      toastSuccess(
        'Deallocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deallocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleHarvestRune = async () => {
    setHarvestingRune(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onHarvestRunePoolReward()
    })
    setHarvestingRune(false)
    if (receipt?.status) {
      rewards.refetchRuneRewards()
      onDismiss()
      toastSuccess(
        'Deallocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deallocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={'Harvest Rewards'} onDismiss={onDismiss}>
      <EBox>
        <Flex justifyContent="space-between" style={{ gap: '20px' }}>
          <Flex flexDirection="column">
            <Text>esNFTs Rewards</Text>
            <Text fontSize={12}>
              {formatAmount(getTotalEsNFTRewards())} (ELDEN+sELDEN)
              <Text color="gray" fontSize={12}>
                (${formatAmount(priceData.eldenPrice === null ? 0 : priceData.eldenPrice * getTotalEsNFTRewards())})
              </Text>
            </Text>
          </Flex>

          <EButton handleClick={handleHarvestEsNFT} disabled={getTotalEsNFTRewards() === 0 || isHarvestingEsNFT} mt={5}>
            {isHarvestingEsNFT ? <Dots>harvest</Dots> : <>harvest</>}
          </EButton>
        </Flex>
      </EBox>

      <EBox style={{ marginTop: '12px' }}>
        <Flex justifyContent="space-between" style={{ gap: '20px' }}>
          <Flex flexDirection="column">
            <Text>Rune Rewards</Text>
            <Text fontSize={12}>
              {formatAmount(rewards.pendingReward1)} {data.rewardsToken0.symbol}
              <Text color="gray" fontSize={12}>
                (${formatAmount(priceData.rewardsToken1Price * rewards.pendingReward1)})
              </Text>
            </Text>
            <Text fontSize={12}>
              {formatAmount(rewards.pendingReward2)} {data.rewardsToken1.symbol}
              <Text color="gray" fontSize={12}>
                (${formatAmount(priceData.rewardsToken2Price * rewards.pendingReward2)})
              </Text>
            </Text>
          </Flex>

          <EButton handleClick={handleHarvestRune} disabled={rewards.pendingReward1 === 0 || isHarvestingRune} mt={5}>
            {isHarvestingRune ? <Dots>harvest</Dots> : <>harvest</>}
          </EButton>
        </Flex>
      </EBox>

      <Flex justifyContent="center" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          cancel
        </EButton>
      </Flex>
    </Modal>
  )
}

export default RunePoolHarvestModal
