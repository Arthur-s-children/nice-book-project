import { useQuery } from '@tanstack/react-query';
import { supabase } from '../api/supabase'; // 📍 Переконайся, що шлях до твого supabase клієнта вірний

interface DeliveryItem {
  ref: string;
  name: string;
}

/**
 * Хук для пошуку міст через Supabase Edge Function (з оптимізацією React Query)
 */
export function useSupabaseDeliveryCities(search: string) {
  const cleanSearch = search.trim();

  return useQuery<DeliveryItem[]>({
    queryKey: ['supabase-delivery-cities', cleanSearch],
    queryFn: async () => {
      if (cleanSearch.length < 2) return [];

      // Викликаємо функцію, передаючи body прямо в другий аргумент
      const { data, error } = await supabase.functions.invoke('nova-poshta', {
        body: { action: 'getCities', search: cleanSearch },
      });

      if (error) {
        console.error('Edge Function Error (Cities):', error);
        throw new Error(error.message);
      }

      return data || [];
    },
    // Запит спрацює лише якщо введено мінімум 2 літери
    enabled: cleanSearch.length >= 2,
    // Дані закешуються на 5 хвилин
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Хук для завантаження відділень або поштоматів для обраного міста
 */
export function useSupabaseDeliveryWarehouses(
  cityRef: string,
  type: 'warehouse' | 'postomat',
) {
  return useQuery<DeliveryItem[]>({
    queryKey: ['supabase-delivery-warehouses', cityRef, type],
    queryFn: async () => {
      if (!cityRef) return [];

      const { data, error } = await supabase.functions.invoke('nova-poshta', {
        body: { action: 'getWarehouses', cityRef, type },
      });

      if (error) {
        console.error('Edge Function Error (Warehouses):', error);
        throw new Error(error.message);
      }

      return data || [];
    },
    // Запит спрацює тільки тоді, коли вибрано конкретне місто
    enabled: Boolean(cityRef),
    // Відділення змінюються рідко, тому кешуємо їх на 10 хвилин
    staleTime: 1000 * 60 * 10,
  });
}
