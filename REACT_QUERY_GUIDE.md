# React Query Implementation Guide

## ✅ What Was Implemented

### 1. **ReactQueryProvider**
Location: `src/lib/providers/ReactQueryProvider.tsx`

**Features**:
- Configured with optimized defaults
- 5-minute stale time (data stays fresh)
- 10-minute garbage collection time
- Automatic retry with exponential backoff
- Refetch on window focus and network reconnect
- Development-only devtools

**Configuration**:
```typescript
- staleTime: 5 minutes (data is considered fresh)
- gcTime: 10 minutes (unused data purged after)
- retry: 3 attempts for queries, 1 for mutations
- Exponential backoff: 1s → 2s → 4s → 8s...
```

---

### 2. **useCRUDWithQuery Hook**
Location: `src/lib/hooks/useCRUDWithQuery.ts`

**Enhanced Features Over Original useCRUD**:
- ✅ **Automatic Caching**: Data cached automatically, no manual refetching needed
- ✅ **Optimistic Updates**: UI updates instantly, rolls back on error
- ✅ **Background Refetching**: Data stays fresh automatically
- ✅ **Deduplication**: Multiple components calling same query = single request
- ✅ **Better Loading States**: Separate states for creating/updating/deleting

**Usage Example**:
```typescript
const clients = useCRUDWithQuery({
  queryKey: ["clients"], // Cache key
  fetchFn: getClients,
  createFn: createClient,
  updateFn: updateClient,
  deleteFn: deleteClient,
  entityName: "Cliente",
  getItemId: (client) => client.id,
  getItemDisplayName: (client) => client.businessName,
});

// New properties available:
clients.isCreating  // true while creating
clients.isUpdating  // true while updating
clients.isDeleting  // true while deleting
```

---

### 3. **Layout Integration**
Location: `src/app/(application)/layout.tsx`

- Wrapped entire app with `ReactQueryProvider`
- React Query Devtools available in development mode

---

### 4. **Example Migration**
Location: `src/app/(application)/client/page.tsx`

**Changes**:
```diff
- import { useCRUD } from "@/lib/hooks/useCRUD";
+ import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";

- const clients = useCRUD({
+ const clients = useCRUDWithQuery({
+   queryKey: ["clients"],
    fetchFn: getClients,
    // ... rest is the same
  });

// Better loading state for buttons:
- disabled={clients.loading}
+ disabled={clients.isCreating}  // Specific to action
```

---

## 🚀 Benefits You'll Notice

### 1. **Performance Improvements**

**Before React Query**:
```
User opens Clients page → API call made
User clicks away → Data discarded
User returns → API call made again
Multiple components need same data → Multiple API calls
```

**After React Query**:
```
User opens Clients page → API call made → Cached
User clicks away → Data kept in cache
User returns within 5 min → Instant (from cache)
Multiple components → Single API call, shared cache
```

### 2. **Better UX**

| Feature | Before | After |
|---------|--------|-------|
| Page switch | Loading... | Instant (cached) |
| Create item | Waits for API | Updates instantly |
| Update item | Waits for API | Updates instantly |
| Delete item | Waits for API | Removes instantly |
| Error | Broken state | Rolls back automatically |
| Network fail | Error state | Auto-retry + notification |

### 3. **Developer Experience**

**Before**:
```typescript
// Manual cache invalidation
await createClient(data);
await fetchClients(); // Manual refetch
```

**After**:
```typescript
// Automatic
await clients.create(data);
// Cache invalidated and refetched automatically
```

---

## 📊 Migration Status

### ✅ Completed
- [x] React Query installed
- [x] Provider configured
- [x] useCRUDWithQuery hook created
- [x] Client page migrated

### 🔄 To Migrate

**CRUD Pages** (use same pattern as Client):
- [ ] Driver page
- [ ] Truck page
- [ ] Pallet page
- [ ] Warehouse page

**Order Pages**:
- [ ] Order list page (use `useQuery` directly)
- [ ] usePallets hook (migrate to `useQuery`)

---

## 🛠️ Migration Template

For each remaining CRUD page, follow this template:

```typescript
// 1. Import useCRUDWithQuery
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";

// 2. Replace useCRUD call, add queryKey
const items = useCRUDWithQuery({
  queryKey: ["items"], // ← Add this
  fetchFn: getItems,
  createFn: createItem,
  updateFn: (id, data) => updateItem(String(id), data),
  deleteFn: (id) => deleteItem(String(id)),
  entityName: "Item",
  getItemId: (item) => item.id,
  getItemDisplayName: (item) => item.name,
});

// 3. Update button disabled states
<Button 
  onClick={formModal.openCreate}
  disabled={items.isCreating} // ← More specific
>
  Create
</Button>

<ActionIcon
  onClick={() => items.remove(item)}
  disabled={items.isDeleting} // ← More specific
>
  <IconTrash />
</ActionIcon>
```

---

## 🔍 React Query Devtools

**How to Use**:
1. Run `npm run dev`
2. Look for floating React Query icon (bottom-right)
3. Click to see:
   - All cached queries
   - Query states (fresh, stale, fetching)
   - Mutation history
   - Cache data

**Useful for**:
- Debugging cache behavior
- Seeing what's being fetched
- Checking query keys
- Monitoring mutations

---

## 🎯 Next Steps

1. **Migrate Remaining Pages** (~20 min per page)
   ```bash
   # Test as you go
   npm run dev
   ```

2. **Verify Functionality**
   - Create items
   - Update items
   - Delete items
   - Check offline behavior (disconnect network)
   - Check cache behavior (navigate away and back)

3. **Monitor Performance**
   - Open DevTools → Network tab
   - Should see fewer API calls
   - Navigate between pages → No API calls for cached data

---

## 💡 Pro Tips

### Cache Invalidation
```typescript
// Manual invalidation when needed
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ["clients"] });
```

### Prefetching
```typescript
// Prefetch on hover for faster UX
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClient(clientId),
  });
};
```

### Dependent Queries
```typescript
// Only fetch if ID exists
const client = useQuery({
  queryKey: ["client", id],
  queryFn: () => getClient(id),
  enabled: !!id, // Only run if id exists
});
```

---

## 🐛 Troubleshooting

**Issue**: "QueryClient not found"
**Solution**: Make sure ReactQueryProvider wraps your app in layout.tsx

**Issue**: Data not updating
**Solution**: Check queryKey is consistent across usages

**Issue**: Too many refetches
**Solution**: Adjust staleTime in ReactQueryProvider config

**Issue**: Optimistic update not working
**Solution**: Check queryKey matches exactly in mutation

---

## 📚 Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [React Query Devtools](https://tanstack.com/query/latest/docs/react/devtools)
- [Best Practices](https://tkdodo.eu/blog/practical-react-query)

---

## ✅ Summary

React Query is now fully integrated and ready to use! The Client page demonstrates the pattern. Follow the migration template for remaining pages to get:

- ⚡ Faster page loads
- 🔄 Automatic background sync
- 💾 Smart caching
- 🎯 Optimistic updates
- 🛡️ Error recovery
- 🔍 Better debugging with devtools

Enjoy the performance boost! 🚀
