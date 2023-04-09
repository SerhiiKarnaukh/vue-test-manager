<template>
    <v-container>
        <v-main>
            <v-row justify="center" class="space px-md-16 pb-15">
                <v-col cols="12" xl="8" lg="12" md="12">
                    <v-card>
                        <div class="d-flex flex-no-wrap justify-space-between">
                            <v-row>
                                <v-col cols="12" md="6" align="center">
                                    <v-carousel hide-delimiters>
                                        <v-carousel-item :src="product.get_image" cover></v-carousel-item>
                                        <v-carousel-item v-for="(item, i) in product.productgallery" :key="i"
                                            :src="item.get_image" cover></v-carousel-item>
                                    </v-carousel>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div>
                                        <v-card-title class="text-h5">
                                            {{ product.name }}
                                        </v-card-title>
                                        <v-card-text class="font-weight-black font-italic">${{ product.price
                                        }}</v-card-text>

                                        <v-card-text>{{ product.description }}</v-card-text>
                                        <v-card-actions>
                                            <v-col cols="3">
                                                <v-text-field v-model.number="quantity" type="number"
                                                    min="1"></v-text-field>
                                            </v-col>
                                        </v-card-actions>
                                    </div>
                                    <v-card-actions>
                                        <v-btn variant="flat" color="primary" prepend-icon="mdi-basket"
                                            @click="addToCart()">Add to Cart</v-btn>
                                    </v-card-actions>
                                    <v-snackbar v-model="snackbar" color="success">
                                        The product was added to the cart
                                        <template v-slot:actions>
                                            <v-btn color="black" variant="text" @click="snackbar = false">
                                                Close
                                            </v-btn>
                                        </template>
                                    </v-snackbar>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-main>

    </v-container>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ProductDetailView',
    data () {
        return {
            product: {},
            quantity: 1,
            snackbar: false,
        }
    },
    mounted () {
        this.getProduct()
    },
    methods: {
        async getProduct () {
            const category_slug = this.$route.params.category_slug
            const product_slug = this.$route.params.product_slug
            await axios
                .get(`/api/v1/products/${category_slug}/${product_slug}`)
                .then(response => {
                    this.product = response.data
                    document.title = this.product.name + ' | Taberna'
                })
                .catch(error => {
                    console.log(error)
                })
        },
        addToCart () {
            if (isNaN(this.quantity) || this.quantity < 1) {
                this.quantity = 1
            }
            const item = {
                product: this.product,
                quantity: this.quantity
            }
            this.$store.commit('addToCart', item)
            this.snackbar = true
        }
    }
}
</script>

<style scoped>
</style>
