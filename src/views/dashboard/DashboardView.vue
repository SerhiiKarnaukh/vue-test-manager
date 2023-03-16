<template>
  <v-main>
    <v-container>
      <v-card class="mb-5">
        <v-table
          fixed-header
          hover
          density="comfortable"
          width="500px"
        >
          <thead>
            <tr>
              <th
                v-for="item in tableHeader"
                :key="item"
                class="text-left"
              >
                {{ item }}
              </th>
              <th class="text-left">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in tableData"
              :key="item.name"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.calories }}</td>
              <td>{{ item.price }}</td>
              <td>
                <v-btn
                  variant="text"
                  icon="mdi-trash-can-outline"
                  @click="deleteRow(item)"
                ></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
          color="green"
        >
          {{ text + currentItem }}

          <template v-slot:actions>
            <v-btn
              color="black"
              variant="text"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
    export default {
        data () {
            return {
                currentItem: '',
                tableData: [
                {
                    name: 'Frozen Yogurt',
                    calories: 159,
                    price: '256$',
                },
                {
                    name: 'Ice cream sandwich',
                    calories: 237,
                    price: '345$',
                },
                {
                    name: 'Eclair',
                    calories: 262,
                    price: '279$',
                },
                {
                    name: 'Cupcake',
                    calories: 305,
                    price: '248$',
                },
                {
                    name: 'Gingerbread',
                    calories: 356,
                    price: '100$',
                },
                {
                    name: 'Jelly bean',
                    calories: 375,
                    price: '256$',
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                    price: '534$',
                },
                {
                    name: 'Honeycomb',
                    calories: 408,
                    price: '98$'
                },
                {
                    name: 'Donut',
                    calories: 452,
                    price: '295$',
                },
                {
                    name: 'KitKat',
                    calories: 518,
                    price: '129$',
                },
                ],
                snackbar: false,
                text: 'You removed the ',
                timeout: 2000,
                tableHeader: []
            }
        },
        methods: {
            deleteRow(item) {
                this.snackbar = true
                this.currentItem = item.name
                this.tableData = this.tableData.filter((p) => p.name !== item.name)
            },
            createTableHeader() {
                let keys = this.tableData.reduce((container, obj) => [...container, ...Object.keys(obj)], [])
                this.tableHeader = [...new Set(keys)]
                this.tableHeader = this.tableHeader.map(n => n[0].toUpperCase() + n.slice(1).toLowerCase())
            }
        },
        mounted () {
            this.createTableHeader()
        }
    }
</script>

<style lang="scss" scoped>
</style>
