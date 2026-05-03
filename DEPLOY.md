# ZHUOHENG Self-Host Deployment Runbook

Tested on **Ubuntu 22.04 LTS** with **Docker 24+** and **nginx 1.18+**.

## TL;DR (5-minute deploy)

```bash
# On a fresh server:
curl -fsSL https://get.docker.com | sudo sh && sudo usermod -aG docker $USER
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
# log out & back in so docker group takes effect

git clone <your-repo>.git /opt/zhuoheng
cd /opt/zhuoheng
cp .env.example .env
nano .env                            # fill SMTP_* + NEXT_PUBLIC_SITE_URL
./scripts/deploy.sh                  # build + start + smoke-test

sudo cp nginx.conf.example /etc/nginx/sites-available/zhuoheng.conf
sudo nano /etc/nginx/sites-available/zhuoheng.conf   # set server_name to your domain
sudo ln -s /etc/nginx/sites-available/zhuoheng.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d zhuoheng.com -d www.zhuoheng.com
```

Site live at `https://zhuoheng.com` (defaults to `/zh`, switch with the EN button).

---

## 1. Server prep (one-time)

### 1.1 Install Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```
Log out & log back in so the `docker` group activates.

### 1.2 Install nginx + certbot

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 1.3 Open firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 2. App deploy

### 2.1 Clone & configure

```bash
git clone <your-git-url> /opt/zhuoheng
cd /opt/zhuoheng
cp .env.example .env
nano .env
```

**Critical .env values to fill in:**

| Key | Required | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Your https URL, e.g. `https://zhuoheng.com` |
| `SMTP_HOST` | ✅ for emails | e.g. `smtp.exmail.qq.com` |
| `SMTP_PORT` | ✅ | `465` for SSL, `587` for STARTTLS |
| `SMTP_SECURE` | ✅ | `true` for 465, `false` for 587 |
| `SMTP_USER` | ✅ | Your sales mailbox login |
| `SMTP_PASS` | ✅ | Mailbox password / app token |
| `SMTP_FROM` | ✅ | `"ZHUOHENG <sales@zhuoheng.com>"` |
| `SALES_NOTIFY_EMAIL` | ✅ | Where you want inquiries delivered |

> **No SMTP yet?** App still works — inquiries log to `docker compose logs web` instead of being mailed.

### 2.2 Build & start (one command)

```bash
./scripts/deploy.sh
```

The script: pulls latest code · validates `.env` · builds the Docker image · brings up the stack · waits for health · smoke-tests `http://127.0.0.1:3000` · tails logs.

### 2.3 Verify locally

```bash
curl -I http://127.0.0.1:3000        # should be 307 → /zh
curl -I http://127.0.0.1:3000/zh     # should be 200
```

---

## 3. nginx reverse proxy

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/zhuoheng.conf
sudo nano /etc/nginx/sites-available/zhuoheng.conf   # change server_name to your domain
sudo ln -s /etc/nginx/sites-available/zhuoheng.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. SSL via Let's Encrypt

```bash
sudo certbot --nginx -d zhuoheng.com -d www.zhuoheng.com
```

Certbot auto-edits the nginx config and adds a renewal cron. Done.

---

## 5. Daily ops

### 5.1 Push a new release

On your laptop:
```bash
git push origin main
```

On the server:
```bash
cd /opt/zhuoheng
./scripts/deploy.sh                 # one command does it all
```

### 5.2 Check logs

```bash
docker compose logs -f web          # live stream
docker compose logs --tail=200 web  # last 200 lines
```

### 5.3 Restart without rebuild

```bash
docker compose restart web
```

### 5.4 Stop the stack

```bash
docker compose down
```

---

## 6. Verify SEO is healthy

After deploy, hit these URLs in a browser:

- `https://zhuoheng.com/sitemap.xml` — should list zh + en versions of every page and product
- `https://zhuoheng.com/robots.txt` — should point to sitemap
- View source on any product page — should contain `<script type="application/ld+json">` with Schema.org Product
- View source on `/`/`/zh`/`/en` — should contain `<link rel="alternate" hreflang="zh-CN" ...>` etc.

Then submit `https://zhuoheng.com/sitemap.xml` to **Google Search Console** and **Bing Webmaster Tools**.

---

## 7. Optional: enable Meilisearch (when you scale past ~500 SKUs)

1. Uncomment the `meilisearch` service in [docker-compose.yml](docker-compose.yml)
2. Set `MEILI_MASTER_KEY` in `.env` to a long random string
3. `docker compose up -d meilisearch`
4. Index products via the Meili HTTP API
5. Update `lib/api/products.ts` `queryProducts` to call Meili

