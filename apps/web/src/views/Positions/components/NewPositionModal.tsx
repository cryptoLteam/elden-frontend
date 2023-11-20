import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { DAY_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import { Button, Dots, Flex, Modal, Text, useModal, useToast } from '@pancakeswap/uikit'
import { STABLE_COIN } from '@pancakeswap/tokens'
import { ChainId } from '@pancakeswap/chains'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCatchTxError from 'hooks/useCatchTxError'
import { useEffect, useState } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButton from 'components/EButton'
import EBox from 'components/EBox'
import styled from 'styled-components'
import ECircleButton from 'components/ECircleButton'
import { LiquiditySelect } from 'components/LiquiditySelect'
import useApproveToken from 'hooks/useApproveToken'
import { useAllowance } from 'hooks/useAllowance'
import { getParseUnits } from 'utils/eldenHelper'
import EInputDay from 'components/EInputDay'
import EEstimateItem from 'components/EEstimateItem'
import { useAccount } from 'wagmi'
import usePairList from 'hooks/usePairList'
import useEsNftList from 'hooks/useEsNftList'
import { ELDEN_ADDRESS, NFT_POOL_FACTORY_ADDRESS } from 'config/constants/elden'
import { useLpPrice } from 'hooks/useLpPirce'
import { useStableLpPrice } from 'hooks/useStableLpPirce'
import { useEsNFTAprs } from 'hooks/useEsNFTAprs'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import useEsNFTCalls from '../hooks/useEsNFTCalls'
import { usePairData } from '../hooks/usePairData'
import useEsNFTFactoryCalls from '../hooks/useEsNFTFactoryCalls'

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
const Balance = styled.span`
  color: gray;
  font-size: 10px;
  margin-top: 2px;
`

export interface NewPositionModalProps {
  onDismiss?: Handler
}

export const NewPositionModal: React.FC<React.PropsWithChildren<NewPositionModalProps>> = ({ onDismiss }) => {
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()

  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [pairs, setPairs] = useState([])
  const [lpToken, setLpToken] = useState()

  const [poolAddress, setPoolAddress] = useState(ADDRESS_ZERO)

  const [amount, setAmount] = useState<number | undefined>()
  const [duration, setDuration] = useState(0)

  const { data: pairList } = usePairList(30000)

  const { data: esNftList, error: esNftError, isLoading: esNftLoading } = useEsNftList(30000)

  const { data: pairData } = usePairData({ account, pairs })

  const [isLoading, setLoading] = useState(false)

  const { lpPrice: stableLpPrice } = useStableLpPrice(
    lpToken !== undefined && pairData && pairData.length > 0 ? pairData[lpToken === undefined ? 0 : lpToken] : {},
  )
  const { lpPrice: v2LpPrice } = useLpPrice(
    lpToken !== undefined && pairData && pairData.length > 0
      ? pairData[lpToken === undefined ? 0 : lpToken].token0.id ===
        STABLE_COIN[chainId ?? ChainId.SCROLL_SEPOLIA].address.toLowerCase()
        ? pairData[lpToken === undefined ? 0 : lpToken].token1.id
        : pairData[lpToken === undefined ? 0 : lpToken].token0.id
      : '',
    lpToken !== undefined && pairData && pairData.length > 0 ? pairData[lpToken === undefined ? 0 : lpToken].id : '',
  )

  const lpPrice =
    lpToken !== undefined && pairData && pairData.length > 0
      ? pairData[lpToken === undefined ? 0 : lpToken].router === undefined
        ? v2LpPrice
        : stableLpPrice
      : 0

  const eldenPrice = useTokenPriceBaseStableCoin(ELDEN_ADDRESS)
  const aprData = useEsNFTAprs(poolAddress, eldenPrice, lpPrice, '0', (duration * DAY_IN_SECONDS).toString(), 0)

  useEffect(() => {
    if (pairList !== undefined && pairList.pairs.length > 0) {
      setPairs(pairList.pairs)
    }
  }, [pairList])

  useEffect(() => {
    if (lpToken === undefined) return
    if (!esNftList) return
    if (!pairData) return

    let status = false
    for (let i = 0; i < esNftList.pools.length; i++) {
      if (esNftList.pools[i].pairAddress === pairData[lpToken === undefined ? 0 : lpToken].id.toLowerCase()) {
        setPoolAddress(esNftList.pools[i].id)
        status = true
        break
      }
    }

    if (!status) {
      setPoolAddress(ADDRESS_ZERO)
    }
  }, [lpToken, pairData, esNftList])

  const { onApprove } = useApproveToken(
    pairData !== undefined && pairData.length > 0 ? pairData[lpToken ?? 0].id : ADDRESS_ZERO,
  )
  const { allowance, refetchAllowance } = useAllowance(
    pairData !== undefined && pairData.length > 0 ? pairData[lpToken ?? 0].id : ADDRESS_ZERO,
    poolAddress,
  )

  const handleApprove = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove(getParseUnits(amount), poolAddress)
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

  const { onCreatePosition } = useEsNFTCalls(poolAddress)
  const handleCreatePosition = async () => {
    if (amount === undefined || amount <= 0) return

    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onCreatePosition(amount.toString(), duration * DAY_IN_SECONDS)
    })
    setLoading(false)
    if (receipt?.status) {
      onDismiss()
      toastSuccess(
        'Create Position',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Create Position Success</ToastDescriptionWithTx>,
      )
    }
  }

  const { onCreatePool } = useEsNFTFactoryCalls(NFT_POOL_FACTORY_ADDRESS)
  const handleCreatePool = async () => {
    if (lpToken === undefined) return
    if (pairData === undefined) return

    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onCreatePool(pairData[lpToken ?? 0].id)
    })
    setLoading(false)
    if (receipt?.status) {
      // onDismiss()
      toastSuccess(
        'Create Pool',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Create Pool Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={`Create Position`} onDismiss={onDismiss}>
      <LiquiditySelect pairList={pairData} selectedLpToken={lpToken} onSelectLpToken={setLpToken} />
      <EBox style={{ marginTop: '20px' }}>
        <Inner>
          <Flex flexDirection="column" flexGrow={1} justifyContent="center">
            <InputAmount
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
            />
            {lpToken !== undefined && pairData !== undefined && (
              <Balance>
                BALANCE: {pairData[lpToken === undefined ? 0 : lpToken].balance}{' '}
                {pairData[lpToken === undefined ? 0 : lpToken].name}
              </Balance>
            )}
          </Flex>
          <ECircleButton
            onClick={() =>
              setAmount(
                lpToken === undefined || pairData === undefined
                  ? 0
                  : pairData[lpToken === undefined ? 0 : lpToken].balance,
              )
            }
          >
            MAX
          </ECircleButton>
        </Inner>
      </EBox>
      <EBox style={{ marginTop: '12px' }}>
        <Flex justifyContent="space-between" alignItems="center" style={{ gap: '12px' }}>
          <Text>Lock duration</Text>
          <EInputDay inputValue={duration} setInputValue={setDuration} minValue={0} maxValue={183} />
        </Flex>
      </EBox>

      <Flex flexDirection="column" mt="12px" style={{ gap: '8px' }}>
        <EEstimateItem
          label="deposit value"
          value={`${amount ? `$${(Number(amount) * lpPrice).toFixed(2)}` : '---'}`}
        />
        <EEstimateItem
          label="apr"
          value={
            aprData.apr === undefined || aprData.lockBonusAPR === undefined
              ? `---`
              : `${(aprData.apr + aprData.lockBonusAPR).toFixed(2)}%`
          }
        />
        <Flex flexDirection="column" style={{ gap: '4px', marginLeft: '10px' }}>
          <EEstimateItem
            label="farm base apr"
            value={aprData.apr === undefined ? `---` : `${aprData.apr.toFixed(2)}%`}
          />
          <EEstimateItem
            label="lock bonus apr"
            value={aprData.lockBonusAPR === undefined ? `-- - ` : `${aprData.lockBonusAPR.toFixed(2)}%`}
          />
        </Flex>
      </Flex>

      <Flex justifyContent="space-around" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          cancel
        </EButton>
        {poolAddress !== ADDRESS_ZERO ? (
          <EButton
            handleClick={amount && allowance < Number(amount) ? handleApprove : handleCreatePosition}
            disabled={amount === undefined || amount <= 0}
            isLoading={isLoading}
            mt={5}
          >
            {isLoading ? (
              <Dots>{amount && allowance < Number(amount) ? 'Approve' : 'Deposit'}</Dots>
            ) : (
              <>{amount && allowance < Number(amount) ? 'Approve' : 'Deposit'}</>
            )}
          </EButton>
        ) : (
          <EButton handleClick={handleCreatePool} disabled={lpToken === undefined} isLoading={isLoading} mt={5}>
            {isLoading ? <Dots>initialize</Dots> : <>initialize</>}
          </EButton>
        )}
      </Flex>
    </Modal>
  )
}
