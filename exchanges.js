module.exports = {
    coinbase: {
        name:'coinbase',
        url: 'https://blog.coinbase.com/',
        ClassNames: {
            postsClassName: 'u-fontSize24 u-xs-fontSize18'
        },
        titleFilter: ['launching on Coinbase'],
        numOfPostsToWaitFor: 60
    },
    binance:{
        name:'binance',
        url: 'https://www.binance.com/en/support/announcement/c-48?navId=48',
        ClassNames:{
            postsClassName: 'css-1ej4hfo'
        },
        titleFilter: ['Binance Will List']
    },
    kraken:{
        name:'kraken',
        url:'https://blog.kraken.com/',
        ClassNames:{
            postsClassName:'entry-title'
        },
        titleFilter: ['Trading starts','Trading Starts']
    }
}