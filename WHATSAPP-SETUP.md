# Bookings par WhatsApp notification — setup

Lab booking form ab patient ko WhatsApp par nahi bhejta. Details seedha server
par jaati hain, Firestore ke `labLeads` collection mein save hoti hain, aur
wahan se aapke WhatsApp (**+91 98912 33525**) par bheji jaati hain.

**Booking hamesha save hoti hai.** Notification fail ho jaaye, WhatsApp band ho,
token expire ho — lead phir bhi Firestore mein rehti hai. Kuch kho nahi sakta.

Notification chalane ke liye ek gateway chahiye. WhatsApp ek closed network hai —
koi bhi server bina gateway ke message nahi bhej sakta.

---

## ✅ Abhi jo chal raha hai — skwebtech

Aapka **wa.skwebtech.in** account laga hua hai. Har booking `new_lab_test_booking`
template ke through **916392108234** par aa jaati hai. 25 July 2026 ko live test
kiya gaya — gateway ne `sent: true` return kiya.

Settings `.env.local` mein hain (ye file git mein nahi jaati):

```
SKWEBTECH_APIKEY      = <dashboard se JWT>
SKWEBTECH_CAMPAIGN    = new_lab_test_booking
SKWEBTECH_DESTINATION = 916392108234
```

Vercel par ye teenon **Settings → Environment Variables** mein daalne honge,
warna live site par notification nahi jaayega — `.env.local` sirf aapke laptop
par kaam karta hai.

### ⏳ API key 31 July 2026 ko expire ho rahi hai

`SKWEBTECH_APIKEY` ek JWT hai. Jo abhi lagi hai wo **24 July 2026** ko bani aur
**31 July 2026** ko khatam ho jaayegi — uske baad WhatsApp par kuch nahi aayega.

Bookings phir bhi Firestore mein safe rahengi, sirf alert band hoga. Jab band ho:
skwebtech dashboard se nayi key lekar `.env.local` aur Vercel dono mein badal
dijiye. Server log saaf-saaf likhega ki key expire ho gayi hai.

### Template ke 5 variable

Message ka text template mein fix hai — hum sirf uske khaali khaane bharte hain,
**isi order mein**:

| Slot | Kya jaata hai |
|---|---|
| 1 | Patient ka naam |
| 2 | Mobile number |
| 3 | City |
| 4 | Address (na bhara ho to "—") |
| 5 | Test ka naam (na ho to "Sample collection") |

⚠️ **Ye order silently toot sakta hai.** Code template ko padh nahi sakta, isliye
galat order par bhi gateway `success: true` hi bolta hai — bas message mein
mobile number "City" ke neeche chhap jaata hai. Ek baar aisa ho chuka hai
(25 July 2026), asli message dekh kar theek kiya gaya.

Isliye: **template kabhi edit karein to ek test booking bhej kar message padh
lijiye.** Order badla ho to [notifyWhatsapp.js](src/lib/notifyWhatsapp.js) mein
`templateParams` ki list usi hisaab se badal dijiye. Slot ki ginti badle to list
ki lambai bhi badalni padegi, warna gateway message reject kar dega.

---

## Option B — CallMeBot (5 minute, free)

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

## Option C — Meta WhatsApp Cloud API (official, ~1 ghanta)

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

| | skwebtech (abhi) | CallMeBot | Meta Cloud API |
|---|---|---|---|
| Setup time | ✅ ho chuka | 5 minute | ~1 ghanta + template approval |
| Kharcha | Aapke plan ke hisaab se | Free | Free (service conversations) |
| Patient data kahan jaata hai | skwebtech + Meta | Third party | Sirf Meta |
| Kitna bharosemand | Reseller par nirbhar | Koi guarantee nahi | Production-grade |
| Alag sender number chahiye | Nahi | Nahi | **Haan** |
| Raat ko bhi aayega | Haan (template hai) | Haan | Template ke baad haan |
| Key expire hoti hai | **Haan — dhyan rakhiye** | Nahi | Nahi (permanent token se) |

Ek se zyada configured hon to code is order mein chunta hai: **skwebtech →
Meta → CallMeBot**. Kisi doosre par shift karna ho to `SKWEBTECH_APIKEY` hata
dijiye, baaki code waisa hi rahega.

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
