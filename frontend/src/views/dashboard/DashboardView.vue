<template>
  <v-main>
    <v-card class="mb-5">
      <v-table
        fixed-header
        hover
        density="comfortable"
        width="500px"
      >
        <thead>
          <tr>
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              Calories
            </th>
            <th class="text-left">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in desserts"
            :key="item.name"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.calories }}</td>
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
  </v-main>
</template>

<script>
    export default {
        data () {
            return {
                currentItem: '',
                desserts: [
                {
                    name: 'Frozen Yogurt',
                    calories: 159,
                },
                {
                    name: 'Ice cream sandwich',
                    calories: 237,
                },
                {
                    name: 'Eclair',
                    calories: 262,
                },
                {
                    name: 'Cupcake',
                    calories: 305,
                },
                {
                    name: 'Gingerbread',
                    calories: 356,
                },
                {
                    name: 'Jelly bean',
                    calories: 375,
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                },
                {
                    name: 'Honeycomb',
                    calories: 408,
                },
                {
                    name: 'Donut',
                    calories: 452,
                },
                {
                    name: 'KitKat',
                    calories: 518,
                },
                ],
                snackbar: false,
                text: 'You removed the ',
                timeout: 2000,
            }
        },
        methods: {
            deleteRow(item) {
                this.snackbar = true
                this.currentItem = item.name
                this.desserts = this.desserts.filter((p) => p.name !== item.name)
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
