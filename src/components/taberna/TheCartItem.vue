<template>
  <tr>
    <td>
      <v-img :src="state.item.product.image">
        <template v-slot:placeholder>
          <v-row align="center" class="fill-height ma-0" justify="center">
            <v-progress-circular
              color="grey lighten-5"
              indeterminate
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </td>
    <td>
      <router-link :to="state.item.product.get_absolute_url">{{
        state.item.product.name
      }}</router-link>
      <div v-if="state.item.variations.length" class="text-grey text-body-2">
        <p v-for="variation in state.item.variations" :key="variation.id">
          {{ variation.variation_category }}:
          {{ variation.variation_value }}
        </p>
      </div>
    </td>
    <td>${{ state.item.product.price }}</td>
    <td>
      <v-container class="d-flex d-sm-block flex-column align-center">
        <v-btn icon size="x-small" @click="decrementQuantity(state.item)">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn flat>{{ state.item.quantity }}</v-btn>
        <v-btn icon size="x-small" @click="incrementQuantity(state.item)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-container>
    </td>
    <td>${{ getItemTotal(state.item).toFixed(2) }}</td>
    <td>
      <v-btn
        variant="text"
        icon="mdi-trash-can-outline"
        @click="removeFromCart(state.item)"
      ></v-btn>
    </td>
  </tr>
</template>
<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'TheCartItem',
  props: {
    initialItem: Object,
  },
  setup(props) {
    const store = useStore()
    const state = reactive({
      item: props.initialItem,
    })

    const getItemTotal = (item) => {
      return item.quantity * item.product.price
    }

    const decrementQuantity = (item) => {
      item.quantity -= 1
      if (item.quantity === 0) {
        emit('removeFromCart', item)
      }
      updateCart()
    }

    const incrementQuantity = (item) => {
      item.quantity += 1
      updateCart()
    }

    const updateCart = () => {
      localStorage.setItem('cart', JSON.stringify(store.state.cart))
    }

    const removeFromCart = (item) => {
      updateCart()
    }

    return {
      state,
      getItemTotal,
      decrementQuantity,
      incrementQuantity,
      removeFromCart,
    }
  },
}
</script>
