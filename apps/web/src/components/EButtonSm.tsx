import styled from 'styled-components'
import EBoxSm from './EBoxSm'

const ButtonContainer = styled(EBoxSm)`
  font-size: 13px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s;
  padding: 0 20px;
  &:hover {
    opacity: 0.65;
  }
`

const ActiveButtonContainer = styled(ButtonContainer)`
  box-shadow: 0 0 2px 2px gray;
`

const EButtonSm = ({ children, onClick = undefined, isActive = false, ...rest }) => {
  if (isActive) {
    return <ActiveButtonContainer {...rest}>{children}</ActiveButtonContainer>
  }
  return (
    <ButtonContainer {...rest} onClick={onClick}>
      {children}
    </ButtonContainer>
  )
}

export default EButtonSm
