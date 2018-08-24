/* eslint-disable import/no-extraneous-dependencies */

import { configure, storiesOf } from '@storybook/react'
import Basic from './examples/basic'
import Mui from './examples/mui'

function loadStories() {
  console.clear()

  storiesOf('Examples', module)
    .add('basic', Basic)
    .add('with Material-UI', Mui)
}

configure(loadStories, module)
