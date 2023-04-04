<template>
    <v-main>
        <v-container>
            <v-card>
                <v-card-title>
                    <h2>Shopping Cart</h2>
                </v-card-title>
                <v-card-text>
                    <v-data-table :headers="headers" :items="items" :search="search" :loading="loading"
                        :items-per-page="itemsPerPage" :footer-props="{
                            'items-per-page-options': [5, 10, 25, 50, 100]
                        }">
                        <!-- <template v-slot:item.actions="{ item }">
                            <v-btn color="red" @click="removeItem(item)">
                                Remove
                            </v-btn>
                        </template> -->
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" :disabled="!items.length">
                        Checkout
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-main>
</template>

<script>
export default {
    data () {
        return {
            headers: [
                { text: 'Product', value: 'product' },
                { text: 'Price', value: 'price' },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Total', value: 'total' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            items: [
                { product: 'Shirt', price: '$20', quantity: 2, total: '$40' },
                { product: 'Pants', price: '$30', quantity: 1, total: '$30' },
                { product: 'Socks', price: '$5', quantity: 3, total: '$15' },
            ],
            search: '',
            loading: false,
            itemsPerPage: 10,
        };
    },
    methods: {
        removeItem (item) {
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
        },
    },
};
</script>
