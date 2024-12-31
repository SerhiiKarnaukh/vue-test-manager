<template>
  <tr>
    <td>
      <v-img :src="initialItem.product.image">
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
      <router-link :to="initialItem.product.get_absolute_url">{{
        initialItem.product.name
      }}</router-link>
      <div v-if="initialItem.variations.length" class="text-grey text-body-2">
        <p v-for="variation in initialItem.variations" :key="variation.id">
          {{ variation.variation_category }}:
          {{ variation.variation_value }}
        </p>
      </div>
    </td>
    <td>${{ initialItem.product.price }}</td>
    <td>
      <v-container class="d-flex d-sm-block flex-column align-center">
        <v-btn icon size="x-small" @click="decrementQuantity(initialItem)">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn flat>{{ initialItem.quantity }}</v-btn>
        <v-btn icon size="x-small" @click="incrementQuantity(initialItem)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-container>
    </td>
    <td>${{ getItemTotal(initialItem).toFixed(2) }}</td>
    <td>
      <v-btn
        variant="text"
        icon="mdi-trash-can-outline"
        @click="removeFromCart(initialItem)"
      ></v-btn>
    </td>
  </tr>
</template>
<script>
import { useStore } from 'vuex'

export default {
  name: 'TheCartItem',
  props: {
    initialItem: Object,
  },
  setup() {
    const store = useStore()

    const getItemTotal = (item) => {
      return item.quantity * item.product.price
    }

    const decrementQuantity = (item) => {
      //   item.quantity -= 1
      //   if (item.quantity === 0) {
      //     emit('removeFromCart', item)
      //   }
      //   updateCart()
    }

    const incrementQuantity = async (item) => {
      const selectedColor = item.variations.find(
        (v) => v.variation_category === 'color'
      )
      const selectedSize = item.variations.find(
        (v) => v.variation_category === 'size'
      )
      await store.dispatch('tabernaCartData/addToCart', {
        productId: item.product.id,
        selectedColor: selectedColor.variation_value,
        selectedSize: selectedSize.variation_value,
      })
      await store.dispatch('tabernaCartData/getCart')
    }

    const updateCart = () => {
      //   localStorage.setItem('cart', JSON.stringify(store.state.cart))
    }

    const removeFromCart = (item) => {
      //   updateCart()
    }

    return {
      getItemTotal,
      decrementQuantity,
      incrementQuantity,
      removeFromCart,
    }
  },
}
</script>
