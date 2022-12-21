import { mount } from '@vue/test-utils'
import Home from '@/pages/Home.vue'
import { createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

const selectedLocationTestData = 'here'
const aquiferTestData = [
  { aquifer_id: 1, mapping_year: 2012, name: 'langly', area: 7.8, location: 'here', vulnerability: 'High' },
  { aquifer_id: 2, mapping_year: 2013, name: 'columbia', area: 71.8, location: 'There', vulnerability: 'Low' },
  { aquifer_id: 3, mapping_year: 2014, name: 'delta', area: 0.8, location: 'anywhere', vulnerability: 'High' },
  { aquifer_id: 4, mapping_year: 2015, name: 'west minsiter', area: 2.5, location: 'Nowhere', vulnerability: 'Low' },
  { aquifer_id: 5, mapping_year: 2012, name: 'vancourer', area: 3.8, location: null, vulnerability: 'High' },
  { aquifer_id: 6, mapping_year: 2013, name: 'surrey', area: 7.6, location: '', vulnerability: 'Low' },
  { aquifer_id: 7, mapping_year: 2021, name: 'mission', area: 7.1, location: 'here', vulnerability: 'High' },
  { aquifer_id: 8, mapping_year: 2022, name: null, area: 5.6, location: '123 test ave', vulnerability: 'High' }
]

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Home', () => {
  const wrapper = mount(Home, {
    localVue,
    data() {
      return {
        selectedLocation: selectedLocationTestData,
        aquifers: aquiferTestData
      }
    },
    computed: {
      aquiferLocations() {
        let locations = this.aquifers
          .filter(item => item.location)
          .map(function (item) {
            let x = item.location.trim()
            return { value: x, text: x }
          })
          .sort(function (a, b) {
            let av = a.value.toLowerCase(), bv = b.value.toLowerCase();
            if (av < bv) {
              return -1
            }
            if (av > bv) {
              return 1
            }
            return 0
          })
          .filter(function (el, idx, arr) {
            return !idx || el.value != arr[idx - 1].value
          })
        locations.unshift({ value: selectedLocationTestData, text: selectedLocationTestData, disabled: true })
        return locations
      },
      filteredAquiferLocationDetailObjs() {
        let tmpResults = aquiferTestData
        tmpResults = tmpResults.filter((obj) => {
          return (obj.location == this.selectedLocation)
        })
        return tmpResults;
      }
    }
  })

  it('Check alpha order', () => {
    expect(wrapper.findAll('option').at(1).text()).toBe('123 test ave')
    expect(wrapper.findAll('option').at(5).text()).toBe('There')
  })

  it('Check list null, empty and duplicate values removed', () => {
    expect(wrapper.findAll('option').length).toBe(6)
  })

  it('Check selectedLocation data', () => {
    expect(wrapper.find('#selectLocation option').exists()).toBeTruthy()

    // testing table header data
    expect(wrapper.find('#th-1').text()).toMatch('Aquifer ID')
    expect(wrapper.find('#th-2').text()).toMatch('Mapping Year')
    expect(wrapper.find('#th-3').text()).toMatch('Name')
    expect(wrapper.find('#th-4').text()).toMatch('Area')
    expect(wrapper.find('#th-5').text()).toMatch('Vulnerability')

    // testing table row data for selected location => 'here'

    // record 1  -> { aquifer_id: 1, mapping_year: 2012, name: 'langly', area: 7.8, location: 'here', vulnerability: 'High' }
    expect(wrapper.find('#td-1-1').text()).toMatch('1')
    expect(wrapper.find('#td-2-1').text()).toMatch('2012')
    expect(wrapper.find('#td-3-1').text()).toMatch('langly')
    expect(wrapper.find('#td-4-1').text()).toMatch('7.8')
    expect(wrapper.find('#td-5-1').text()).toMatch('High')

    // record 2 -> { aquifer_id: 7, mapping_year: 2021, name: 'mission', area: 7.1, location: 'here', vulnerability: 'High' }
    expect(wrapper.find('#td-1-7').text()).toMatch('7')
    expect(wrapper.find('#td-2-7').text()).toMatch('2021')
    expect(wrapper.find('#td-3-7').text()).toMatch('mission')
    expect(wrapper.find('#td-4-7').text()).toMatch('7.1')
    expect(wrapper.find('#td-5-7').text()).toMatch('High')

  })

})
