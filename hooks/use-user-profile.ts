// hooks/use-user-profile.ts
'use client';

import useSWR from 'swr';

const fetcher = async (url: string) => {
    const res = await fetch(url);             // same‑origin ⇒ cookie Auth ikut
    if (!res.ok) throw new Error('Gagal fetch profil');
    return res.json();                        // { profile: {...} }
};

export default function useUserProfile() {
    const { data, error, isLoading, mutate } = useSWR('/api/get-user-profile', fetcher);

    return {
        profile: data?.profile,
        isLoading,
        isError: error,
        refreshProfile: mutate,
    };
}