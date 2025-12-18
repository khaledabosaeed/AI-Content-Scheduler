خطة حفظ Social Account والبوستات المجدولة
1️⃣ حفظ Social Account ID

بعد ما المستخدم يعمل تسجيل دخول على المنصة (Facebook، Twitter، إلخ) عن طريق OAuth:

احصل على الـ access token الخاص بالمستخدم.

استخدم الـ access token لجلب بيانات الحساب من API المنصة.

احفظ account ID في جدول social_accounts مع:

معرف المستخدم في التطبيق (user_id)

المنصة (platform)

الـ access token

الهدف: يكون عندك مرجع لكل حساب اجتماعي مرتبط بالمستخدم.

2️⃣ حفظ البوست حسب نوعه

استقبل بيانات البوست من المستخدم أو الـ AI:

المحتوى (content)

المنصة (platform)

الحالة (draft أو scheduled)

تاريخ النشر (scheduledAt) إذا كان مجدول

قبل الحفظ، احصل على account ID من جدول social_accounts حسب المستخدم والمنصة.

حدد الجدول حسب الحالة:

إذا كان draft → احفظه في جدول posts العادي.

إذا كان scheduled → احفظه في جدول post_schedules مع account ID وربطه بالبوست.

الهدف: الفصل بين المنشورات المسودة والمنشورات المجدولة.

3️⃣ ملاحظات أساسية

تأكد من وجود user_id في جدول social_accounts لتسهيل الربط.

جدول post_schedules يجب أن يحتوي على:

post_id، account_id، user_id، scheduled_for، status، executed_at، error_message، platform_response.

جدول posts للـ drafts فقط.

العملية تعتمد على: ربط الحساب الاجتماعي بالبوست، وتحديد مكان الحفظ حسب الحالة.
