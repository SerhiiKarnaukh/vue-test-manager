<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Shipping Details</v-card-title>
            <v-alert v-if="errors.length" type="error"
              ><p v-for="error in errors" v-bind:key="error">
                {{ error }}
              </p></v-alert
            >
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model.trim="first_name"
                  label="First name*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="last_name"
                  label="Last name*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="email"
                  type="email"
                  label="E-mail*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="phone"
                  label="Phone*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="address"
                  label="Address*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="zipcode"
                  label="Zip code*"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="place"
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
                <tr v-for="item in cart.items" v-bind:key="item.product.id">
                  <td>{{ item.product.name }}</td>
                  <td>${{ item.product.price }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ getItemTotal(item).toFixed(2) }}</td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td colspan="2">Total</td>
                  <td>{{ cartTotalLength }}</td>
                  <td>${{ cartTotalPrice.toFixed(2) }}</td>
                </tr>
              </tfoot>
            </v-table>
            <div id="card-element" class="mb-5"></div>
            <v-card-actions v-if="cartTotalLength">
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
import axios from 'axios'
export default {
  name: 'CheckoutView',
  data() {
    return {
      cart: {
        items: [],
      },
      stripe: {},
      card: {},
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      zipcode: '',
      place: '',
      errors: [],
    }
  },
  mounted() {
    document.title = 'Checkout | Taberna'
    this.cart = this.$store.state.cart
    if (this.cartTotalLength > 0) {
      this.stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx')
      const elements = this.stripe.elements()
      this.card = elements.create('card', { hidePostalCode: true })
      this.card.mount('#card-element')
    }
  },
  methods: {
    getItemTotal(item) {
      return item.quantity * item.product.price
    },
    submitForm() {
      this.errors = []
      if (this.first_name === '') {
        this.errors.push('The first name field is missing!')
      }
      if (this.last_name === '') {
        this.errors.push('The last name field is missing!')
      }
      if (this.email === '') {
        this.errors.push('The email field is missing!')
      }
      if (this.phone === '') {
        this.errors.push('The phone field is missing!')
      }
      if (this.address === '') {
        this.errors.push('The address field is missing!')
      }
      if (this.zipcode === '') {
        this.errors.push('The zip code field is missing!')
      }
      if (this.place === '') {
        this.errors.push('The place field is missing!')
      }
      if (!this.errors.length) {
        this.stripe.createToken(this.card).then((result) => {
          if (result.error) {
            this.errors.push(
              'Something went wrong with Stripe. Please try again'
            )
            console.log(result.error.message)
          } else {
            this.stripeTokenHandler(result.token)
          }
        })
      }
    },
    async stripeTokenHandler(token) {
      const items = []
      for (let i = 0; i < this.cart.items.length; i++) {
        const item = this.cart.items[i]
        const obj = {
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price * item.quantity,
        }
        items.push(obj)
      }
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        address: this.address,
        zipcode: this.zipcode,
        place: this.place,
        phone: this.phone,
        items: items,
        stripe_token: token.id,
      }
      await axios
        .post('/api/v1/checkout/', data)
        .then(() => {
          this.$store.commit('clearCart')
          this.$router.push('/taberna/cart/success')
        })
        .catch((error) => {
          this.errors.push('Something went wrong. Please try again')
          console.log(error)
        })
    },
  },
  computed: {
    cartTotalPrice() {
      return this.cart.items.reduce((acc, curVal) => {
        return (acc += curVal.product.price * curVal.quantity)
      }, 0)
    },
    cartTotalLength() {
      return this.cart.items.reduce((acc, curVal) => {
        return (acc += curVal.quantity)
      }, 0)
    },
  },
}
</script>
