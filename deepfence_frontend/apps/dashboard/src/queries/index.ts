import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { QueryKey } from '@tanstack/react-query';

import { queryClient } from '@/queries/client';
import { malwareQueries } from '@/queries/malware';
import { searchQueries } from '@/queries/search';
import { secretQueries } from '@/queries/secret';
import { vulnerabilityQueries } from '@/queries/vulnerability';

export function invalidateQueries(queryKey: QueryKey) {
  return queryClient.invalidateQueries({
    queryKey,
  });
}

export function invalidateAllQueries() {
  queryClient.refetchQueries({
    type: 'active',
  });
}

export const queries = mergeQueryKeys(
  vulnerabilityQueries,
  searchQueries,
  secretQueries,
  malwareQueries,
);
