import { toast } from '@/hooks/use-toast';

import { ZodError } from 'zod';

export const FALLBACK = 'N/A'; // null or N/A
export const LOCALE = undefined; //undefined (auto locale), "ar" "fr", en-US...
export const DATE_LENGTH = 'short'; //undefined (auto locale), "ar" "fr", en-US...

export const handleZodError = (error: any) => {
  if (error instanceof ZodError) {
    let friendlyErrors = [];
    const formatter = new Intl.ListFormat('en', {
      style: 'long',
      type: 'conjunction',
    });

    for (const [, errorObj] of Object.entries(error.errors)) {
      let message = errorObj.message;
      const f = errorObj.path[0] as string;
      if (!message.toLowerCase().includes(f.toLowerCase())) {
        const capitalizedF = f.charAt(0).toUpperCase() + f.slice(1);
        message = `${capitalizedF} ${message}`;
      }
      // friendlyErrors += message + "\n"
      friendlyErrors.push(message);
    }
    return formatter.format(friendlyErrors);
  }
};

export const word = (input: string, base: number = 3, fallback = FALLBACK) => {
  if (!input) return fallback;
  return input.length <= base
    ? input
    : input
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const enumToOptions = (Enum: any) => {
  const options = [];

  for (const key in Enum) {
    options.push({
      label: word(key),
      value: key,
    });
  }

  return options;
};

export function copyTextToClipboard(text: string, message: string = 'Text copied to clipboard.') {
  navigator.clipboard.writeText(text).then(
    () => {
      toast({ title: message });
    },
    err => {
      toast({
        title: 'Error copying text to clipboard',
        variant: 'destructive',
      });
    }
  );
}

export function openEmail(email: string, platform: 'web' | 'sys' = 'web') {
  if (platform === 'sys') {
    return (window.location.href = 'mailto:');
  }
  const domain = email.split('@')[1];
  if (!domain) return alert('Please provide email address');
  if (domain === 'gmail.com') {
    window.open('https://mail.google.com/mail', '_blank');
  } else if (domain === 'yahoo.com') {
    window.open('https://mail.yahoo.com', '_blank');
  } else if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') {
    window.open('https://outlook.live.com/mail/0/inbox', '_blank');
  } else {
    window.open('https://' + domain, '_blank');
  }
}

export const date_range = (days = 30) => {
  const currentDate = new Date();
  const prevDate = new Date(currentDate);
  prevDate.setDate(currentDate.getDate() - days);

  return {
    from: prevDate,
    to: currentDate,
  };
};
