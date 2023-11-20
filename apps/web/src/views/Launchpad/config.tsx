import { ReactNode } from 'react'

export const LAUNCHPAD_ADDRESS = ''

export type LaunchListProps = {
  address: `0x${string}`
  isWhitelist: boolean
  officialSiteUrl: string
  title: string
  logoImage: string
  tokenLogo1: string
  tokenLogo2?: string
  bannerImage: string
  description: ReactNode
  siteUrl?: string
  warning?: string
  priceInfo: ReactNode
  stageInfo: {
    title: string
    stages: Array<string>
  }
  claimInfo: ReactNode
  saleTokenDecimals: number
  projectToken1Decimals: number
  projectToken2Decimals: number
}

export const LAUNCH_LIST = [
  {
    address: '0x7F92A1ee2F13c60079b8a09715F57FFE73145BC6',
    isWhitelist: false,
    saleTokenDecimals: 18,
    projectToken1Decimals: 18,
    projectToken2Decimals: 18,
    officialSiteUrl: 'https://elden.fi',
    title: 'Public sale',
    logoImage: 'https://eldenfi-tokens.netlify.app/images/symbol/elden.png',
    tokenLogo1: 'https://eldenfi-tokens.netlify.app/images/symbol/elden.png',
    tokenLogo2: 'https://eldenfi-tokens.netlify.app/images/symbol/elden.png',
    bannerImage: 'https://eldenfi-tokens.netlify.app/images/symbol/elden.png',
    siteUrl: '',
    description: (
      <>
        <p>
          Developed on Base, Elden is an immutable, decentralized, community-driven DEX with the goal of revolutionizing
          liquidity solutions.
        </p>
        <p>
          Our platform provides developers and consumers with deep and simply accessible liquidity by providing stable
          and effective liquidity settings.
        </p>
        <p>
          Providing "Real Yields" to all participants, Elden hopes to establish a new benchmark as the Liquidity Hub of
          this ecosystem, being the first of its kind on Base.
        </p>
      </>
    ),
    warning:
      'Please ensure you understand the public sale mechanics and terms before proceeding, deposited amounts CANNOT be withdrawn. The token will be sold for a fully diluted valuation (FDV) of 15M, fixing a $0.15 price per ELDEN. Your allocation will be made up of 65% ELDEN and 35% sELDEN, its escrowed counterpart.',
    priceInfo: (
      <>
        <p>
          You can contribute with ETH in exchange for ELDEN tokens, which are to be claimed 24h after the end of the
          sale.
        </p>{' '}
        <p>The tokens you will receive will have the exact same $ value than your contribution.</p>{' '}
        <p>15,000 ELDEN (of a 100,000 total supply) will be allocated to the sale. The final price will therefore be</p>
      </>
    ),
    stageInfo: {
      title: 'This presale will start on November 10th 12pm UTC, and will take place in three different stages',
      stages: [
        'During the first 12h, only whitelisted addresses can participate with a guaranteed capped allocation.',
        'During the following 12h, only whitelisted addresses can participate, with a 5x higher allocation cap.',
        'Starting November 11th @ 12pm UTC, other participants can purchase the remaining tokens on a first-come, first-served basis. This stage will last for 24 hours.',
      ],
    },
    claimInfo: (
      <>
        <p>
          The public sale will last until November 12th @ 12pm UTC. Shortly after, a LBP will take place on the Swerve
          platform.
        </p>{' '}
        <p>
          Tokens from the presale and LBP participants will be claimable at the same time liquidity is seeded, shortly
          after the end of the LBP.
        </p>{' '}
        <p>
          In order to align the long-term objectives of the protocol, the sale will be distributed in 65% of ELDEN and
          35% of sELDEN.
        </p>
      </>
    ),
  },
] as Array<LaunchListProps>
