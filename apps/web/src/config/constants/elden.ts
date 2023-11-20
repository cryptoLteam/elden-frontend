import { GraphQLClient } from 'graphql-request'

export const ELDEN_ADDRESS: `0x${string}` = '0xBfeE7D5987CC1e58126c5DCD444145633A58d30e'
export const SELDEN_ADDRESS: `0x${string}` = '0xd2A63B5D2ED5F56c4bA73200BcB9397680367E53'
export const ELDEN_MASTER: `0x${string}` = '0x919e50123dfF3A3162cD099a63A13DC070c1C24b'
export const NFT_POOL_FACTORY_ADDRESS: `0x${string}` = '0xd3688965ab1bAd07059Db2717F1D303cBA28713B'
export const YIELD_BOOSTER_ADDRESS: `0x${string}` = '0xC52D27B5961cB9ded4d0F2B3A7F065411524661f'
export const DIVIDENDS_ADDRESS: `0x${string}` = '0x49675a1253D0cC8fCf4b5F4b7b2DbE147713c915'
export const LAUNCHPAD_ADDRESS: `0x${string}` = '0x6691E7B7780B881162870b7D680E92C4cB9f7e4D'
export const POSITION_HELPER_ADDRESS: `0x${string}` = '0x4Fad5f384db0Cf2a6a62825643C86E5001BB7De2'
export const RUNE_POOL_FACTORY_ADDRESS: `0x${string}` = '0x1eB7B8ccaF6B51bA3bF6323a784d418576E0Abb0'

export const ETH_PRICE_FEED: `0x${string}` = '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e'

export const POSITIONS_SUBGRAPH = 'https://api.studio.thegraph.com/query/41589/elden-positions/version/latest'
export const positionsSubgraphClient = new GraphQLClient(POSITIONS_SUBGRAPH)
