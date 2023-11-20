import { Box, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { EsNFTCardHeader } from 'components/EsNFTCardRow/EsNFTCardHeader'

const TableList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
`

const PositionsList = ({ children }) => {
  return (
    <TableList>
      <EsNFTCardHeader />
      {children}
    </TableList>
  )
}

export default PositionsList
