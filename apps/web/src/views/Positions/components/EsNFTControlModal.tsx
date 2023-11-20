import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import {
  Dots,
  EBoost,
  ELock,
  EStake,
  EPlus,
  EWithdraw,
  Flex,
  Modal,
  Text,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import useRunePoolCalls from 'views/RunePools/hooks/useRunePoolCalls'
import useCatchTxError from 'hooks/useCatchTxError'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import EButton from 'components/EButton'
import EBoxSm from 'components/EBoxSm'
import EEstimateItem from 'components/EEstimateItem'
import { ToastDescriptionWithTx } from 'components/Toast'
import { AddPositionModal } from './AddPositionModal'
import BoosterModal from './BoosterModal'
import { LockModal } from './LockModal'
import { WithdrawModal } from './WithdrawModal'
import { StakeModal } from './StakeModal'
import useEsNFTCalls from '../hooks/useEsNFTCalls'
import { EsNFTData } from '../hooks/useEsNFTCardData'

const ControlButton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  text-align: center;
  align-items: center;
  transition: background 0.3s;
  width: 70px;

  img {
    width: 60px;
    height: 60px;
    padding: 10px;
    background: #22222222;
    border-radius: 4px;

    &:hover {
      background: #33333333;
    }
  }

  &.disabled {
    opacity: 0.4;
  }
`
const PropertyCard = styled(EBoxSm)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 48px;
  padding: 4px 16px;
  gap: 4px;
`

export interface EsNFTControlModalProps {
  onDismiss?: Handler
  mode?: string
  data: EsNFTData
  runeStakingPosition?: any
  onRefetchNftData: () => void
  runePoolApr?: any
}

export const EsNFTControlModal: React.FC<React.PropsWithChildren<EsNFTControlModalProps>> = ({
  onDismiss,
  data,
  runeStakingPosition = undefined,
  onRefetchNftData,
  runePoolApr = undefined,
}) => {
  const [onPresentAddPositionModal] = useModal(<AddPositionModal data={data as EsNFTData} />)
  const [onPresentBoosterModal] = useModal(
    <BoosterModal data={data as EsNFTData} onRefetchNftData={onRefetchNftData} />,
  )
  const [onPresentLockModal] = useModal(<LockModal data={data as EsNFTData} onRefetchNftData={onRefetchNftData} />)
  const [onPresentWithdrawPositionModal] = useModal(<WithdrawModal data={data as EsNFTData} />)
  const [onPresentStakeModal] = useModal(<StakeModal data={data as EsNFTData} onRefetchNftData={onRefetchNftData} />)

  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [isLoading, setLoading] = useState(false)
  const [isStaked, setStaked] = useState(false)

  const [runeApr, setRuneApr] = useState<number | undefined>(undefined)

  const { onHarvest, onHarvestTo } = useEsNFTCalls(data.poolAddress)

  const { onWithdraw } = useRunePoolCalls(runeStakingPosition?.nftStakingPosition.owner)

  const handleHarvest = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onHarvest(data.nftId)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchNftData()
      toastSuccess(
        'Harvest',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleHarvestTo = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onHarvestTo(data.nftId)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchNftData()
      toastSuccess(
        'Harvest',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleWithdraw = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onWithdraw(data.nftId)
    })
    if (receipt?.status) {
      setStaked(false)
      onRefetchNftData()
      onDismiss()
      toastSuccess(
        'Withdraw',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deallocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  useEffect(() => {
    if (!runePoolApr) return
    let _runeApr = 0
    if (runePoolApr.apr1) _runeApr += runePoolApr.apr1
    if (runePoolApr.apr2) _runeApr += runePoolApr.apr2
    setRuneApr(_runeApr)
  }, [runePoolApr])

  useEffect(() => {
    if (runeStakingPosition) {
      setStaked(true)
    }
  }, [runeStakingPosition])

  const markComponent = (status: boolean) => {
    if (status) return <img src="/efi/icons/circle-checked.png" width={20} height={20} alt="icon" />
    return <img src="/efi/icons/circle-unchecked.png" width={20} height={20} alt="icon" />
  }

  return (
    <Modal title={`${data.name} ${data.type} esNFT`} onDismiss={onDismiss} style={{ width: '420px' }}>
      <Text textAlign="center" fontSize="18px">
        ${data.value.toFixed(2)} -{' '}
        {(
          Number(data.farmBaseAPR) +
          Number(data.lockBonusAPR) +
          Number(data.boostBonusAPR) +
          Number(runeApr !== undefined ? runeApr : 0)
        ).toFixed(2)}
        % APR
      </Text>
      <Text textAlign="center" fontSize="16px">{`this position has $${Number(
        data.pending.toFixed(2),
      )} pending farming rewards`}</Text>

      {isStaked ? (
        <Flex style={{ gap: '4px' }} my="20px">
          <ControlButton className="disabled">
            <EPlus width="32px" height="32px" />
            <Text fontSize="12px">ADD</Text>
          </ControlButton>
          <ControlButton className="disabled">
            <EWithdraw width="32px" height="32px" />
            <Text fontSize="12px">WITHDRAW</Text>
          </ControlButton>
          <ControlButton className="disabled">
            <ELock width="32px" height="32px" />
            <Text fontSize="12px">LOCK</Text>
          </ControlButton>
          <ControlButton className="disabled">
            <EBoost width="32px" height="32px" />
            <Text fontSize="12px">YIELD BOOST</Text>
          </ControlButton>
          <ControlButton onClick={handleWithdraw}>
            <EStake width="32px" height="32px" />
            <Text fontSize="12px">UNSTAKE</Text>
          </ControlButton>
        </Flex>
      ) : (
        <Flex style={{ gap: '4px' }} my="20px">
          <ControlButton onClick={onPresentAddPositionModal}>
            <EPlus width="32px" height="32px" />
            <Text fontSize="12px">ADD</Text>
          </ControlButton>
          <ControlButton onClick={onPresentWithdrawPositionModal}>
            <EWithdraw width="32px" height="32px" />
            <Text fontSize="12px">WITHDRAW</Text>
          </ControlButton>
          <ControlButton onClick={onPresentLockModal}>
            <ELock width="32px" height="32px" />
            <Text fontSize="12px">LOCK</Text>
          </ControlButton>
          <ControlButton onClick={onPresentBoosterModal}>
            <EBoost width="32px" height="32px" />
            <Text fontSize="12px">YIELD BOOST</Text>
          </ControlButton>
          <ControlButton onClick={onPresentStakeModal}>
            <EStake width="32px" height="32px" />
            <Text fontSize="12px">STAKE IN RUNE</Text>
          </ControlButton>
        </Flex>
      )}

      <Flex flexDirection="column" style={{ gap: '8px' }}>
        <Text fontSize="12px">PROPERTIES</Text>
        <PropertyCard>
          {markComponent(Number(data.allocPoint) > 0)}
          <Text>{Number(data.allocPoint) > 0 ? 'yield-earning' : 'non yield-earning'}</Text>
        </PropertyCard>
        <PropertyCard>
          {markComponent(Number(data?.startLockTime) + Number(data?.lockDuration) > Date.now() / 1000)}
          <Text>
            {Number(data?.startLockTime) + Number(data?.lockDuration) > Date.now() / 1000 ? 'locked' : 'unlocked'}
          </Text>
        </PropertyCard>
        <PropertyCard>
          {markComponent(Number(data.boostPoints) > 0)}
          <Text>{Number(data.boostPoints) > 0 ? 'boosted' : 'unboosted'}</Text>
        </PropertyCard>
        <PropertyCard>
          {markComponent(isStaked)}
          <Text>{isStaked ? '' : 'not'} staked in a Rune pool</Text>
        </PropertyCard>
      </Flex>

      <Text textAlign="center" fontSize="20px" py="20px">
        data breakdown
      </Text>

      <Flex flexDirection="column" style={{ gap: '4px' }}>
        <EEstimateItem label="value" value={`$${data.value.toFixed(2)}`} />
        <EEstimateItem
          label="apr"
          value={`${(
            Number(data.farmBaseAPR) +
            Number(data.lockBonusAPR) +
            Number(data.boostBonusAPR) +
            Number(runeApr !== undefined ? runeApr : 0)
          ).toFixed(2)}%`}
        />
        <Flex flexDirection="column" style={{ gap: '4px', marginLeft: '10px' }}>
          {/* <EEstimateItem label="swap fees apr" value={`${data.apr.toFixed(2)}%`} /> */}
          <EEstimateItem label="farm base apr" value={`${data.farmBaseAPR.toFixed(2)}%`} />
          <EEstimateItem
            label="farm bonus apr"
            value={`${(Number(data.boostBonusAPR) + Number(data.lockBonusAPR)).toFixed(2)}%`}
          />
          {runeApr !== undefined && <EEstimateItem label="rune pool apr" value={`${runeApr.toFixed(2)}%`} />}
        </Flex>
        <EEstimateItem label="pending rewards" value={<>${Number(data.pending.toFixed(2))}</>} />
      </Flex>

      <Flex style={{ gap: '12px' }} justifyContent="space-around" mt="20px">
        <EButton handleClick={onDismiss} mt={5}>
          close
        </EButton>
        <EButton disabled={isLoading} handleClick={runeStakingPosition ? handleHarvestTo : handleHarvest} mt={5}>
          {isLoading ? <Dots>harvest</Dots> : 'harvest'}
        </EButton>
      </Flex>
    </Modal>
  )
}
