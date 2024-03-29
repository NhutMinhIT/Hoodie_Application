import { Box, Container, Flex, HStack, Icon, Input, ScrollView, Stack, Text, VStack } from 'native-base';
import React, { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";
import { View, StyleSheet, ActivityIndicator, FlatList, SafeAreaView, Dimensions } from 'react-native'

import ProductList from './ProductList';
import SearchedProduct from './SearchedProduct';
import Banner from '../../Shared/Banner';
import CategoryFilter from './CategoryFilter';

//API
import baseURL from '../../assets/common/baseUrl';
import axios from 'axios';

const data = require('../../assets/data/products.json')
const productsCategories = require('../../assets/data/categories.json')

var { height } = Dimensions.get('window')

const ProductContainer = (props) => {

    const [products, setProducts] = useState([]);
    const [productsFiltered, setProductsFiltered] = useState([])
    const [focus, setFocus] = useState()
    //Categories
    const [productsCtg, setProductsCtg] = useState([])
    const [categories, setCategories] = useState([])
    const [active, setActive] = useState()
    const [initialState, setInitialState] = useState([])
    //loading
    const [loading, setLoading] = useState(true)
    useFocusEffect((
        useCallback(
            () => {
                setFocus(false);
                setActive(-1);

                // Products
                axios
                    .get(`${baseURL}products`)
                    .then((res) => {
                        setProducts(res.data);
                        setProductsFiltered(res.data);
                        setProductsCtg(res.data);
                        setInitialState(res.data);
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.log('Api call error')
                    })

                // Categories
                axios
                    .get(`${baseURL}categories`)
                    .then((res) => {
                        setCategories(res.data)
                    })
                    .catch((error) => {
                        console.log('Api call error')
                    })

                return () => {
                    setProducts([]);
                    setProductsFiltered([]);
                    setFocus();
                    setCategories([]);
                    setActive();
                    setInitialState();
                };
            },
            [],
        )
    ))

    const searchProduct = (text) => {
        setProductsFiltered(
            products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
        );
    };

    const openList = () => {
        setFocus(true);
    };

    const onBlur = () => {
        setFocus(false);
    };

    // Categories
    const changeCtg = (ctg) => {
        {
            ctg === "all"
                ? [setProductsCtg(initialState), setActive(true)]
                : [
                    setProductsCtg(
                        products.filter((i) => i.category && i.category._id === ctg),
                        setActive(true)
                    ),
                ];
        }
    };

    return (
        <>
            {loading == false ? (
                <View style={{ marginTop: 0, backgroundColor: '#f5f2eb' }} >
                    <Box background={'white'}>
                        <Input w={{
                            base: "100%",
                            md: "10%",

                        }} InputLeftElement={<Icon as={<MaterialIcons name="search" color={'#f5e3cb'} />} size={5} ml="2" />} placeholder="Search"
                            onFocus={openList}
                            onChangeText={(text) => searchProduct(text)}
                            style={{ backgroundColor: '#f5e3cb' }}
                        />
                        {focus == true ? (<MaterialIcons name="close" onPress={onBlur} style={{ position: 'absolute', left: '92%', top: '25%' }} size={20} />) : null}

                    </Box>
                    {focus == true ? (
                        <SearchedProduct
                            navigation={props.navigation}
                            productsFiltered={productsFiltered} />
                    ) : (
                        <ScrollView >

                            <View>
                                <Banner />
                            </View>
                            <CategoryFilter
                                categories={categories}
                                categoryFilter={changeCtg}
                                productsCtg={productsCtg}
                                active={active}
                                setActive={setActive}
                            />
                            {productsCtg.length > 0 ? (
                                <View style={styles.listContainer}>
                                    {productsCtg.map((item) => {
                                        return (

                                            <ProductList
                                                navigation={props.navigation}
                                                key={item._id}
                                                item={item}
                                            />
                                        )
                                    })}
                                </View>

                            ) : (
                                <View style={[styles.center, { height: height / 2 }]}>
                                    <Text>No products found</Text>
                                </View>
                            )}

                        </ScrollView>
                    )
                    }

                </View >
            ) : (
                // Loading
                <Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
                    <ActivityIndicator size="large" color="red" />
                </Container>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        backgroundColor: "#f5f2eb",
        paddingBottom: 120
    },
    listContainer: {
        height: "1%",
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        backgroundColor: "#f5f2eb",
        paddingBottom: 20
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ProductContainer; 