---

## 8. Backups

The MVP is stateless. When you connect a database:

```bash
docker exec zhuoheng-db pg_dump -U zhuoheng zhuoheng > /backups/$(date +%F).sql
```

Add to crontab for daily backups.

---

## 9. Common issues

| Problem | Fix |
|---|---|
| `Cannot find module 'next-intl'` during build | `docker compose build --no-cache` |
| 502 from nginx | `docker compose ps` → web not up. Check `docker compose logs web` |
| Inquiry email not received | Check `.env` SMTP_*; check `docker compose logs web` for `📥 NEW INQUIRY` console fallback message — that means SMTP is unconfigured |
| `next/font` build fails behind GFW | Already handled — fonts load client-side from Google CDN with system fallback |
| Tailwind class not applying | Tailwind config change requires `docker compose build --no-cache && docker compose up -d` |
| `EACCES /app/.next` on first build | rerun `docker compose build --no-cache` |
| Sitemap stale after adding products | `docker compose restart web` (sitemap is regenerated on each request, but cached aggressively in production) |
| Port 3000 conflict on dev machine | The standalone server inside Docker still binds 3000 internally; nginx proxies to it via 127.0.0.1:3000 |

---

## 10. Security checklist

Run through this list **before pointing DNS at the server**.

### 10.1 Secrets & file permissions

```bash
# .env contains SMTP password — never world-readable
chmod 600 /opt/zhuoheng/.env
chown root:root /opt/zhuoheng/.env

# verify
ls -la /opt/zhuoheng/.env       # expect -rw------- root root
```

`.env` is in `.gitignore` — confirm it never made it into the repo: `git log --all --full-history -- .env` should be empty.

### 10.2 nginx hardening (already in `nginx.conf.example`)

After `nginx -t && systemctl reload nginx`, verify from outside:

```bash
curl -sI https://zhuoheng.com/ | grep -iE 'strict-transport|x-frame|x-content|referrer|content-security|permissions'
```

Expected headers: `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy: ...`, `Permissions-Policy: ...`. TLS 1.2+ only (`server_tokens off`).

### 10.3 API rate limit + validation

The two public endpoints are hardened with **4 layers**: rate limit (in-memory, IP-keyed) · body size cap · Zod schema validation · CRLF strip on header-bound fields (anti-injection). Honeypot `hp` field rejects bots silently.

Limits:
- `POST /api/inquiry` — **5 / minute / IP**, max 100 KB body
- `POST /api/oem` — **3 / minute / IP**, max 50 KB body

Smoke test (rate limit should kick in on the 6th call):

```bash
for i in {1..7}; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST https://zhuoheng.com/api/inquiry \
    -H "Content-Type: application/json" \
    -d '{"name":"a","email":"a@b.com","message":"x","locale":"en"}'
done
# expect: 200 200 200 200 200 429 429
```

Bad payload should return 400, not 500:
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://zhuoheng.com/api/inquiry \
  -H "Content-Type: application/json" -d '{"email":"not-an-email"}'
# expect: 400
```

CRLF injection should be stripped (no extra headers in delivered email) — manually verify by submitting an inquiry with `name: "Eve\r\nBcc: attacker@x.com"`.

### 10.4 Legal pages live

After deploy these MUST resolve in **all 8 locales**:
- `/{locale}/privacy`
- `/{locale}/terms`
- `/{locale}/cookies`

Cookie consent banner shows on first visit (per browser), persists in `localStorage` under `jf-cookie-ack-v1`.

### 10.5 npm audit — accepted risk

`npm audit` flags a moderate severity in **PostCSS** (a transitive dep of Next 14 internals). Patching requires upgrading to Next 16, which is a breaking change deferred to the next major.

**Mitigation:** the production container runs Next in `output: standalone` mode — only the runtime subset of deps is loaded, and PostCSS does not run at request time. The vulnerability requires a malicious CSS source file at build time, and we never accept user-supplied CSS. **Accepted risk for v1, scheduled for cleanup in v2 with the Next 16 upgrade.**

Periodically rerun `npm audit` to spot any *new* high/critical issues; address those immediately.

---

## 12. Rollback

```bash
cd /opt/zhuoheng
git log --oneline -5                 # find a known-good commit
git checkout <sha>
./scripts/deploy.sh
```

To revert to previous Docker image without rebuild:
```bash
docker compose down
docker run -d --name zhuoheng-web -p 127.0.0.1:3000:3000 \
  --env-file .env --restart unless-stopped \
  zhuoheng-web:<old-image-id>
```
