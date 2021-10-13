import {
  decimalToBalance,
  useApiPromise,
  useDecimalJsTokenDecimalMultiplier,
  useTransferSubmit,
} from '@phala/react-libs'
import {Hash} from '@polkadot/types/interfaces'
import {Decimal} from 'decimal.js'
import {getAddress} from 'ethers/lib/utils'
import React, {useMemo, useState} from 'react'
import {SubmitStepProps} from '.'
import {useKhalaBridgeFee} from '..'
import {
  Alert,
  Button,
  KhalaToEthereumFee,
  ModalAction,
  ModalActions,
  Spacer,
} from '../..'
import {Link} from '../../Announcement/styledComponents'
import {StepProps} from '../BridgeProcess'
import useTransactionInfo from '../hooks/useTransactionInfo'
import BaseInfo from './BaseInfo'

type Props = SubmitStepProps & StepProps

const SubmitStepToEthereum: React.FC<Props> = (props) => {
  const {onSubmit, onPrev, onSuccess, layout, data} = props
  const {from, to, amount: amountFromPrevStep} = data || {}
  const {account: accountFrom} = from || {}
  const {account: accountTo} = to || {}
  const {api} = useApiPromise()
  const decimals = useDecimalJsTokenDecimalMultiplier(api)
  const transferSubmit = useTransferSubmit(42)
  const [submittedHash, setSubmittedHash] = useState<Hash>()
  const [isSubmitting, setSubmitting] = useState<boolean>(false)
  const [progressIndex, setProgressIndex] = useState(-1)
  const {transactionInfo} = useTransactionInfo(data)
  const {fee} = useKhalaBridgeFee()

  const amount = useMemo(() => {
    if (!amountFromPrevStep || !api || !decimals) return

    return decimalToBalance(new Decimal(amountFromPrevStep), decimals, api)
  }, [amountFromPrevStep, api, decimals])

  const submit = async () => {
    if (!accountTo || !amount || !accountFrom) {
      return
    }

    try {
      setSubmitting(true)
      onSubmit?.()

      const accountToAddress = getAddress(accountTo)

      await transferSubmit?.(
        amount,
        accountToAddress,
        accountFrom,
        (status) => {
          console.warn('status.hash', status.hash.toHuman(), status)
          if (status.isReady) {
            setProgressIndex(0)
          } else if (status.isBroadcast) {
            setProgressIndex(1)
          } else if (status.isInBlock) {
            setProgressIndex(2)
          } else if (status.isFinalized) {
            setProgressIndex(3)
            setSubmittedHash(status.hash)
          }
        }
      )
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* from amount add bridge fee is the finally amount */}
      <BaseInfo
        layout={layout}
        data={{
          ...transactionInfo,
          from: {
            ...transactionInfo.from,
            amount: new Decimal(fee ?? 0)
              .add(transactionInfo.from.amount)
              .toNumber(),
          },
        }}
      />

      <Spacer></Spacer>

      <Alert>
        {progressIndex === -1 ? (
          <span>
            This transaction will charge an additional{' '}
            <span style={{fontWeight: 'bold'}}>
              {fee?.toFixed(2) || '...'} PHA
            </span>{' '}
            bridge fee to cover the Ethereum gas fee (up to 120 GWei price). The
            transaction may take some time ranged from a few seconds to a few
            hours, depending on if the Ethereum blockchain is congested. In the
            case of congestion, it may be necessary to wait for more than 24h.
          </span>
        ) : (
          <span>
            The transaction may take some time ranged from a few seconds to a
            few hours, depending on if the Ethereum blockchain is congested. In
            the case of congestion, it may be necessary to wait for more than
            24h. You can follow each step of the transaction through{' '}
            <Link
              target="_blank"
              href={`https://phala-testnet.subscan.io/account/${transactionInfo.from.address}?tab=transfer`}
            >
              Khala&apos;s explorer
            </Link>{' '}
            and{' '}
            <Link
              target="_blank"
              href={`https://kovan.etherscan.io/address/${transactionInfo.to.address}#tokentxns`}
            >
              Ethereum&apos;s explorer
            </Link>{' '}
            once you confirm it. If it has not arrived after 24 hours, you can
            post on the{' '}
            <Link
              target="_blank"
              href={`https://forum.phala.network/c/support/function/33`}
            >
              forum
            </Link>{' '}
            or leave a message on{' '}
            <Link
              target="_blank"
              href={`https://discord.com/invite/SvdKgHfhTG#product-feedback`}
            >
              Discord #product-feedback
            </Link>{' '}
            for support.
          </span>
        )}
      </Alert>

      {/* <Alert>
        {progressIndex >= 0 && (
          <KhalaProcess
            khalaAddress={transactionInfo.from.address}
            etherscanAddress={transactionInfo.to.address}
            progressIndex={progressIndex}
          />
        )}
      </Alert> */}

      {submittedHash && (
        <ModalActions>
          <ModalAction>
            <Button type="primary" onClick={onPrev}>
              Done
            </Button>
          </ModalAction>
        </ModalActions>
      )}

      {!submittedHash && (
        <ModalActions>
          <KhalaToEthereumFee
            style={{padding: 8, flex: 1}}
          ></KhalaToEthereumFee>

          {onPrev && !isSubmitting && (
            <ModalAction>
              <Button onClick={onPrev}>Back</Button>
            </ModalAction>
          )}
          {(onSubmit || onSuccess) && (
            <ModalAction>
              <Button loading={isSubmitting} type="primary" onClick={submit}>
                {isSubmitting ? 'Submitting' : 'Submit'}
              </Button>
            </ModalAction>
          )}
        </ModalActions>
      )}
    </>
  )
}

export default SubmitStepToEthereum
