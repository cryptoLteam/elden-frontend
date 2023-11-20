import {
  DiscordIcon,
  Flex,
  GithubIcon,
  MediumIcon,
  NextLinkFromReactRouter,
  TelegramIcon,
  TwitterIcon,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import { NetworkSwitcher } from 'components/ENetworkSwitcher'
import UserMenu from '../UserMenu'

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 256px;
  font-size: 15px;
  font-weight: 700;
  border-right: 1px solid white;
  padding: 0 12px;
  z-index: 1;

  @media screen and (max-width: 851px) {
    border: none;
    position: fixed;
    width: 100%;
    height: 76px;
  }
`

const BrandImage = styled.img`
  width: 216px;
  height: 76px;
  @media screen and (max-width: 499px) {
    display: none;
  }
`
const MobileBrandImage = styled.img`
  width: 76px;
  height: 76px;
  @media screen and (min-width: 500px) {
    display: none;
  }
`

const TreeImage = styled.img`
  position: absolute;
  right: -110px;

  @media screen and (max-width: 851px) {
    display: none;
  }
`

const MenuItem = styled.div`
  padding: 8px 0 8px 32px;
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  position: relative;

  > a:hover {
    opacity: 0.65;
  }

  @media screen and (max-width: 851px) {
    display: none;
  }
`

const SubMenuItem = styled.div`
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  position: relative;

  > a:hover {
    opacity: 0.65;
  }

  @media screen and (max-width: 851px) {
    display: none;
  }
`

const MenuActive = styled.div`
  background: white;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  position: absolute;
  top: 12px;
  left: 16px;
`

const SubMenuActive = styled.div`
  background: white;
  width: 4px;
  height: 4px;
  border-radius: 8px;
  position: absolute;
  top: 8px;
  left: -8px;
`

const SocialLinks = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  padding: 24px;

  @media screen and (max-width: 851px) {
    display: none;
  }
`

const MobileMenu = styled(Flex)`
  gap: 4px;

  @media screen and (min-width: 851px) {
    display: none;
  }
`
const DesktopMenu = styled(Flex)`
  gap: 4px;
  flex-decoration: row;
  margin: 10px 2px;
  justify-content: space-around;

  @media screen and (max-width: 851px) {
    display: none;
  }
`

const LinkComponent = (linkProps: any) => {
  return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
}

const LeftMenu = ({ menuItems, activeItem, activeSubItem }) => {
  return (
    <MenuContainer>
      <Flex justifyContent="space-between">
        <BrandImage src="/efi/brand.png" />
        <MobileBrandImage src="/efi/mobile-brand.png" />
        <MobileMenu>
          <NetworkSwitcher />
          <UserMenu />
        </MobileMenu>
      </Flex>
      <TreeImage src="/efi/tree-branch.png" />

      <DesktopMenu>
        <UserMenu />
        <NetworkSwitcher />
      </DesktopMenu>

      <Flex flexDirection="column" mt={10} style={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <MenuItem key={item.label}>
            <LinkComponent href={item.href}>
              {item === activeItem && <MenuActive />}
              {item.label}
            </LinkComponent>
            {item.items ? (
              <Flex flexDirection="column" mt={16} pl={10} style={{ gap: 16 }}>
                {item.items.map((subItem) => (
                  <SubMenuItem key={subItem.label}>
                    <LinkComponent href={subItem.href} style={{ position: 'relative' }}>
                      {subItem === activeSubItem && <SubMenuActive />}
                      {subItem.label}
                    </LinkComponent>
                  </SubMenuItem>
                ))}
              </Flex>
            ) : null}
          </MenuItem>
        ))}
      </Flex>

      <SocialLinks>
        <DiscordIcon href="" target="_blank" cursor="pointer" />
        <TelegramIcon href="" target="_blank" cursor="pointer" />
        <TwitterIcon href="" target="_blank" cursor="pointer" />
        <GithubIcon href="" target="_blank" cursor="pointer" />
        <MediumIcon href="" target="_blank" cursor="pointer" />
      </SocialLinks>
    </MenuContainer>
  )
}

export default LeftMenu
