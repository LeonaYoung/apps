export const networks = [
  {
    label: 'Khala',
    name: 'Khala',
  },
  {
    label: 'Karura',
    name: 'Karura',
  },
  {
    label: 'Evm',
    name: 'Evm',
  },
]

export const coins = [
  {
    label: 'PHA',
    name: 'PHA',
  },
  {
    label: 'KHR',
    name: 'KHR',
  },
  {
    label: 'ETH',
    name: 'ETH',
  },
]

export enum Transfers {
  transferPHAFromKhalaToKarura = 'transferPHAFromKhalaToKarura',
  transferPHAFromKaruraToKhala = 'transferPHAFromKaruraToKhala',
  transferKARFromKaruraToKhala = 'transferKARFromKaruraToKhala',
  transferKARFromKhalaToKarura = 'transferKARFromKhalaToKarura',
  transferAssetsKhalaAccounts = 'transferAssetsKhalaAccounts',
  transferPhaFromEvmToKhala = 'transferPhaFromEvmToKhala',
  transferPhaFromEvmToKarura = 'transferPhaFromEvmToKarura',
}
