import { Dots, Flex, useToast } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import Button from 'components/EButton'
import ECircleButton from 'components/ECircleButton'
import { eldenTokenABI } from 'config/abi/IEldenToken'
import { ELDEN_ADDRESS, SELDEN_ADDRESS } from 'config/constants/elden'
import { useEffect, useRef, useState } from 'react'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import styled from 'styled-components'
import { getContractResult, getParseUnits } from 'utils/eldenHelper'
import { useAccount, useChainId, useContractReads } from 'wagmi'
import useApproveToken from 'hooks/useApproveToken'
import useConvertElden from '../hooks/useConvertElden'

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
  font-size: 16px;
  outline: none;
  border: none;
`

const Balance = styled.span`
  color: gray;
  font-size: 10px;
  margin-top: 2px;
`

const GetSeldenCard = ({ onRefetchData }) => {
  const { address } = useAccount()
  const chainId = useChainId()

  const { toastError, toastSuccess } = useToast()
  const [amount, setAmount] = useState<number | undefined>()

  const [eldenBalance, setEldenBalance] = useState<number>(0)
  const [allowance, setAllowance] = useState<number>(0)

  const [isConverting, setConverting] = useState(false)

  const { onApprove } = useApproveToken(ELDEN_ADDRESS)
  const { onConvert } = useConvertElden()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: ELDEN_ADDRESS,
        abi: eldenTokenABI,
        chainId,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        address: ELDEN_ADDRESS,
        abi: eldenTokenABI,
        chainId,
        functionName: 'allowance',
        args: [address as `0x${string}`, SELDEN_ADDRESS],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    setEldenBalance(getContractResult(contractResult[0]))
    setAllowance(getContractResult(contractResult[1]))
  }, [contractResult])

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove(getParseUnits(eldenBalance), SELDEN_ADDRESS)
    })
    if (receipt?.status) {
      toastSuccess(
        'Approve',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Approve Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleConvert = async () => {
    setConverting(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onConvert(getParseUnits(amount))
    })
    setConverting(false)
    if (receipt?.status) {
      setAmount(0)
      onRefetchData()
      toastSuccess(
        'Convert',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Convert Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <CardContent>
      <Flex flexDirection="column">
        <RewardTitle>Get sELDEN</RewardTitle>
        <RewardValue>Unlock bonus rewards and exclusive benefits by converting your ELDEN to sELDEN.</RewardValue>
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
            <Balance>BALANCE: {eldenBalance} ELDEN</Balance>
          </Flex>
          <ECircleButton onClick={() => setAmount(eldenBalance)}>MAX</ECircleButton>
        </Inner>
      </EBox>

      <Flex flexDirection={'row-reverse'} mt={10}>
        <Button
          handleClick={allowance < amount ? handleApprove : handleConvert}
          disabled={amount === 0}
          isLoading={isConverting}
          mt={5}
        >
          {isConverting ? (
            <Dots>{allowance < amount ? 'approve' : 'convert'}</Dots>
          ) : (
            <>{allowance < amount ? 'approve' : 'convert'}</>
          )}
        </Button>
      </Flex>
    </CardContent>
  )
}

export default GetSeldenCard
