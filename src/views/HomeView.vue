<template>
    <v-parallax src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4">
                Taberna
            </h1>
            <h4 class="subheading">
                The best Store in the whole world!
            </h4>
        </div>
    </v-parallax>
    <v-container>
        <v-main class="pt-4 pt-md-16">
            <v-row class="py-5" justify="center">
                <h2>Latest products</h2>

                <v-col cols="12">
                    <v-row>
                        <v-col v-for="product in latestProducts" :key="product.id" cols="12" lg="4" sm="6">
                            <v-card class="mx-auto pb-2">
                                <v-img :src="product.get_image" height="200px" cover>
                                    <template v-slot:placeholder>
                                        <v-row align="center" class="fill-height ma-0" justify="center">
                                            <v-progress-circular color="grey lighten-5" indeterminate></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>

                                <v-card-title class="text-capitalize">
                                    {{ product.name }}
                                </v-card-title>
                                <v-card-title class="grey--text text-grey-darken-1 caption mt-n4">
                                    {{ product.description }}
                                </v-card-title>

                                <v-card-subtitle> ${{ product.price }} </v-card-subtitle>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn :to="product.get_absolute_url" variant="flat" color="primary">Details</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-main>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    name: 'HomeView',
    data () {
        return {
            latestProducts: [],
        }
    },
    mounted () {
        this.getLatestProducts()
    },
    methods: {
        getLatestProducts () {
            axios
                .get('/api/v1/latest-products/')
                .then(response => {
                    this.latestProducts = response.data
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
};
</script>
<style scoped>
</style>
