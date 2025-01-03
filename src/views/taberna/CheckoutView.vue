<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Shipping Details</v-card-title>
            <v-alert v-if="state.errors.length" type="error"
              ><p v-for="error in state.errors" v-bind:key="error">
                {{ error }}
              </p></v-alert
            >
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model.trim="state.first_name"
                  label="First name*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="state.last_name"
                  label="Last name*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="state.email"
                  type="email"
                  label="E-mail*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="state.phone"
                  label="Phone*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="state.address"
                  label="Address*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="state.zipcode"
                  label="Zip code*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="state.place"
                  label="Place*"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Order Summary</v-card-title>
            <v-table fixed-header hover density="comfortable">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in cart.cart_items"
                  v-bind:key="item.product.id"
                >
                  <td>
                    {{ item.product.name }}
                    <div
                      v-if="item.variations.length"
                      class="text-grey text-body-2"
                    >
                      <p
                        v-for="variation in item.variations"
                        :key="variation.id"
                      >
                        {{ variation.variation_category }}:
                        {{ variation.variation_value }}
                      </p>
                    </div>
                  </td>
                  <td>${{ item.product.price }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ item.sub_total }}</td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td colspan="2">Total</td>
                  <td>{{ cart.quantity }}</td>
                  <td>${{ cart.grand_total }}</td>
                </tr>
              </tfoot>
            </v-table>
            <div id="card-element" class="mb-5"></div>
            <v-card-actions
              v-if="cart.cart_items && cart.cart_items.length != 0"
            >
              <v-btn variant="flat" color="success" @click="submitForm"
                >Pay with Stripe</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'CheckoutView',
  setup() {
    const store = useStore()
    const router = useRouter()

    const state = reactive({
      cart: [],
      stripe: null,
      card: null,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      zipcode: '',
      place: '',
      errors: [],
    })

    const cart = computed(() => store.getters['tabernaCartData/cart'])

    const submitForm = () => {
      state.errors = []
      if (!state.first_name)
        state.errors.push('The first name field is missing!')
      if (!state.last_name) state.errors.push('The last name field is missing!')
      if (!state.email) state.errors.push('The email field is missing!')
      if (!state.phone) state.errors.push('The phone field is missing!')
      if (!state.address) state.errors.push('The address field is missing!')
      if (!state.zipcode) state.errors.push('The zip code field is missing!')
      if (!state.place) state.errors.push('The place field is missing!')

      if (!state.errors.length) {
        state.stripe.createToken(state.card).then((result) => {
          if (result.error) {
            state.errors.push(
              'Something went wrong with Stripe. Please try again'
            )
            console.error(result.error.message)
          } else {
            stripeTokenHandler(result.token)
          }
        })
      }
    }

    const stripeTokenHandler = async (token) => {
      const items = state.cart.items.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price * item.quantity,
      }))

      const data = {
        first_name: state.first_name,
        last_name: state.last_name,
        email: state.email,
        address: state.address,
        zipcode: state.zipcode,
        place: state.place,
        phone: state.phone,
        items: items,
        stripe_token: token.id,
      }

      try {
        await axios.post('/api/v1/checkout/', data)
        store.commit('clearCart')
        router.push('/taberna/cart/success')
      } catch (error) {
        state.errors.push('Something went wrong. Please try again')
        console.error(error)
      }
    }

    onMounted(async () => {
      await store.dispatch('setPageTitle', 'Checkout')
      await store.dispatch('tabernaCartData/getCart')
      //   if (cartTotalLength.value > 0) {
      //     state.stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx')
      //     const elements = state.stripe.elements()
      //     state.card = elements.create('card', { hidePostalCode: true })
      //     state.card.mount('#card-element')
      //   }
    })

    return {
      state,
      cart,
      submitForm,
    }
  },
}
</script>
