<template>
  <div class="flex flex-wrap overflow-hidden p-6 mb-6 bg-white rounded-lg">
    <h3 class="mb-4 font-bold">
      {{ $t('details.company_information') }}
    </h3>
    <DataField
      v-for="(detail, index) in details"
      :key="index"
      :label="$t('details.' + detail.label)"
      :data="detail.data"
      class="mb-2"
    />

    <h3 class="mt-4 mb-2 font-bold">
      {{ $t('details.description') }}
    </h3>
    <p class="text-sm text-gray-500">
      {{ info.description }}
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {AssetSymbol} from '../../../common/models'
import DataField from './DataField.vue'

export default defineComponent({
  components : {DataField},
  props      : {
    assetSymbol: {
      type     : Object as AssetSymbol,
      required : true
    },
  },
  setup (props) {

    // @todo: Load Company Information from Server
    const info =  {
      'symbol'            : 'AAPL',
      'price'             : 113.02,
      'beta'              : 1.34434,
      'volAvg'            : 172070917,
      'mktCap'            : 1932924420000,
      'lastDiv'           : 0.7825,
      'range'             : '53.1525-137.98',
      'changes'           : -3.77,
      'companyName'       : 'Apple Inc',
      'currency'          : 'USD',
      'isin'              : 'US0378331005',
      'cusip'             : '037833100',
      'exchange'          : 'Nasdaq Global Select',
      'exchangeShortName' : 'NASDAQ',
      'industry'          : 'Consumer Electronics',
      'website'           : 'https://www.apple.com/',
      'description'       : 'Apple, Inc. engages in the design, manufacture, and sale of smartphones, personal computers, tablets, wearables and accessories, and other variety of related services. The company is headquartered in Cupertino, California and currently employs 137,000 full-time employees. The company is considered one of the Big Four technology companies, alongside Amazon, Google, and Microsoft. The firm\'s hardware products include the iPhone smartphone, the iPad tablet computer, the Mac personal computer, the iPod portable media player, the Apple Watch smartwatch, the Apple TV digital media player, the AirPods wireless earbuds and the HomePod smart speaker. Apple\'s software includes the macOS, iOS, iPadOS, watchOS, and tvOS operating systems, the iTunes media player, the Safari web browser, the Shazam acoustic fingerprint utility, and the iLife and iWork creativity and productivity suites, as well as professional applications like Final Cut Pro, Logic Pro, and Xcode. Its online services include the iTunes Store, the iOS App Store, Mac App Store, Apple Music, Apple TV+, iMessage, and iCloud. Other services include Apple Store, Genius Bar, AppleCare, Apple Pay, Apple Pay Cash, and Apple Card.',
      'ceo'               : 'Mr. Timothy Cook',
      'sector'            : 'Technology',
      'country'           : 'US',
      'fullTimeEmployees' : '137000',
      'phone'             : '14089961010',
      'address'           : '1 Apple Park Way',
      'city'              : 'Cupertino',
      'state'             : 'CALIFORNIA',
      'zip'               : '95014',
      'dcfDiff'           : 89.92,
      'dcf'               : 123.527,
      'image'             : 'https://financialmodelingprep.com/image-stock/AAPL.jpg',
      'ipoDate'           : '1980-12-12'
    }

    const details = ref([
      {
        label : 'company_name',
        data  : info.companyName
      },
      {
        label : 'symbol',
        data  : info.symbol
      },
      {
        label : 'isin',
        data  : info.isin
      },
      {
        label : 'exchange',
        data  : info.exchange
      },
      {
        label : 'sector',
        data  : info.sector
      },
      {
        label : 'industry',
        data  : info.industry
      },
      {
        label : 'country',
        data  : info.country
      },
      {
        label : 'address',
        data  : `${info.address}, ${info.zip} ${info.city}`
      },
      {
        label : 'full_time_employees',
        data  : Number(info.fullTimeEmployees).toLocaleString()
      },
      {
        label : 'ceo',
        data  : info.ceo
      },
      {
        label : 'website',
        data  : `<a href="${info.website}">${info.website}</a>`
      },
      {
        label : 'ipo_date',
        data  : info.ipoDate
      },
    ])

    return {
      info,
      details
    }
  }
})
</script>
