import {Button} from '@phala/react-components'
import {StakePool} from '@phala/react-hooks'
import {useTranslation} from '@phala/react-i18n'
import {toFixed} from '@phala/utils'
import {useMemo, useState} from 'react'
import {Column} from 'react-table'
import styled from 'styled-components'
import useFormat from '../../hooks/useFormat'
import useModalVisible, {ModalKey} from '../../hooks/useModalVisible'
import useSelfStakePools from '../../hooks/useSelfStakePools'
import ItemMenu from '../ItemMenu'
import MiningTable from '../MiningTable'
import AddWorkerModal from './AddWorkerModal'
import ClaimModal from './ClaimModal'
import CreateModal from './CreateModal'
import DelegateModal from './DelegateModal'
import SetCapModal from './SetCapModal'
import SetPayoutPrefModal from './SetPayoutPrefModal'
import StakeInfoModal from './StakeInfoModal'
import WithdrawModal from './WithdrawModal'

const Actions = styled.div`
  align-items: center;
  display: flex;
`
const DetailButton = styled.span`
  text-decoration: underline;
  cursor: pointer;
  font-weight: bold;
`

export type StakePoolModalProps = {onClose: () => void; stakePool: StakePool}

const modalEntries: [ModalKey, (props: StakePoolModalProps) => JSX.Element][] =
  [
    ['claim', ClaimModal],
    ['delegate', DelegateModal],
    ['addWorker', AddWorkerModal],
    ['setCap', SetCapModal],
    ['setPayoutPref', SetPayoutPrefModal],
    ['stakeInfo', StakeInfoModal],
    ['withdraw', WithdrawModal],
  ]

const StakePoolTable = (): JSX.Element => {
  const {t} = useTranslation()
  const {modalVisible, open, close, visibleCount} = useModalVisible()
  const [selectedPid, setSelectedPid] = useState<number | null>(null)
  const {data, refetch, isLoading} = useSelfStakePools()
  const format = useFormat()

  const selectedStakePool = useMemo<StakePool | null>(
    () =>
      (data &&
        typeof selectedPid === 'number' &&
        data.find((v) => v.pid === selectedPid)) ||
      null,
    [data, selectedPid]
  )

  const columns = useMemo<Column<StakePool>[]>(
    () => [
      {
        name: 'pid',
        Header: 'pid',
        accessor: (stakePool) => (
          <span style={{fontWeight: 'bold'}}>{stakePool.pid}</span>
        ),
      },
      {
        name: t('delegate.worker'),
        Header: 'Worker',
        accessor: (stakePool) => stakePool.workers.length,
      },
      {
        name: t('delegate.commission'),
        Header: 'Commission',
        accessor: (stakePool) =>
          `${toFixed(stakePool.payoutCommission.div(10 ** 4), 2)}%`,
      },
      {
        name: t('delegate.remaining'),
        Header: 'Remaining',
        accessor: (stakePool) =>
          stakePool.cap === null
            ? '∞'
            : format(stakePool.cap.sub(stakePool.totalStake)),
      },
      {
        name: t('mining.owner_reward'),
        Header: 'Owner Reward',
        accessor: (stakePool) => format(stakePool.ownerReward),
      },
      {
        name: t('mining.delegated'),
        Header: 'Delegated',
        accessor: (stakePool) => format(stakePool.totalStake),
      },
      {
        name: t('delegate.free_delegation'),
        Header: 'Free Delegation',
        accessor: (stakePool) => format(stakePool.freeStake),
      },
      {
        name: t('delegate.releasing_stake'),
        Header: 'Releasing Stake',
        accessor: (stakePool) => format(stakePool.releasingStake),
      },
      {
        id: 'actions',
        name: t('delegate.actions'),
        accessor: (stakePool) => (
          <Actions>
            <DetailButton
              onClick={() => {
                setSelectedPid(stakePool.pid)
                open('stakeInfo')
              }}
            >
              {t('mining.info')}
            </DetailButton>
            <ItemMenu
              items={[
                {key: 'addWorker', item: t('mining.add_worker')},
                {key: 'setCap', item: t('mining.set_cap')},
                {key: 'claim', item: t('mining.claim')},
                {key: 'setPayoutPref', item: t('mining.set_commission')},
              ]}
              onClick={(key) => {
                setSelectedPid(stakePool.pid)
                open(key as ModalKey)
              }}
            ></ItemMenu>
          </Actions>
        ),
        disableSortBy: true,
      },
    ],
    [format, open]
  )
  return (
    <>
      <MiningTable
        title={t('mining.stakepool')}
        header={
          <Button
            type="primary"
            size="small"
            style={{marginLeft: 10}}
            onClick={() => open('create')}
          >
            {t('mining.create_pool')}
          </Button>
        }
        columns={columns}
        data={data || []}
        isLoading={isLoading}
      ></MiningTable>

      {/* CreateModal is special */}
      {modalVisible.create && (
        <CreateModal
          onClose={() => {
            close('create')
            refetch()
          }}
        ></CreateModal>
      )}

      {selectedStakePool &&
        modalEntries.map(
          ([modalKey, Modal]) =>
            modalVisible[modalKey] && (
              <Modal
                key={modalKey}
                stakePool={selectedStakePool}
                onClose={() => {
                  close(modalKey)
                  refetch()
                  // NOTE: if current modal is the last modal, reset selected pid
                  if (visibleCount <= 1) {
                    setSelectedPid(null)
                  }
                }}
              />
            )
        )}
    </>
  )
}

export default StakePoolTable
