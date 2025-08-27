import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Article } from '../types/news';

interface Props {
  article: Article;
  onPress?: (article: Article) => void;
}

export default function ArticleCard({ article, onPress }: Props) {
  const { title, description, urlToImage, source, publishedAt } = article;

  return (
    <TouchableOpacity onPress={() => onPress?.(article)} style={styles.card}>
      {urlToImage && (
        <Image source={{ uri: urlToImage }} style={styles.image} resizeMode="cover" />
      )}

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {description && (
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.source} numberOfLines={1}>
          {source?.name || 'Unknown'}
        </Text>
        <Text style={styles.date}>
          {publishedAt ? new Date(publishedAt).toLocaleString() : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#444',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  source: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});
