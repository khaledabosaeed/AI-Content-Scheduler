

const CLIENT_COOKIE_OPTIONS = {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // سنة واحدة
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
};

export const setClientCookie = (
    name: string,
    value: string,
    options: Partial<typeof CLIENT_COOKIE_OPTIONS> = {}
) => {
    const opts = { ...CLIENT_COOKIE_OPTIONS, ...options };
    const cookieString = `${name}=${value}; Path=${opts.path}; Max-Age=${opts.maxAge}; SameSite=${opts.sameSite};`;

    if (opts.secure) {
        document.cookie = `${cookieString} Secure;`;
    } else {
        document.cookie = cookieString;
    }
};


export const getClientCookie = (name: string): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : null;
};

export const deleteClientCookie = (name: string) => {
    document.cookie = `${name}=; Path=/; Max-Age=0;`;
};

export function clearAllCookies(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
}
