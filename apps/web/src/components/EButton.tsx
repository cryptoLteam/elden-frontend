import { AutoRenewIcon } from '@pancakeswap/uikit'
import { ReactNode, useCallback } from 'react'
import styled from 'styled-components'

const ButtonContainer = styled.div`
  background-image: url('/efi/button-image.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  width: 140px;
  min-width: 140px;
  height: 35px;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 20px;
  cursor: pointer;
  transition: opacity 0.3s;
  align-self: center;
  &:hover {
    opacity: 0.65;
  }
`
const DisabledButtonContainer = styled.div`
  background-image: url('/efi/button-image-dim.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  width: 140px;
  min-width: 140px;
  height: 35px;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 20px;
  cursor: not-allowed;
  align-self: center;
`

interface EButtonProps {
  children: ReactNode
  disabled?: boolean
  isLoading?: boolean
  mt?: number
  handleClick?: () => void
  style?: any
}

const EButton = ({ children, handleClick, disabled, isLoading, mt, style }: EButtonProps) => {
  if (disabled) {
    return (
      <DisabledButtonContainer style={style}>
        <span style={{ marginTop: mt || 0, color: 'gray' }}>{children}</span>
      </DisabledButtonContainer>
    )
  }

  if (isLoading) {
    return (
      <DisabledButtonContainer style={style}>
        <span style={{ marginTop: mt || 0, color: 'gray' }}>{children}</span>
      </DisabledButtonContainer>
    )
  }

  return (
    <ButtonContainer onClick={handleClick} style={style}>
      <span style={{ marginTop: mt || 0 }}>{children}</span>
    </ButtonContainer>
  )
}

export default EButton
