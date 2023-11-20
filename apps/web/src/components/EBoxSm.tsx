import styled from 'styled-components'

const Box = styled.div`
  border: 1px solid gray;
  border-radius: 4px;
  position: relative;
  min-height: 32px;
`

const BottomLeft = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
`

const BottomRight = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
`

const ActiveBoxContainer = styled(Box)`
  box-shadow: 0 0 2px 2px gray;
`

const EBoxSm = ({ children, isActive = false, ...rest }) => {
  if (isActive) {
    return <ActiveBoxContainer {...rest}>{children}</ActiveBoxContainer>
  }

  return (
    <Box {...rest}>
      <BottomLeft src="/efi/small-box-bottom-left-corner.png" />
      <BottomRight src="/efi/small-box-bottom-right-corner.png" />
      {children}
    </Box>
  )
}

export default EBoxSm
