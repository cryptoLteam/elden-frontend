import { styled } from "styled-components";
import type {} from "csstype";

const Box = styled.div`
  border: 2px solid gray;
  position: relative;
  min-height: 40px;
  padding: 12px;
`

const TopLeft = styled.img`
  position: absolute;
  top: -2px;
  left: -2px;
`

const BottomRight = styled.img`
  position: absolute;
  bottom: -2px;
  right: -2px;
`

const EBox = (props: any) => {
  return (
    <Box {...props}>
      <TopLeft src="/efi/big-box-top-left-corner.png" />
      <BottomRight src="/efi/big-box-bottom-right-corner.png" />
      {props.children}
    </Box>
  )
}

export const Card = styled(EBox)<{
  width?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
}>`
  width: ${({ width }) => width ?? "100%"};
  padding: ${({ padding }) => padding ?? "1.25rem"};
  border: ${({ border }) => border};
`;

export const LightGreyCard = styled(Card)`
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
`;

