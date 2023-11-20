import styled from 'styled-components'

const ButtonContainer = styled.div`
  background-image: url('/efi/circle-image.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  width: 40px;
  min-width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  cursor: pointer;
  transition: opacity 0.3s;
  color: white;
  &:hover {
    opacity: 0.8;
  }
`
const DisabledButtonContainer = styled.div`
  background-image: url('/efi/circle-image-dim.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  width: 40px;
  min-width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  cursor: pointer;
  color: gray;
`

const ECircleButton = (props: any) => {
  if (props.disabled) {
    return (
      <DisabledButtonContainer onClick={props.onClick}>
        <span style={{ marginTop: props.mt || 0, color: 'gray', fontSize: props.fontSize || 10 }}>
          {props.children}
        </span>
      </DisabledButtonContainer>
    )
  }
  return (
    <ButtonContainer onClick={props.onClick}>
      <span style={{ marginTop: props.mt || 0, fontSize: props.fontSize || 10 }}>{props.children}</span>
    </ButtonContainer>
  )
}

export default ECircleButton
