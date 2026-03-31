import { useState, useEffect } from "react";

export default function useConsentAccepted() {
  const [accepted, setAccepted] = useState(() => {
    try {
      const raw = localStorage.getItem('cookie-consent');
      return raw ? JSON.parse(raw).accepted === true : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem('cookie-consent');
        setAccepted(raw ? JSON.parse(raw).accepted === true : false);
      } catch {
        setAccepted(false);
      }
    };
    window.addEventListener('cookie-consent-changed', handler);
    return () => window.removeEventListener('cookie-consent-changed', handler);
  }, []);

  return accepted;
}
