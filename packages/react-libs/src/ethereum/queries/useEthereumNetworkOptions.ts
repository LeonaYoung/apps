import {EthereumNetworkOptions, ethereums} from '@phala/app-config'
import {useMemo} from 'react'
import {useEthersNetworkQuery} from './useEthersNetworkQuery'

type UseEthereumNetworkOptionsResult = {
  // TODO: use type guard?
  error?: Error
  options?: EthereumNetworkOptions
}

class NetworkNotReadyError extends Error {
  constructor() {
    super('Ethereum network is not connected')
  }
}

class NetworkUndefinedError extends Error {
  public readonly chainId?: number

  public readonly networkName?: string

  constructor(chainId: number, name?: string) {
    super(
      `Connected Ethereum network is not supported: ${name ?? ''} (${chainId})`
    )
    this.chainId = chainId
    this.networkName = name
  }
}

/**
 * @param chainId Chain Id of destination Ethereum network (e.g Kovan for 42)
 */
export const useEthereumNetworkOptions = (
  chainId?: number
): UseEthereumNetworkOptionsResult => {
  const {data: network} = useEthersNetworkQuery()
  chainId = chainId ?? network?.chainId
  return useMemo<UseEthereumNetworkOptionsResult>(() => {
    if (typeof chainId !== 'number') {
      return {
        error: new NetworkNotReadyError(),
      }
    }

    const result = ethereums[chainId]

    if (result !== undefined) {
      return {options: result}
    } else {
      return {
        error: new NetworkUndefinedError(
          chainId,
          chainId === network?.chainId ? network.name : undefined
        ),
      }
    }
  }, [chainId, network?.chainId, network?.name])
}
