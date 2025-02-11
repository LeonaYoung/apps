import {Meta, Story} from '@storybook/react'
import React from 'react'
import {Table} from '../src/Table'
import TableAction from '../src/Table/TableAction'

export default {
  title: 'Table',
  component: Table,
  parameters: {
    backgrounds: {
      default: 'white',
      values: [{name: 'white', value: '#ffffff'}],
    },
  },
} as Meta

const Template: Story<React.ComponentProps<typeof Table>> = () => {
  const data = new Array(10)
    .fill({
      firstName: 'rainstorm',
      lastName: 'debt',
      age: 11,
      visits: 98,
      progress: 98,
      status: 'single',
      subRows: undefined,
    })
    .map((item, index) => ({
      ...item,
      visits: item.visits * index,
      age: (item.age * index) / 2,
    }))

  const columns = React.useMemo(
    () => [
      {
        Header: 'Time',
        accessor: 'firstName',
      },
      {
        Header: 'Peg-out',
        accessor: 'lastName',
      },
      {
        Header: 'Peg-in',
        accessor: 'age',
      },
      {
        Header: 'Amount',
        accessor: 'visits',
      },
      {
        Header: 'Amount-in',
        accessor: 'status',
      },
      {
        Header: 'Status',
        accessor: 'progress',
      },
      {
        Header: () => 'Action',
        id: 'expander',
        Cell: () => <TableAction>Details</TableAction>,
      },
    ],
    []
  )

  return <Table data={data} columns={columns} />
}

export const primary = Template.bind({})

primary.args = {}
