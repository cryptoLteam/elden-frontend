import { Currency } from '@pancakeswap/swap-sdk-core'
import { CopyAddress, Flex, Text } from '@pancakeswap/uikit'
import { DoubleCurrencyLogo } from '@pancakeswap/widgets-internal'
import { useCurrency } from 'hooks/Tokens'
import styled from 'styled-components'

const Row = styled(Flex)`
  max-width: 420px;
  align-items: center;
  cursor: pointer;
  padding: 8px 4px;
  transition: 0.3s background;
  border-radius: 4px;

  &:hover {
    background: #33333333;
  }
`

const RunePoolRow = ({ runePool, selectedRunePool, setSelectedRunePool }) => {
  const token0 = useCurrency(runePool?.pair.token0.id) as Currency
  const token1 = useCurrency(runePool?.pair.token1.id) as Currency

  return (
    <Row key={runePool.id} onClick={(e) => setSelectedRunePool(runePool.id)}>
      <DoubleCurrencyLogo currency0={token0} currency1={token1} size={32} />

      <Text ml="8px" fontSize="14px" width="140px">
        {runePool?.pair.name}
      </Text>

      <CopyAddress tooltipMessage="copied" account={runePool?.id} />

      <Flex width="40px" ml="12px">
        {selectedRunePool === runePool.id && (
          <img src="/efi/icons/circle-checked.png" width={18} height={18} alt="checked" />
        )}
      </Flex>
    </Row>
  )
}

export default RunePoolRow
