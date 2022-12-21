<template>
  <b-container>
    <b-row>
      <b-col>
        <h2 class="headres" main>Province of British Columbia</h2>
      </b-col>
    </b-row>
    <b-row>
      <div class="flex-parent-element">
        <b-col id="selectLocationContainer" class="flex-child-element">
          <label for="selectLocation" class="headres" sub>Select aquifer location:</label>
          <b-form-select id="selectLocation" v-model="selectedLocation" :options="aquiferLocations"></b-form-select>
        </b-col>
        <b-col id="selectedLocationContainer" class="flex-child-element">
          <label for="selectLocation" class="headres" sub>Aquifer details for selected location:</label>
          <table class="table table-striped table-bordered">
            <thead>
              <tr>
                <th id="th-1">Aquifer ID</th>
                <th id="th-2">Mapping Year</th>
                <th id="th-3">Name</th>
                <th id="th-4">Area</th>
                <th id="th-5">Vulnerability</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="obj in filteredAquiferLocationDetailObjs" :key="obj.aquifer_id">
                <td :id="`td-1-${obj.aquifer_id}`">{{ obj.aquifer_id }}</td>
                <td :id="`td-2-${obj.aquifer_id}`">{{ obj.mapping_year }}</td>
                <td :id="`td-3-${obj.aquifer_id}`">{{ obj.name }}</td>
                <td :id="`td-4-${obj.aquifer_id}`">{{ obj.area }}</td>
                <td :id="`td-5-${obj.aquifer_id}`">{{ obj.vulnerability }}</td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import AQUIFERS from '@/data/aquifers.json'
const SELECTPLACEHOLDER = 'Please select a location'

export default {
  components: {
  },
  data() {
    return {
      selectedLocation: SELECTPLACEHOLDER,
      aquifers: AQUIFERS.results // TODO: import aquifers from an API
    }
  },
  computed: {
    aquiferLocations() {
      let locations = this.aquifers
        // Remove null or whitespace locations (must do before sort)
        .filter(item => item.location)
        // Get only locations
        .map(function (item) {
          let x = item.location.trim()
          return { value: x, text: x }
        })
        // Sort alphabetical  oredr by given location list
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
        // Return unique values (must do after sort, refactor if performance issue)
        .filter(function (el, idx, arr) {
          return !idx || el.value != arr[idx - 1].value
        })
      // Insert item
      locations.unshift({ value: SELECTPLACEHOLDER, text: SELECTPLACEHOLDER, disabled: true })
      return locations
    },

    // Results are filtered here, using the selectedLocation.
    filteredAquiferLocationDetailObjs() {
      let tmpResults = AQUIFERS.results
      tmpResults = tmpResults.filter((obj) => {
        return (obj.location == this.selectedLocation)
      })
      return tmpResults;
    }
  }
};
</script>

<style scoped>
.headres[main] {
  color: rgb(4, 66, 82);
  padding-top: 2.5%;
  padding-bottom: 2.5%;
}

.headres[sub] {
  color: rgb(4, 66, 82);
}

.flex-parent-element {
  display: flex;
  width: 100%;
}

.flex-child-element {
  flex: 4;
  margin-left: 20px;
  margin-right: 0px;
}

.flex-child-element:first-child {
  flex: 1;
  margin-left: 0px;
  margin-right: 20px;
}
</style>