// export const openTelegram = (link) => {
//   const inviteMatch = link.match(/\+([a-zA-Z0-9_-]+)/);
//   const inviteCode = inviteMatch ? inviteMatch[1] : null;

//   const telegramAppLink = inviteCode ? `tg://join?invite=${inviteCode}` : link;

//   window.location.href = telegramAppLink;

//   setTimeout(() => {
//     window.open(link, "_blank");
//   }, 1000);
// };

export const openTelegram = (link) => {
  const inviteMatch = link.match(/\+([a-zA-Z0-9_-]+)/);
  const inviteCode = inviteMatch ? inviteMatch[1] : null;

  // Telegram deep link
  const telegramAppLink = inviteCode ? `tg://join?invite=${inviteCode}` : link;

  // Detect mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // Try opening Telegram app
    const timeout = setTimeout(() => {
      // If app isn't installed, open browser link
      window.open(link, "_blank");
    }, 1500);

    // Trigger app opening
    window.location.href = telegramAppLink;

    // Clear timeout if page is hidden (app opened successfully)
    window.addEventListener("pagehide", () => clearTimeout(timeout));
  } else {
    // Desktop fallback
    window.open(link, "_blank");
  }
};