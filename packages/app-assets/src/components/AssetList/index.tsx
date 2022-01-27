import React from 'react'
import styled from 'styled-components'
import {down, up} from 'styled-breakpoints'
import {useBreakpoint} from 'styled-breakpoints/react-styled'
import {TableBuilder, TableBuilderColumn} from 'baseui/table-semantic'
import AssetCell from './AssetCell'
import BalanceCell from './BalanceCell'
import ButtonCell from './ButtonCell'
import ValueCell from './ValueCell'

const Wrapper = styled.div`
  padding: 30px 85px;

  ${up('md')} {
    margin: 0 auto;
    max-width: 1270px;
  }
  ${down('sm')} {
    padding: 22px 10px;
  }
`

const Title = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  color: #111111;
  margin-bottom: 20px;

  ${down('sm')} {
    font-size: 20px;
    line-height: 20px;
  }
`

export type DataType = {
  name: string
  icon: string
  balance: string
  value: string
  transferrable?: string
  crowdloanVesting?: string
  delegate?: string
  isKPHA?: boolean
}

type Props = {
  tableData: DataType[]
}

const AssetList: React.FC<Props> = ({tableData}) => {
  const isMobile = useBreakpoint(down('sm'))

  return (
    <Wrapper>
      <Title>ASSETS</Title>
      <TableBuilder
        data={tableData}
        emptyMessage="Please Connect Wallet"
        overrides={{
          Root: {
            style: () => ({
              boxShadow: '0px 16px 48px rgba(0, 0, 0, 0.1)',
            }),
          },
          TableEmptyMessage: {
            style: () => ({
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '256px',
              textAlign: 'center',
              color: '#CECECE',
              height: '256px',
            }),
          },
          TableHeadCell: {
            style: ({$theme}) => ({
              border: 'none',
              backgroundColor: '#D1FF52',
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '16px',
              color: '#111111',
              paddingTop: '18px',
              paddingBottom: '18px',
              paddingLeft: '40px',
              paddingRight: 0,
              [$theme.mediaQuery.small]: {
                fontSize: '16px',
                lineHeight: '16px',
                paddingTop: '20px',
                paddingBottom: '20px',
                paddingLeft: '30px',
                ':first-of-type': {
                  paddingLeft: '10px',
                },
              },
            }),
          },
          TableBodyCell: {
            style: ({$theme}) => ({
              paddingTop: '20px',
              paddingBottom: '20px',
              paddingLeft: '40px',
              paddingRight: 0,
              ':last-of-type': {
                paddingTop: '10px',
              },
              [$theme.mediaQuery.small]: {
                paddingLeft: '30px',
                ':first-of-type': {
                  paddingLeft: '10px',
                },
                ':last-of-type': {
                  paddingLeft: 0,
                },
              },
            }),
          },
        }}
      >
        <TableBuilderColumn header="Asset">
          {(row) => (
            <AssetCell name={row.name} icon={row.icon} isKPHA={row.isKPHA} />
          )}
        </TableBuilderColumn>
        <TableBuilderColumn header="Balance">
          {(row) => (
            <BalanceCell
              balance={row.balance}
              transferrable={row.transferrable}
              crowdloanVesting={row.crowdloanVesting}
              delegate={row.delegate}
              isKPHA={row.isKPHA}
            />
          )}
        </TableBuilderColumn>
        {isMobile ? null : (
          <TableBuilderColumn header="Value">
            {(row) => <ValueCell value={row.value} isKPHA={row.isKPHA} />}
          </TableBuilderColumn>
        )}

        <TableBuilderColumn>
          {(row) => <ButtonCell isKPHA={row.isKPHA} />}
        </TableBuilderColumn>
      </TableBuilder>
    </Wrapper>
  )
}

export default AssetList
