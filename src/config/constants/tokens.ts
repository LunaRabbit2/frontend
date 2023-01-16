import { ChainId, Token } from '@pancakeswap/sdk'
import { serializeToken } from '@/helpers/utils'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

const defineTokens = <T extends TokenList>(t: T) => t

export const mainnetTokens = defineTokens({
  lunar: new Token(
    MAINNET,
    '0xcf136913c4583ad8d12190dea731e6fa75f45e95',
    18,
    'LUNA',
    'Lunar Rabbit Token',
    '',
  ),
} as const)

export const testnetTokens = defineTokens({
  lunar: new Token(
    TESTNET,
    '0x8859f999E683cB6FfA1f558c9ab14e9c11C1a7cb',
    18,
    'LUNA',
    'Lunar Rabbit Token',
    '',
  ),
} as const)

const tokens = () => {
  const chainId = process.env.VUE_APP_PUBLIC_CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    }, {} as typeof testnetTokens & typeof mainnetTokens)
  }

  return mainnetTokens
}

const unserializedTokens = tokens()

type SerializedTokenList = Record<keyof typeof unserializedTokens, SerializedToken>

export const serializeTokens = () => {
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {} as SerializedTokenList)

  return serializedTokens
}

export default unserializedTokens
