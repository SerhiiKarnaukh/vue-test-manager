<template>
    <tr>
        <td><router-link :to="item.product.get_absolute_url">{{ item.product.name }}</router-link></td>
        <td>${{ item.product.price }}</td>
        <td>
            <v-container class="d-flex d-sm-block flex-column align-center">
                <v-btn icon size="x-small" @click="decrementQuantity(item)">
                    <v-icon>mdi-minus</v-icon>
                </v-btn>
                <v-btn flat>{{ item.quantity }}</v-btn>
                <v-btn icon size="x-small" @click="incrementQuantity(item)">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-container>

        </td>
        <td>${{ getItemTotal(item).toFixed(2) }}</td>
        <td> <v-btn variant="text" icon="mdi-trash-can-outline" @click="removeFromCart(item)"></v-btn></td>
    </tr>
</template>

<script>

export default {
    name: 'TheCartItem',
    props: {
        initialItem: Object
    },
    data () {
        return {
            item: this.initialItem
        }
    },
    methods: {
        getItemTotal (item) {
            return item.quantity * item.product.price
        },
        decrementQuantity (item) {
            item.quantity -= 1
            if (item.quantity === 0) {
                this.$emit('removeFromCart', item)
            }
            this.updateCart()
        },
        incrementQuantity (item) {
            item.quantity += 1
            this.updateCart()
        },
        updateCart () {
            localStorage.setItem('cart', JSON.stringify(this.$store.state.cart))
        },
        removeFromCart (item) {
            this.$emit('removeFromCart', item)
            this.updateCart()
        },
    },
}
</script>
