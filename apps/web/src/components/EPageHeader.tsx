import { Flex } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import styled from 'styled-components'

const Divider = styled.img`
  width: auto;
  @media screen and (max-width: 500px) {
    width: 100%;
  }
`

interface EPageHeaderProps {
  pageName: string
  children?: ReactNode
}

const EPageHeader = ({ pageName, children }: EPageHeaderProps) => {
  return (
    <Flex flexDirection="column" position="relative" alignItems="center">
      <img src={`/efi/pages/${pageName}-title.png`} alt={pageName} />
      <Divider src="/efi/divider.png" style={{ marginTop: -16 }} alt="divider" />
      {children}
    </Flex>
  )
}

export default EPageHeader
