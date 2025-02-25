import {Meta, Story} from '@storybook/react'
import React from 'react'
import {InputExternalInfo} from '../src/InputExternalInfo'

export default {
  title: 'InputExternalInfo',
  component: InputExternalInfo,
  parameters: {
    backgrounds: {
      default: 'white',
      values: [
        {name: 'black', value: '#202020'},
        {name: 'white', value: '#FFFFFF'},
        {name: 'gray', value: '#ECECEC'},
      ],
    },
  },
} as Meta

const Template: Story<React.ComponentProps<typeof InputExternalInfo>> = (
  args
) => <InputExternalInfo {...args} />

export const primary = Template.bind({})

primary.args = {
  label: 'Fee',
  value: 1234.56789,
  type: 'ETH',
}
