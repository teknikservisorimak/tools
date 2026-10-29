# ORİ Asistan — Kurulum (tamamen ücretsiz)

Sitedeki **"ORİ'ye sor"** sohbet kutusu şu şekilde çalışır:

```
Ziyaretçi → ori-asistan.js (GitHub Pages) → Cloudflare Worker (bu klasör) → Google Gemini API
```

API anahtarı yalnızca Cloudflare'da gizli (secret) olarak durur; sitede görünmez.

## 1) Ücretsiz Gemini API anahtarı al
1. https://aistudio.google.com/apikey adresine Google hesabınla gir.
2. **Create API key** → anahtarı kopyala (`AIza...` ile başlar). Kredi kartı gerekmez.

## 2) Cloudflare Worker'ı yayınla
Bu klasörde (`tools/ori-worker`) PowerShell aç:

```powershell
npx wrangler login                      # tarayıcıda ücretsiz Cloudflare hesabıyla giriş/kayıt
npx wrangler deploy                     # Worker'ı yayınlar, adresini yazar
npx wrangler secret put GEMINI_API_KEY  # 1. adımdaki anahtarı yapıştır
```

`deploy` çıktısında şu tarz bir adres görünür:
`https://ori-asistan.<hesap-adın>.workers.dev`

## 3) Siteye bağla
`index.html` (ve istenen diğer sayfalar) içinde `</body>` etiketinden hemen önce:

```html
<script src="ori-asistan.js" data-endpoint="https://ori-asistan.<hesap-adın>.workers.dev" defer></script>
```

Değişikliği GitHub'a gönderince birkaç dakika içinde site güncellenir.

## Ayarlar
| Ne | Nerede |
|---|---|
| Asistanın bildikleri / kuralları | `src/index.js` → `SYSTEM_PROMPT` |
| İzin verilen siteler | `wrangler.toml` → `ALLOWED_ORIGINS` |
| Model | `wrangler.toml` → `GEMINI_MODEL` |
| Hız sınırı | `src/index.js` → `RATE_LIMIT` (IP başına dakikada 20) |

Değişiklikten sonra `npx wrangler deploy` ile tekrar yayınla.

## Ücretsiz limitler
- Cloudflare Workers: günde 100.000 istek.
- Gemini ücretsiz katman: dakikalık/günlük istek sınırı vardır; dolarsa asistan
  "şu an yanıt veremiyorum" der, **ücret kesilmez**.
- Not: Ücretsiz katmanda Google sohbetleri ürün geliştirme için kullanabilir;
  sohbet kutusunda kullanıcıya kişisel bilgi paylaşmaması hatırlatılır.

## Test
```powershell
curl.exe -X POST https://ori-asistan.<hesap-adın>.workers.dev -H "Origin: https://teknikservisorimak.github.io" -H "Content-Type: application/json" -d "{\"messages\":[{\"role\":\"user\",\"text\":\"Merhaba\"}]}"
```

