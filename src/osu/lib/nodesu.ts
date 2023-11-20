import { Client as Nodesu } from 'nodesu'

import config from '../../config'

const nodesu = new Nodesu(config.osu.apiKey, {
  parseData: true,
})

export default nodesu
