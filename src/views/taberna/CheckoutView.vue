<template>
  <v-main>
    <v-container>
      <v-card-title v-if="state.loading">
        <v-row align="center" class="fill-height ma-0" justify="center">
          <v-progress-circular
            color="grey lighten-5"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </v-card-title>
      <v-row v-else>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Billing Details</v-card-title>
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
                  :error-messages="v$.first_name.$errors.map((e) => e.$message)"
                ></v-text-field>
                <br />
                <v-text-field
                  v-model.trim="state.last_name"
                  label="Last name*"
                  required
                  :error-messages="v$.last_name.$errors.map((e) => e.$message)"
                ></v-text-field>
                <br />
                <v-text-field
                  v-model.trim="state.email"
                  type="email"
                  label="E-mail*"
                  required
                  :error-messages="v$.email.$errors.map((e) => e.$message)"
                ></v-text-field>
                <br />
                <v-text-field
                  v-model.trim="state.phone"
                  label="Phone*"
                  required
                  :error-messages="v$.phone.$errors.map((e) => e.$message)"
                ></v-text-field>
                <br />
                <v-text-field
                  v-model.trim="state.address1"
                  label="Address Line 1*"
                  required
                  :error-messages="v$.address1.$errors.map((e) => e.$message)"
                ></v-text-field>
                <br />
                <v-text-field
                  v-model.trim="state.address2"
                  label="Address Line 2"
                  :error-messages="v$.address2.$errors.map((e) => e.$message)"
                ></v-text-field>
                <br />
                <v-text-field
                  v-model.trim="state.city"
                  label="City*"
                  required
                  :error-messages="v$.city.$errors.map((e) => e.$message)"
                ></v-text-field>
                <br />
                <v-text-field
                  v-model.trim="state.state"
                  label="State*"
                  required
                  :error-messages="v$.state.$errors.map((e) => e.$message)"
                ></v-text-field>
                <br />
                <v-text-field
                  v-model.trim="state.country"
                  label="Country*"
                  required
                  :error-messages="v$.country.$errors.map((e) => e.$message)"
                ></v-text-field>
                <br />
                <v-textarea
                  v-model.trim="state.order_notes"
                  label="Order Notes"
                  outlined
                  rows="4"
                  placeholder="Enter any additional details or instructions here."
                ></v-textarea>
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
            <div id="card-element" class="pa-5"></div>
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
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength } from '@vuelidate/validators'
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
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      order_notes: '',
      errors: [],
      loading: false,
      stripe: {},
    })

    const rules = {
      first_name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50),
      },
      last_name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50),
      },
      email: { required, email, maxLength: maxLength(100) },
      phone: { required, minLength: minLength(6), maxLength: maxLength(10) },
      address1: { required, minLength: minLength(3), maxLength: maxLength(50) },
      address2: { minLength: minLength(3), maxLength: maxLength(50) },
      city: { required, minLength: minLength(3), maxLength: maxLength(50) },
      state: { required, minLength: minLength(3), maxLength: maxLength(50) },
      country: { required, minLength: minLength(3), maxLength: maxLength(50) },
    }
    const v$ = useVuelidate(rules, state)

    const cart = computed(() => store.getters['tabernaCartData/cart'])

    const submitForm = async () => {
      const isFormCorrect = await v$._value.$validate()

      if (isFormCorrect) {
        state.stripe.createToken(state.card).then((result) => {
          if (result.error) {
            store.dispatch('alert/setMessage', {
              value: [result.error.message],
              type: 'error',
            })
          } else {
            stripeTokenHandler(result.token)
          }
        })
      }
    }

    const stripeTokenHandler = async (token) => {
      const data = {
        first_name: state.first_name,
        last_name: state.last_name,
        email: state.email,
        phone: state.phone,
        address_line_1: state.address1,
        address_line_2: state.address2,
        city: state.city,
        state: state.state,
        country: state.country,
        order_note: state.order_notes,
        stripe_token: token.id,
      }

      try {
        state.loading = true
        await axios.post('/taberna-orders/api/v1/place_order/', data)
        await store.dispatch('tabernaCartData/getCart')
        router.push('/taberna/cart/success')
      } catch (error) {
        store.dispatch('alert/setMessage', {
          value: ['Something went wrong. Please try again'],
          type: 'error',
        })
        console.error(error)
      } finally {
        state.loading = false
      }
    }

    onMounted(async () => {
      await store.dispatch('setPageTitle', 'Checkout')

      state.stripe = Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
      const elements = state.stripe.elements()
      state.card = elements.create('card', { hidePostalCode: true })
      state.card.mount('#card-element')
    })

    return {
      state,
      v$,
      cart,
      submitForm,
    }
  },
}
</script>
