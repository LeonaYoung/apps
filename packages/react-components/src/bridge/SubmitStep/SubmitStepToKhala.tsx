import { useTransactionsInfoAtom } from '@phala/app-store'
import { TransactionInfoItem } from '@phala/app-types'
import { useErc20Deposit } from '@phala/react-libs/esm/ethereum/bridge/deposit'
import { useErc20BalanceQuery } from '@phala/react-libs/esm/ethereum/queries/useErc20BalanceQuery'
import { useTransactionReceiptQuery } from '@phala/react-libs/esm/ethereum/queries/useTransactionReceiptQuery'
import { isDev, isTest } from '@phala/utils'
import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { SubmitStepProps } from '.'
import { Alert, Button, ModalAction, ModalActions, Spacer } from '../..'
import { StepProps } from '../BridgeProcess'
import useTransactionInfo from '../hooks/useTransactionInfo'
import BaseInfo from './BaseInfo'

const Link = styled.a`
  text-decoration: underline;
  color: black;
`

type Props = SubmitStepProps & StepProps

const SubmitStepToKhala: React.FC<Props> = (props) => {
  const [transactionsInfoSuccess, setTransactionsInfoSuccess] = useState(false)
  const [transactionsInfo, setTransactionsInfo] = useTransactionsInfoAtom()
  const { onSubmit, onPrev, onSuccess, layout, data } = props
  const { from, to, amount: amountFromPrevStep } = data || {}
  const { account: accountFrom } = from || {}
  const { account: accountTo } = to || {}
  const submitDeposit = useErc20Deposit(accountFrom)
  const [isSubmitting, setSubmitting] = useState<boolean>(false)
  const { transactionInfo } = useTransactionInfo(data)
  const [currentTransactionInfo, setCurrentTransactionInfo] = useState<{
    hash: string | undefined
    from: TransactionInfoItem
    to: TransactionInfoItem
  }>()
  const { isLoading: isReceiptLoading, data: receipt } =
    useTransactionReceiptQuery(currentTransactionInfo?.hash)
  const { refetch } = useErc20BalanceQuery(accountFrom)

  let link = ''

  if (currentTransactionInfo?.hash) {
    if (isTest() || isDev()) {
      link = `https://kovan.etherscan.io/tx/${currentTransactionInfo.hash}`
    } else {
      link = `https://etherscan.io/tx/${currentTransactionInfo.hash}`
    }
  }

  const submit = async () => {
    setSubmitting(true)

    const recipient = u8aToHex(decodeAddress(accountTo))

    try {
      const amount = ethers.utils.parseUnits(
        amountFromPrevStep?.toString() || '0',
        18
      )

      const response = await submitDeposit?.(amount, recipient)

      const newTransactionInfo = {
        ...transactionInfo,
        hash: response?.hash,
      }

      setCurrentTransactionInfo(newTransactionInfo)

      setTransactionsInfo([newTransactionInfo, ...transactionsInfo])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (receipt && receipt?.confirmations > 0) {
      refetch()
      setTransactionsInfoSuccess(true)
      setSubmitting(false)
    }
  }, [receipt, setSubmitting, setTransactionsInfoSuccess, refetch])

  return (
    <>
      <BaseInfo layout={layout} data={transactionInfo} />

      <Spacer></Spacer>

      {link ? (
        <Alert>
          <div>
            <Link href={link} target="_blank">
              Ethereum transaction
            </Link>{' '}
            is broadcasting, please check your Khala’s PHA balance later. It may
            take 2~10 minutes.
          </div>
        </Alert>
      ) : (
        <Alert>
          Please be patient as the transaction may take a few minutes.
        </Alert>
      )}

      {transactionsInfoSuccess && (
        <ModalActions>
          <ModalAction>
            <Button type="primary" onClick={onPrev}>
              Done
            </Button>
          </ModalAction>
        </ModalActions>
      )}

      {!transactionsInfoSuccess && (
        <ModalActions>
          {onPrev && !isSubmitting && !isReceiptLoading && (
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

export default SubmitStepToKhala