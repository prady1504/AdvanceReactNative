import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Linking, RefreshControl, Text, View, StyleSheet } from 'react-native';
import { Article } from '../types/news';
import ArticleCard from '../components/ArticleCard';
import LoadingIndicator from '../components/Loader';
import ErrorMessage from '../components/Error';
import { cancelInFlight } from '../utils/api';
import { readCache, saveCache, isCacheFresh, dedupeArticles } from '../utils/storage';
import { fetchNews } from '../utils/api';

const CACHE_TTL_MS = 10 * 60 * 1000;
const COUNTRY = 'us';

export default function NewsScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagesFetched, setPagesFetched] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadMore = useMemo(() => articles.length < totalResults, [articles.length, totalResults]);
  const onEndReachedCalled = useRef(false);

  const openArticle = useCallback((article: Article) => {
    if (article.url) Linking.openURL(article.url).catch(() => {});
  }, []);

  const persistArticles = async (
    articlesToSave: Article[],
    total: number,
    lastPage: number
  ) => {
    await saveCache({
      list: articlesToSave,
      totalResults: total,
      timestamp: Date.now(),
      country: COUNTRY,
      lastPage,
    });
  };

  const applyAndPersist = useCallback(
    async (incomingArticles: Article[], nextPage: number, incomingTotal: number) => {
      const merged = dedupeArticles([...articles, ...incomingArticles]);
      setArticles(merged);
      setPage(nextPage);
      setTotalResults(incomingTotal);

      const newSet = new Set(pagesFetched);
      newSet.add(nextPage - 1);
      setPagesFetched(newSet);

      await persistArticles(merged, incomingTotal, nextPage - 1);
    },
    [articles, pagesFetched]
  );

  useEffect(() => {
    let mounted = true;
    const loadNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const cached = await readCache();
        const isUsable = cached?.country === COUNTRY && Array.isArray(cached.list) && cached.list.length > 0;
        const isFresh = cached && isCacheFresh(cached.timestamp, CACHE_TTL_MS);

        if (isUsable && isFresh) {
          setArticles(cached.list);
          setTotalResults(cached.totalResults);
          setPage(cached.lastPage + 1);
          setPagesFetched(new Set([cached.lastPage]));
        } else {
          const { articles: fresh, totalResults: tr } = await fetchNews({ page: 1, country: COUNTRY });
          if (!mounted) return;
          setArticles(fresh);
          setTotalResults(tr);
          setPage(2);
          setPagesFetched(new Set([1]));
          await persistArticles(fresh, tr, 1);
        }
      } catch (e: any) {
        if (mounted) setError(e.message || 'Failed to load news.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadNews();
    return () => {
      mounted = false;
      cancelInFlight();
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || refreshing || !canLoadMore) return;
    if (pagesFetched.has(page)) return;

    setLoading(true);
    setError(null);
    try {
      const { articles: nextArticles, totalResults: tr } = await fetchNews({ page, country: COUNTRY });
      await applyAndPersist(nextArticles, page + 1, tr);
    } catch (e: any) {
      setError(e.message || 'Failed to load more.');
    } finally {
      setLoading(false);
    }
  }, [loading, refreshing, canLoadMore, pagesFetched, page, applyAndPersist]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      const { articles: fresh, totalResults: tr } = await fetchNews({ page: 1, country: COUNTRY });
      setArticles(fresh);
      setTotalResults(tr);
      setPage(2);
      setPagesFetched(new Set([1]));
      await persistArticles(fresh, tr, 1);
    } catch (e: any) {
      setError(e.message || 'Failed to refresh.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      {loading && articles.length === 0 ? (
        <LoadingIndicator label="Loading news..." />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => item.url || `${item.title}-${index}`}
          renderItem={({ item }) => <ArticleCard article={item} onPress={openArticle} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={error ? <ErrorMessage message={error} onRetry={onRefresh} /> : null}
          ListFooterComponent={
            loading && articles.length > 0 ? (
              <LoadingIndicator label="Loading more..." />
            ) : !canLoadMore && articles.length > 0 ? (
              <View style={styles.footer}>
                <Text style={styles.footerText}>No more articles</Text>
              </View>
            ) : null
          }
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (onEndReachedCalled.current) return;
            onEndReachedCalled.current = true;
            loadMore();
          }}
          onMomentumScrollBegin={() => {
            onEndReachedCalled.current = false;
          }}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    marginTop: 30
  },
  listContent: {
    paddingVertical: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
  },
});
