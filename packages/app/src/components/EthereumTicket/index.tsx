import {useEthereumAccountAtom} from '@phala/app-store'
import {BalanceLabel, EthereumAccountModal} from '@phala/react-components'
import {useTranslation} from '@phala/react-i18n'
import React, {useState} from 'react'
import {toast} from 'react-toastify'
import styled from 'styled-components'
import {useCheckEthereumNetwork} from '../../hooks/useCheckEthereumNetwork'
import useEthereumAccountBalanceETHDecimal from '../../hooks/useEthereumAccountBalanceETHDecimal'
import Ticket, {
  DefaultStatus,
  DefaultStatusIcon,
  DefaultStatusName,
  TicketCurrency,
  TicketName as _TicketName,
} from '../Ticket'
import logoImage from './logo.png'

const TicketName = styled(_TicketName)`
  background: #c5cdf2;
  letter-spacing: 0;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 8px;
  color: #000000;
`

const EthereumTicket: React.FC = () => {
  const {t} = useTranslation()
  const [ethereumAccount] = useEthereumAccountAtom()
  const {value: ethereumAccountBalanceETHDecimal} =
    useEthereumAccountBalanceETHDecimal()
  const [selectAccountModalViable, setSelectAccountModalViable] =
    useState(false)
  const isTheCurrentNetworkCorrect = useCheckEthereumNetwork()

  const openAccountSelectModal = () => {
    if (isTheCurrentNetworkCorrect) {
      setSelectAccountModalViable(true)
    } else {
      toast(
        <div>
          <h1>{t('metamask_wrong_network_title')}</h1>
          <p>{t('metamask_wrong_network_description')}</p>
        </div>
      )
    }
  }

  return (
    <>
      {!ethereumAccount || !isTheCurrentNetworkCorrect ? (
        <Ticket
          onClick={openAccountSelectModal}
          cover={
            <DefaultStatus>
              <DefaultStatusIcon>
                <img src={logoImage} alt="logo" />
              </DefaultStatusIcon>
              <DefaultStatusName>{t('metamask_link')}</DefaultStatusName>
            </DefaultStatus>
          }
        ></Ticket>
      ) : (
        <Ticket
          onClick={openAccountSelectModal}
          themeColor={'black'}
          no={ethereumAccount?.address}
          name={<TicketName>Ethereum</TicketName>}
          bottomContent={
            <>
              <BalanceLabel value={ethereumAccountBalanceETHDecimal} />
              <TicketCurrency>ETH</TicketCurrency>
            </>
          }
        />
      )}

      <EthereumAccountModal
        onClose={() => setSelectAccountModalViable(false)}
        visible={selectAccountModalViable}
      />
    </>
  )
}

export default EthereumTicket
