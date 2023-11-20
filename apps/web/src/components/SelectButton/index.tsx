import { styled } from 'styled-components'
import { space } from 'styled-system'
import { LightGreyCard } from 'components/Card'

export const StyledCard = styled.button<{ isActive?: boolean }>`
  cursor: pointer;
  width: fit-content;
  background: ${({ theme, isActive }) =>
    isActive ? `linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary})` : 'inherit'};
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  position: relative;
  padding: 0;
  border-radius: 4px;
  border: 1px solid gray;

  ${space}
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

export const StyledCardInner = styled(LightGreyCard)<{ background?: string; hasCustomBorder?: boolean }>`
  width: 100%;
  height: 100%;
  overflow: ${({ hasCustomBorder }) => (hasCustomBorder ? 'initial' : 'inherit')};
  background: ${({ theme, background }) => background ?? theme.card.background};
`

export function SelectButton({ children, isActive, ...props }) {
  return (
    <StyledCard isActive={isActive}>
      <BottomLeft src="/efi/small-box-bottom-left-corner.png" />
      <BottomRight src="/efi/small-box-bottom-right-corner.png" />
      <StyledCardInner padding="8px" {...props}>
        {children}
      </StyledCardInner>
    </StyledCard>
  )
}
