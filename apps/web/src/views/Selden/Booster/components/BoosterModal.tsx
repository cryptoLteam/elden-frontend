import { useState } from 'react'
import { Modal, Flex, useToast, Text, Dots } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import styled from 'styled-components'
import ECircleButton from 'components/ECircleButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButtonSm from 'components/EButtonSm'
import EButton from 'components/EButton'
import { getFormattedUnits, getParseUnits } from 'utils/eldenHelper'
import useCatchTxError from 'hooks/useCatchTxError'
import { SELDEN_ADDRESS, YIELD_BOOSTER_ADDRESS } from 'config/constants/elden'
import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { useAccount } from 'wagmi'
import { useAllowanceUsage } from 'hooks/useAllowanceUsage'
import useTokenBalance from 'hooks/useTokenBalance'
import useAllocate from 'hooks/useAllocate'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import EEstimateItem from 'components/EEstimateItem'

const Inner = styled(Flex)`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
`
const InputAmount = styled.input`
  background: transparent;
  outline: none;
  border: none;
  font-size: 16px;
`
const RewardValue = styled.p`
  color: gray;
  font-size: 13px;
`
const Balance = styled.span`
  color: gray;
  font-size: 10px;
  margin-top: 2px;
`

export interface BoosterModalProps {
  onDismiss?: Handler
  mode?: string
  data: any
  onRefetchData: () => void
  onRefetchNftData: () => void
}

