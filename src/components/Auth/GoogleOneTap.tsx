import { useEffect } from "react";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        google?: any;
    }
}

interface GoogleOneTapProps {
    onSuccess: (credential: string) => void;
    onError?: (err: unknown) => void;
}

export default function GoogleOneTap({ onSuccess, onError }: GoogleOneTapProps) {
    useEffect(() => {
        const scriptId = "google-gsi-client";
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        const initializeGoogle = () => {
            if (!window.google) return;

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
                callback: (response: { credential: string; }) => {
                    try {
                        onSuccess(response.credential);
                    } catch (e) {
                        onError?.(e);
                    }
                },
                auto_select: false,
                cancel_on_tap_outside: true,
                use_fedcm_for_prompt: false,
            });

            const btn = document.getElementById("googleBtn");
            if (btn) {
                window.google.accounts.id.renderButton(btn, {
                    theme: "outline",
                    size: "large",
                    shape: "pill",
                    width: "100%",
                });
            }

            window.google.accounts.id.prompt();
        };

        if (!script) {
            script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogle;
            script.onerror = () => onError?.("Failed to load Google script");
            document.head.appendChild(script);
        } else {
            initializeGoogle();
        }

        return () => {
            // We don't necessarily want to remove the script as it might be used elsewhere
            // but we should cancel the prompt
            window.google?.accounts.id.cancel();
        };
    }, [onSuccess, onError]);

    return <div id="googleBtn" className="w-full flex justify-center min-h-[44px]"></div>;
}
