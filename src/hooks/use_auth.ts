import { useEffect, useState } from 'react';
import { get_user } from '../utils/token_service';
import type { user_model } from '../models/user_model';

export function use_auth() {
  const [user, set_user] = useState<user_model | null>(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const load_user = async () => {
      try {
        const stored_user = await get_user();
        set_user(stored_user || null);
      } catch (error) {
        console.error('Error loading user:', error);
        set_user(null);
      } finally {
        set_loading(false);
      }
    };

    load_user();
  }, []);

  return { user, loading };
}