const BoosterModal: React.FC<React.PropsWithChildren<BoosterModalProps>> = ({
  onDismiss,
  data,
  onRefetchData,
  onRefetchNftData,
}) => {
  const { address } = useAccount()
  const [amount, setAmount] = useState<number | undefined>()
  const [tab, setTab] = useState<'boost' | 'unboost'>('boost')

  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { onAllocate, onDeallocate } = useAllocate()

  const [isLoading, setLoading] = useState(false)

  const { allowanceUsage, refetchAllowance, handleApproveUsage } = useAllowanceUsage(YIELD_BOOSTER_ADDRESS)
  const { balance: sEldenBalance } = useTokenBalance(SELDEN_ADDRESS)

  const handleApprove = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return handleApproveUsage(getParseUnits(amount))
    })
    setLoading(false)
    if (receipt?.status) {
      refetchAllowance()
      toastSuccess(
        'Approve',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Approve Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleBoost = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      const callData = encodeAbiParameters(parseAbiParameters(['address, uint256']), [data.poolAddress, data.nftId])
      return onAllocate(YIELD_BOOSTER_ADDRESS, amount, callData)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchData()
      onRefetchNftData()
      onDismiss()
      toastSuccess(
        'Boost',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Boost Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleUnboost = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      const callData = encodeAbiParameters(parseAbiParameters(['address, uint256']), [data.poolAddress, data.nftId])
      return onDeallocate(YIELD_BOOSTER_ADDRESS, amount, callData)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchData()
      onRefetchNftData()
      onDismiss()
      toastSuccess(
        'Unboost',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Unboost Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={`${data.name} ${data.type} esNFT`} onDismiss={onDismiss}>
      <Text fontSize="20px" textAlign="center">
        Boost your position
      </Text>
      <Text fontSize="14px" color="gray" textAlign="center">
        Allocate sELDEN to your esNFT for more yield
      </Text>

      <Flex mt="12px" style={{ gap: '8px' }}>
        <EButtonSm
          isActive={tab === 'boost'}
          onClick={() => {
            setTab('boost')
          }}
          style={{ width: '100px' }}
        >
          boost
        </EButtonSm>
        <EButtonSm
          isActive={tab === 'unboost'}
          onClick={() => {
            setTab('unboost')
          }}
          style={{ width: '100px' }}
        >
          unboost
        </EButtonSm>
      </Flex>

      <EBox style={{ marginTop: '8px' }}>
        <Inner>
          <Flex flexDirection="column" flexGrow={1} justifyContent="center">
            <InputAmount
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
            />
            <Balance>
              BALANCE: {tab === 'boost' ? `${getFormattedUnits(sEldenBalance)} sELDEN` : `${data.boostPoints} sElden`}{' '}
            </Balance>
          </Flex>
          <ECircleButton
            onClick={() => setAmount(tab === 'boost' ? getFormattedUnits(sEldenBalance) : data.boostPoints)}
          >
            MAX
          </ECircleButton>
        </Inner>
      </EBox>

      {amount &&
      ((tab === 'boost' && amount <= getFormattedUnits(sEldenBalance)) ||
        (tab === 'unboost' && amount <= data.boostPoints)) ? (
        <Flex flexDirection="column" mt="12px" style={{ gap: '8px' }}>
          <EEstimateItem
            label="Boost multiplier"
            value={`x${(Number(amount) > 0
              ? ((data.userAllocation + amount * (tab === 'boost' ? 1 : -1)) / data.userAllocation) *
                  data.boostMultiplier >
                2
                ? ((data.userAllocation + amount * (tab === 'boost' ? 1 : -1)) / data.userAllocation) *
                  data.boostMultiplier
                : 2
              : data.boostMultiplier
            ).toFixed(2)}`}
          />
          <EEstimateItem
            label="Boost allocation"
            value={`${
              Number(amount) > 0
                ? (Number(amount * (tab === 'boost' ? 1 : -1)) + Number(data.boostPoints)).toFixed(2)
                : Number(data.boostPoints).toFixed(2)
            } sElden`}
            ml={12}
          />
          <EEstimateItem
            label="Position pool share"
            value={`${(
              (data.poolAllocation && data.totalAllocation ? data.poolAllocation / data.totalAllocation : 0) * 100
            ).toFixed(2)}%`}
            ml={12}
          />
          <EEstimateItem
            label="Pool boost share"
            value={`${(
              ((data.userAllocation + amount * (tab === 'boost' ? 1 : -1)) /
                (data.poolAllocation + amount * (tab === 'boost' ? 1 : -1))) *
              100
            ).toFixed(2)}%`}
            ml={12}
          />
          <EEstimateItem
            label="apr"
            value={`${(Number(data.farmBaseAPR) + Number(data.lockBonusAPR) + Number(data.boostBonusAPR)).toFixed(2)}%`}
          />
          <Flex flexDirection="column" style={{ gap: '4px', marginLeft: '10px' }}>
            {/* <EEstimateItem label="swap fees apr" value={`${data.apr.toFixed(2)}%`} /> */}
            <EEstimateItem label="farm base apr" value={`${data.farmBaseAPR.toFixed(2)}%`} />
            <EEstimateItem
              label="farm bonus apr"
              value={`${(Number(data.boostBonusAPR) + Number(data.lockBonusAPR)).toFixed(2)}%`}
            />
          </Flex>
          {tab === 'unboost' && <EEstimateItem label="Deallocation fee" value="$0" />}
        </Flex>
      ) : (
        <></>
      )}

      <Flex justifyContent="space-around" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          cancel
        </EButton>
        {tab === 'boost' ? (
          <EButton
            handleClick={amount && allowanceUsage < amount ? handleApprove : handleBoost}
            disabled={!amount || isLoading || amount > data.sEldenBalance}
            mt={5}
          >
            {isLoading ? (
              <Dots>{amount && allowanceUsage < amount ? 'approve' : 'boost'}</Dots>
            ) : (
              <>{amount && allowanceUsage < amount ? 'approve' : 'boost'}</>
            )}
          </EButton>
        ) : (
          <EButton handleClick={handleUnboost} disabled={!amount || isLoading || amount > data.boostPoints} mt={5}>
            {isLoading ? <Dots>{'unboost'}</Dots> : <>unboost</>}
          </EButton>
        )}
      </Flex>
    </Modal>
  )
}

export default BoosterModal
