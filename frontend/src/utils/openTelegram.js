// export const openTelegram = (link) => {
//   const inviteMatch = link.match(/\+([a-zA-Z0-9_-]+)/);
//   const inviteCode = inviteMatch ? inviteMatch[1] : null;

//   const telegramAppLink = inviteCode ? `tg://join?invite=${inviteCode}` : link;

//   const a = document.createElement("a");
//   a.href = telegramAppLink;
//   a.target = "_blank";
//   a.rel = "noopener noreferrer";
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);

//   setTimeout(() => {
//     window.open(link, "_blank");
//   }, 1500);
// };

export const openTelegram = (link) => {
  const inviteMatch = link.match(/\+([a-zA-Z0-9_-]+)/);
  const inviteCode = inviteMatch ? inviteMatch[1] : null;

  const telegramAppLink = inviteCode ? `tg://join?invite=${inviteCode}` : link;
  const telegramWebLink = inviteCode ? `https://t.me/joinchat/${inviteCode}` : link;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    window.open(telegramWebLink, "_blank"); // iOS-friendly
  } else {
    const a = document.createElement("a");
    a.href = telegramAppLink;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // fallback
    setTimeout(() => {
      window.open(telegramWebLink, "_blank");
    }, 1500);
  }
};