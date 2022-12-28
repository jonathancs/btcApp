import { config } from 'dotenv'
import axios from 'axios'
import Period from './enums/Period'
import Candle from './models/Candle'

config()

const readMarketPrice = async (): Promise<number> => {
    const result = await axios.get(process.env.PRICES_API)
    const data = result.data
    const price = data.bitcoin.usd
    return price
}

readMarketPrice()

const generateCandles = async () => {
    while(true) {
        const loopTimes = Period.ONE_MINUTE / Period.TEN_SECONDS

        const candle = new Candle('BTC', new Date())

        console.log('-------------------------------')
        console.log('generating new candle')


        for (let i = 0; i < loopTimes; i++) {
            const price = await readMarketPrice()
            candle.addValue(price)
            console.log(`Market price #${i + 1} of ${loopTimes}`)
        }

        candle.closeCandle()
        console.log('candle closed')
        console.log(candle.toSimpleObject())
    }
}

generateCandles()