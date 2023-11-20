import { ContextApi } from '@pancakeswap/localization'
import { DropdownMenuItems, MenuItemsType, SwapFillIcon, SwapIcon } from '@pancakeswap/uikit'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('swap'),
      href: '/swap',
      showItemsOnMobile: true,
    },
    {
      label: t('liquidity'),
      href: '/add',
      showItemsOnMobile: true,
    },
    {
      label: t('positions'),
      href: '/positions',
      showItemsOnMobile: true,
    },
    {
      label: t('rune pools'),
      href: '/runepools',
      showItemsOnMobile: true,
    },
    {
      label: t('Selden'),
      href: '/selden',
      showItemsOnMobile: true,
      items: [
        {
          label: t('dashboard'),
          href: '/selden',
          showItemsOnMobile: true,
        },
        {
          label: t('dividends'),
          href: '/selden/dividends',
          showItemsOnMobile: true,
        },
        {
          label: t('launchpad'),
          href: '/selden/launchpad',
          showItemsOnMobile: true,
        },
        {
          label: t('yield booster'),
          href: '/selden/booster',
          showItemsOnMobile: true,
        },
      ],
    },
    {
      label: t('launchpad'),
      href: '/launchpad',
      showItemsOnMobile: true,
    },
    {
      label: t('gauge'),
      href: '/gauge',
      showItemsOnMobile: true,
    },
    {
      label: t('analytics'),
      href: '/info',
      showItemsOnMobile: true,
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
