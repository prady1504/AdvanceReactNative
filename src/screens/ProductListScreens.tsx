import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories, Product } from "../utils/api";

const LIMIT = 10;
const MIN_ITEM_WIDTH = 200; // desired min width for each item
const ProductListScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

useEffect(() => {
  const subscription = Dimensions.addEventListener("change", ({ window }) => {
    setScreenWidth(window.width);
  });

  return () => subscription?.remove();
}, []);
const numColumns = Math.floor(screenWidth / MIN_ITEM_WIDTH);

  // ⬇️ fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.map(cat => cat.name));
    } catch (err) {
      console.error(err);
    }
  };

  // ⬇️ fetch products
  const fetchProducts = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    try {
      const data = await getProducts(LIMIT, reset ? 0 : skip, search, category);
      setProducts(reset ? data.products : [...products, ...data.products]);
      setSkip(reset ? LIMIT : skip + LIMIT);
      setHasMore(data.products.length === LIMIT);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(true);
  }, [search, category]);

  const onTextChange = (text: string) => {
    setSearch(text);
    setSkip(0);
  };

  const onPickerChange = (value: string) => {
    setCategory(value);
    setSkip(0);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        value={search}
        onChangeText={onTextChange}
        style={styles.search}
      />

      <Picker selectedValue={category} onValueChange={onPickerChange}>
        <Picker.Item label="All" value="" />
        {categories.map((cat) => <Picker.Item key={cat} label={cat} value={cat} />)}
      </Picker>

      <FlatList
        key={numColumns} // to re-render on orientation change
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductCard product={item} />}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        onEndReached={() => fetchProducts(false)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        initialNumToRender={6}
        removeClippedSubviews
        getItemLayout={(_, index) => ({ length: 200, offset: 200 * index, index })}
      />
    </View>
  );
};
export default ProductListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f2f2f2" },
  search: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 6,
    padding: 8, marginBottom: 8, backgroundColor: "#fff"
  },
  list: { paddingBottom: 20 },
});
