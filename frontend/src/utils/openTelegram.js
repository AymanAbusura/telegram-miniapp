export const openTelegram = (link) => {
  const inviteMatch = link.match(/\+([a-zA-Z0-9_-]+)/);
  const inviteCode = inviteMatch ? inviteMatch[1] : null;

  const telegramAppLink = inviteCode ? `tg://join?invite=${inviteCode}` : link;

  window.location.href = telegramAppLink;

  setTimeout(() => {
    window.open(link, "_blank");
  }, 1000);
};