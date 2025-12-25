import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GitHubStats {
  user: {
    login: string;
    name: string;
    avatar_url: string;
    created_at: string;
  };
  stats: {
    totalStars: number;
    totalForks: number;
    publicRepos: number;
    followers: number;
    following: number;
  };
  languages: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  streak: {
    current: number;
    longest: number;
    total: number;
  };
  activity: number[];
}

export function useGitHubStats() {
  const [data, setData] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (username: string) => {
    if (!username) {
      setError("Username is required");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: result, error: funcError } = await supabase.functions.invoke(
        "github-stats",
        {
          body: { username },
        }
      );

      if (funcError) {
        throw new Error(funcError.message);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch stats";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchStats };
}
