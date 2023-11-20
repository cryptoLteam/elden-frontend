import { Input } from '@pancakeswap/uikit'
import styled from 'styled-components'

const Box = styled.div`
  border: 1px solid gray;
  width: 100%;
  border-radius: 3px;
  position: relative;
`

const BottomLeft = styled.img`
  position: absolute;
  bottom: 0px;
  left: 0px;
`

const BottomRight = styled.img`
  position: absolute;
  bottom: 0px;
  right: 0px;
`

const EInput = styled(Input)`
  width: 100%;
  background: transparent;
  outline: none;
  border: 0;
  border-radius: 3px;
  font-size: 13px;
  height: 32px;
`

const ESearchBox = (props: any) => {
  return (
    <Box
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <BottomLeft src="/efi/small-box-bottom-left-corner.png" />
      <BottomRight src="/efi/small-box-bottom-right-corner.png" />
      <EInput placeholder="Search" {...props} />
    </Box>
  )
}

export default ESearchBox
