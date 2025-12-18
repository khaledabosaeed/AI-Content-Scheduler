

//تخزين بيانات حساب فيسبوك داخل الذاكرة 

export type FacebookAccount = {
  pageId: string;
  pageName: string;
  pageAccessToken: string;
};

// تخزين بسيط في الذاكرة (يمسح لو السيرفر عمل restart)
const store = new Map<string, FacebookAccount>();

export function saveFacebookAccount(userId: string, data: FacebookAccount) {
  store.set(userId, data);
}

export function getFacebookAccount(userId: string): FacebookAccount | null {
  return store.get(userId) ?? null;
}
