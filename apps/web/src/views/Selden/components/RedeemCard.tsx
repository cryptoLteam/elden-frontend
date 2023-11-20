import { useEffect, useState } from 'react'
import { Box, Dots, Flex, Message, MessageText, Text, useToast } from '@pancakeswap/uikit'
import { DAY_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import EBox from 'components/EBox'
import Button from 'components/EButton'
import ECircleButton from 'components/ECircleButton'
import { SELDEN_ADDRESS } from 'config/constants/elden'
import styled from 'styled-components'
import { getFormattedUnits, getParseUnits } from 'utils/eldenHelper'
import { useAccount, useChainId } from 'wagmi'
import useCatchTxError from 'hooks/useCatchTxError'
import useTokenBalance from 'hooks/useTokenBalance'
import { ToastDescriptionWithTx } from 'components/Toast'

import InputRedeem from './InputRedeem'
import { useLimitLockDuration } from '../hooks/useLimitLockDuration'
import { useRedeem } from '../hooks/useRedeem'

const CardContent = styled.div`
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 600px;
`

const Inner = styled.div`
  padding: 0 10px;
  display: flex;
  gap: 6px;
`

const RewardTitle = styled.p`
  font-size: 20px;
  margin-bottom: 4px;
`

const RewardValue = styled.p`
  color: gray;
  font-size: 16px;
  max-width: 430px;
`

const InputAmount = styled.input`
  background: transparent;
  outline: none;
  border: none;
  font-size: 16px;
`

const Balance = styled.span`
  color: gray;
  font-size: 10px;
  margin-top: 2px;
`

const RedeemCard = ({ setRefresh, onRefetchData }) => {
  const { address } = useAccount()
  const chainId = useChainId()

  const { toastError, toastSuccess } = useToast()
  const [amount, setAmount] = useState<number | undefined>()
  const [duration, setDuration] = useState(0)

  const [isRedeeming, setRedeeming] = useState(false)

  const sEldenBalance = useTokenBalance(SELDEN_ADDRESS)
  const limitDuration = useLimitLockDuration()

  const { onRedeem } = useRedeem()

  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const handleRedeem = async () => {
    setRedeeming(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onRedeem(getParseUnits(amount), duration * DAY_IN_SECONDS)
    })
    setRedeeming(false)
    if (receipt?.status) {
      setRefresh(true)
      onRefetchData()
      toastSuccess(
        'Redeem',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Redeem Success</ToastDescriptionWithTx>,
      )
    }
  }

  const getRedeemRatio = () => {
    if (!limitDuration.minRatio || !limitDuration.maxRatio) return 0
    if (duration < limitDuration.minDuration) return 0
    if (duration > limitDuration.maxDuration) return limitDuration.maxRatio

    const totalLock = limitDuration.maxDuration - limitDuration.minDuration
    const lockTime = duration - limitDuration.minDuration

    return Number(
      (limitDuration.minRatio + ((limitDuration.maxRatio - limitDuration.minRatio) * lockTime) / totalLock).toFixed(2),
    )
  }

  const getRedeemElden = () => {
    if (!amount) return 0
    const ratio = getRedeemRatio()
    return Number(((amount * ratio) / 100).toFixed(5))
  }

  return (
    <CardContent>
      <Flex flexDirection="column">
        <RewardTitle>Redeem sELDEN</RewardTitle>
        <RewardValue>
          Redeem your sELDEN back into ELDEN over a vesting period of {limitDuration.minDuration} days
        </RewardValue>
      </Flex>

      <EBox>
        <Inner>
          <Flex flexDirection="column" flexGrow={1} justifyContent="center">
            <InputAmount
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
            />
            <Balance>BALANCE: {getFormattedUnits(sEldenBalance.balance)} sELDEN</Balance>
          </Flex>
          <ECircleButton onClick={() => setAmount(getFormattedUnits(sEldenBalance.balance))}>MAX</ECircleButton>
        </Inner>
      </EBox>

      {amount && amount > 0 && amount <= getFormattedUnits(sEldenBalance.balance) ? (
        <Flex flexDirection="column">
          <Flex justifyContent="space-between">
            <Text color="gray" fontSize="13px">
              Redeem ratio
            </Text>
            <Text fontSize="13px">{getRedeemRatio()}%</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text color="gray" fontSize="13px">
              Elden output
            </Text>
            <Text fontSize="13px">{getRedeemElden()} Elden</Text>
          </Flex>
        </Flex>
      ) : (
        <></>
      )}

      {amount > getFormattedUnits(sEldenBalance.balance) && (
        <Message variant="danger">
          <MessageText>Error: not enough balance</MessageText>
        </Message>
      )}

      <Flex mt={10}>
        <Flex flexGrow={1} style={{ gap: '10px' }}>
          <Flex flexDirection="column">
            <Text fontSize="13px" color="gray">
              Redeem duration
            </Text>
            <Box
              color="gray"
              onClick={() => setDuration(limitDuration.maxDuration)}
              style={{ cursor: 'pointer' }}
              mt="4px"
            >
              set max
            </Box>
          </Flex>
          <InputRedeem
            inputValue={duration}
            setInputValue={setDuration}
            minValue={limitDuration.minDuration}
            maxValue={limitDuration.maxDuration}
          />
        </Flex>
        <Button
          handleClick={handleRedeem}
          disabled={
            Number(amount) <= 0 ||
            amount > getFormattedUnits(sEldenBalance.balance) ||
            duration < limitDuration.minDuration ||
            duration > limitDuration.maxDuration
          }
          isLoading={isRedeeming}
          mt={5}
          style={{ alignSelf: 'start' }}
        >
          {isRedeeming ? <Dots>redeem</Dots> : <>redeem</>}
        </Button>
      </Flex>
    </CardContent>
  )
}

export default RedeemCard
