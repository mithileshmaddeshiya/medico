# Bookings par WhatsApp notification — setup

Lab booking form ab patient ko WhatsApp par nahi bhejta. Details seedha server
par jaati hain, Firestore ke `labLeads` collection mein save hoti hain, aur
wahan se aapke WhatsApp (**+91 98912 33525**) par bheji jaati hain.

**Booking hamesha save hoti hai.** Notification fail ho jaaye, WhatsApp band ho,
token expire ho — lead phir bhi Firestore mein rehti hai. Kuch kho nahi sakta.

Notification chalane ke liye ek gateway chahiye. WhatsApp ek closed network hai —
koi bhi server bina gateway ke message nahi bhej sakta. Do raaste hain.

---

## Option A — CallMeBot (5 minute, free)

Sabse tez. Test karne ke liye ya kam volume ke liye theek hai.

1. Apne WhatsApp se **+34 644 51 95 23** ko ye message bhejiye:

   ```
   I allow callmebot to send me messages
   ```

2. Bot jawab mein ek API key bhejega, jaise `123456`.

3. Wo key hosting mein env variable ki tarah daal dijiye
   (Vercel → Settings → Environment Variables):

   ```
   CALLMEBOT_APIKEY = 123456
   ```

4. Redeploy kar dijiye. Bas — agli booking aapke WhatsApp par aa jaayegi.

**Local test karna ho** to project root mein `.env.local` banaiye:

```
CALLMEBOT_APIKEY=123456
```

### Iska trade-off — padh lijiye

Message ek free third-party service se hokar jaata hai, aur us message mein
patient ka **naam, mobile aur ghar ka pura pata** hota hai. Testing ke liye
theek hai. Lambe samay ke liye Option A par nahi rukna chahiye — DPDP Act ke
hisaab se patient ka data ek unknown third party ko dena risk hai.

Isme koi guarantee bhi nahi hai — free service hai, kabhi bhi band ho sakti hai
ya rate-limit kar sakti hai.

---

## Option B — Meta WhatsApp Cloud API (official, ~1 ghanta)

Ye asli tareeka hai. Free hai service conversations ke liye, aur data Meta se
bahar nahi jaata — jo waise bhi message carry karta hi hai.

1. [business.facebook.com](https://business.facebook.com) par Meta Business
   account banaiye.

2. [developers.facebook.com](https://developers.facebook.com) → **Create App** →
   type **Business** → **WhatsApp** product add kariye.

3. Ek **sender number** register kariye.

   ⚠️ Ye **98912 33525 nahi** ho sakta. WhatsApp apne aap ko message nahi bhej
   sakta — sender alag number hona chahiye. Ek naya SIM ya koi doosra business
   number use kariye.

4. Dashboard se do cheezein copy kariye:
   - **Phone number ID**
   - **Access token** — temporary token 24 ghante mein expire hota hai. System
     User bana kar **permanent token** lijiye, warna har roz tootega.

5. Env variables set kariye:

   ```
   WHATSAPP_TOKEN    = <permanent access token>
   WHATSAPP_PHONE_ID = <phone number id>
   ```

6. Redeploy.

### Ek zaroori baat — 24 ghante ki window

Meta free-form text sirf tab bhejne deta hai jab **aapne** business number ko
pichhle 24 ghante mein message kiya ho. Uske baad messages block ho jaate hain.

Iska matlab: raat 2 baje aayi booking ka notification nahi aayega.

Iska hal **approved template** hai:

1. Meta dashboard → **WhatsApp** → **Message Templates** → **Create**
2. Category: **Utility**
3. Body mein ek variable rakhiye: `{{1}}`
4. Approval mein aam taur par kuch ghante lagte hain
5. Approve hone par template ka naam env mein daal dijiye:

   ```
   WHATSAPP_TEMPLATE = booking_alert
   ```

Code apne aap template mode par switch kar jaayega. Ab 24 ghante wali pabandi
khatam — har booking ka notification aayega.

---

## Kaunsa chunein

| | CallMeBot | Meta Cloud API |
|---|---|---|
| Setup time | 5 minute | ~1 ghanta + template approval |
| Kharcha | Free | Free (service conversations) |
| Patient data kahan jaata hai | Third party | Sirf Meta |
| Kitna bharosemand | Koi guarantee nahi | Production-grade |
| Alag sender number chahiye | Nahi | **Haan** |
| Raat ko bhi aayega | Haan | Template ke baad haan |

**Suggestion:** aaj CallMeBot laga kar flow test kar lijiye. Jab bookings aane
lagein, Meta par shift ho jaaiye. Dono ek saath configured hon to code Meta ko
prefer karta hai — kuch badalna nahi padega, bas CallMeBot ki key hata dijiye.

---

## Kuch na lagayein to?

Bilkul chalega — bas notification nahi aayega.

Bookings Firebase console → Firestore → **`labLeads`** mein dikhengi, sabse naya
`createdAt` se pata chal jaayega. Har lead mein `status: "new"` hota hai, jise
aap `called` ya `done` mein badal sakte hain.

Kahiye to ek chhota admin page bana dun jahan saari leads ek jagah dikhein.

---

## ⚠️ Isse pehle: Firestore rules band kariye

Abhi aapke Firestore rules **poori tarah khule hain**. 23 July 2026 ko verify
kiya gaya — bina kisi login ke, sirf browser mein maujood API key se document
likha, padha aur delete kiya ja sakta hai.

Matlab koi bhi vyakti internet se aapka `labLeads` collection — **har patient ka
naam, mobile aur ghar ka pata** — padh sakta hai aur mita sakta hai.

Firebase console → Firestore Database → **Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Site ko sirf padhna hai
    match /labCities/{doc} { allow read: if true;  allow write: if false; }
    match /cities/{doc}    { allow read: if true;  allow write: if false; }
    match /home/{doc}      { allow read: if true;  allow write: if false; }

    // Patient data — koi client access nahi
    match /labLeads/{doc}  { allow read, write: if false; }

    match /{document=**}   { allow read, write: if false; }
  }
}
```

**Dhyan dijiye:** `labLeads` par `write: false` karne se abhi ka booking flow
band ho jaayega, kyunki server bhi usi public API key se likhta hai. Uske liye
**Firebase Admin SDK** (service account key) chahiye hoga — server tab rules ko
bypass karke likhega, aur bahar se koi nahi likh paayega.

Bataiye to Admin SDK set kar deta hoon. Ye site ka sabse bada bacha hua risk hai,
aur ab isme patients ka personal data ja raha hai.
