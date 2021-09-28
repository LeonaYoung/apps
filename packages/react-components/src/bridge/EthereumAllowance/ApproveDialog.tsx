import {ethereums} from '@phala/app-config'
import {useTranslation} from '@phala/react-i18n'
import {
  useErc20Contract,
  useEthers,
  useTransactionReceiptQuery,
} from '@phala/react-libs'
import {ethers} from 'ethers'
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Button, Modal, ModalAction, ModalActions} from '../..'

type Props = {
  visible: boolean
  onClose(): void
}

const Content = styled.div`
  font-size: 12px;
  line-height: 14px;
  color: #878787;
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
`

const ApproveDialog: React.FC<Props> = (props) => {
  const {t} = useTranslation()
  const {visible, onClose} = props
  const {contract} = useErc20Contract()
  const {provider, signer} = useEthers()
  const [isSubmitting, setSubmitting] = useState<boolean>(false)
  const [approveHash, setApproveHash] = useState('')
  const {data: receipt} = useTransactionReceiptQuery(approveHash)

  const startApprove = async () => {
    try {
      const network = ethereums[provider?.network.chainId as number]

      if (
        contract === undefined ||
        network === undefined ||
        signer === undefined
      ) {
        return
      }

      const contractSigned = contract.connect(signer)

      const approveResult = await contractSigned.functions['approve']?.(
        network.erc20AssetHandler,
        ethers.utils.parseUnits('11451419810', 18)
      )

      setApproveHash(approveResult.hash)
      setSubmitting(true)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (receipt && receipt?.confirmations > 0) {
      setSubmitting(false)
      onClose()
    }
  }, [receipt, onClose])

  return (
    <Modal visible={visible} title={t('bridge.approve_pha')}>
      <Content>{t('bridge.approve_pha_description')}</Content>

      <ModalActions>
        <ModalAction full>
          <Button onClick={onClose}>{t('bridge.reject')}</Button>
        </ModalAction>
        <ModalAction full>
          <Button loading={isSubmitting} type="primary" onClick={startApprove}>
            {t('bridge.confirm')}
          </Button>
        </ModalAction>
      </ModalActions>
    </Modal>
  )
}

export default ApproveDialog
