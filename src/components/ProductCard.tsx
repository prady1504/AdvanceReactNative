import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Product } from "../utils/api";

const { width } = Dimensions.get("window");
const cardWidth = (width - 40) / 2;

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <View style={styles.card}>
    <Image source={{ uri: product.thumbnail }} style={styles.image} />
    <Text numberOfLines={1} style={styles.title}>{product.title}</Text>
    <Text style={styles.price}>${product.price}</Text>
  </View>
);

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 8,
    padding: 8,
    elevation: 2,
  },
  image: { width: "100%", height: 100, borderRadius: 6 },
  title: { fontSize: 14, fontWeight: "600", marginTop: 6 },
  price: { fontSize: 12, color: "green", marginTop: 2 },
});
