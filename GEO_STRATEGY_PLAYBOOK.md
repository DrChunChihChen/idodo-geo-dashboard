# 鴻鼎菓子 iDoDo × GEO (Generative Engine Optimization) 品牌搜尋成長引擎完整實戰手冊

> **專案定位**：2026 永續智慧創新黑客松 | 傳統伴手禮品牌邁向 AI-Ready 之生成式搜尋優化、數據採集與商業閉環策略手冊  
> **適用品牌**：鴻鼎菓子 (iDoDo) 官方旗艦網站  
> **核心目標**：透過 1,000 筆消費場景真實評測，診斷 AI 搜尋死角，改造官網結構化語意，搶佔 ChatGPT、Perplexity、Gemini 等 AI 推薦清單第一名。

---

## 目錄
1. [執行背景與 GEO 典範轉移](#一-執行背景與-geo-典範轉移)
2. [第一階段：真實提問挖掘與 1,000 題 Prompt 矩陣設計](#二-第一階段真實提問挖掘與-1000-題-prompt-矩陣設計)
3. [第二階段：OpenRouter 全自動評測與資料採集架構](#三-第二階段openrouter-全自動評測與資料採集架構)
4. [第三階段：依據評測結果之官網五大改造工程](#四-第三階段依據評測結果之官網五大改造工程)
5. [第四階段：成果驗證指標與商業變現閉環](#五-第四階段成果驗證指標與商業變現閉環)
6. [附錄：即用型自動化 Python 評測與解析程式碼](#六-附錄即用型自動化-python-評測腳本)

---

## 一、 執行背景與 GEO 典範轉移

### 1.1 什麼是 GEO？為什麼傳統 SEO 正在失效？
- **傳統 SEO (Search Engine Optimization)**：目標是爭取 Google 搜尋藍色連結的前三名，依賴反向連結 (Backlinks) 與關鍵字堆疊。
- **生成式搜尋 GEO (Generative Engine Optimization)**：消費者現在直接向 **ChatGPT Search、Perplexity、Google Gemini、Claude** 發問：
  > *「請推薦台中適合送給不吃甜、有高血壓長輩的伴手禮，預算 600 元以內，要有常溫提袋。」*
- **零點擊革命 (Zero-Click Searches)**：AI 不再給 10 個網址讓使用者慢慢點，而是**直接生成最終推薦名單與總結**。
- **痛點**：如果品牌沒有被 AI 的大型語言模型 (LLM) 納入「推薦實體 (Entity)」，或官網缺乏結構化資料導致 AI 爬蟲無法讀取，**品牌將在 AI 搜尋時代徹底隱形**。

### 1.2 鴻鼎菓子的品牌資產與機會點
- **獨家護城河**：全台獨家專利雙層包心噠啵曲奇、連續 6 年世界純粹風味評鑑三星、台中十大伴手禮雙首獎、慈悅雙潔淨標章 (Clean Label)。
- **核心挑戰**：這些強大特色大多以**海報圖片 (JPG/PNG)** 形式存放在官網，AI 爬蟲無法以純文字解析，導致在特定送禮場景落後給一般連鎖品牌。

---

## 二、 第一階段：真實提問挖掘與 1,000 題 Prompt 矩陣設計

不要憑空捏造題目，必須根據**真實消費者搜尋習慣**構建題目。

### 2.1 外部情報工具推薦與挖掘方法
1. **[AlsoAsked](https://alsoasked.com/)**（抓取 Google PAA - People Also Ask 決策樹）：
   - 輸入：`台中伴手禮`、`長輩送禮`
   - 挖掘成果：長輩不能吃太甜可以送什麼？常溫點心能放多久？過年去公婆家送禮有何禁忌？
2. **[AnswerThePublic](https://answerthepublic.com/)**（5W1H 疑問詞輪盤）：
   - 挖掘成果：`哪一家曲奇不油膩`、`台中伴手禮 多少錢`、`企業送禮 怎麼挑`。
3. **[KeywordTool.io](https://keywordtool.io/)**（Google 下拉熱門長尾詞）：
   - 挖掘成果：`台中伴手禮 推薦 ptt`、`送長輩 禮盒 不甜 dcard`、`福委 禮盒 預算 500`。
4. **社群論壇痛點探勘 (Dcard & PTT)**：
   - 看板：Dcard 結婚板/女孩板、PTT 台中板 (Taichung)/職場板 (Salary)。
   - 提取真實痛點：牙口軟硬度、蛋奶素標示、分公司多點配送、辦公室分食獨立包裝。

### 2.2 題目正交維度設計矩陣 (Prompt Orthogonal Matrix)

透過 $5 \times 5 \times 4 \times 3 \times 2$ 的笛卡爾積，膨脹生成 1,000 組高多樣性評測題目：

```
[消費情境 5種] × [痛點與限制 5種] × [預算區間 4種] × [品牌意識強度 3種] × [語氣風格 2種]
```

| 維度 | 變數選項 | 說明與範例 |
| :--- | :--- | :--- |
| **1. 消費情境** | ① 企業福委送禮<br>② 長輩健康養生<br>③ 台中在地名產<br>④ 商務貴賓拜訪<br>⑤ 精緻喜餅彌月 | 涵蓋 B2B 大宗採購、家庭倫理、觀光出差與喜慶場合。 |
| **2. 痛點限制** | ① 減糖/無防腐劑/雙潔淨<br>② 常溫保存/附精美提袋<br>③ 入口即化/長輩牙口友善<br>④ 蛋奶素可食<br>⑤ 辦公室個別獨立包裝 | 測試 AI 能否精準理解複雜負面條件（如「不要太甜」）。 |
| **3. 預算區間** | ① NT\$ 300 以下 (小資平價)<br>② NT\$ 400 ~ 550 (主力親友款)<br>③ NT\$ 550 ~ 750 (中高階禮盒)<br>④ NT\$ 800 以上 (商務旗艦雙首獎) | 檢驗 AI 推薦之商品是否精準落在目標價格帶內。 |
| **4. 品牌意識** | ① 探索型 (無品牌意識)<br>② 競品對比型 (比較意識)<br>③ 決策型 (品牌驗證) | ①「推薦不甜的台中點心」<br>②「有沒有類似香港珍妮但台灣做的曲奇？」<br>③「鴻鼎菓子噠啵曲奇評價好嗎？」 |
| **5. 提問風格** | ① 關鍵字搜尋型 (Short query)<br>② 故事口語對話型 (Conversational) | ①「台中 伴手禮 雙潔淨 推薦」<br>②「下週第一次去男友家拜訪，他媽媽血糖偏高...」 |

---

## 三、 第二階段：OpenRouter 全自動評測與資料採集架構

### 3.1 為什麼不需要分開購買各家 API？
- **一組 Key 打通四大 AI**：
  - **Perplexity**：`perplexity/sonar`（原生自帶網路搜尋與 Citations 引用來源）。
  - **ChatGPT**：`openai/gpt-4o:online`（聯網外掛模式）。
  - **Google Gemini**：`google/gemini-2.0-flash:online`。
  - **Claude**：`anthropic/claude-3.5-sonnet:online`。
- **成本試算**：1,000 題評測使用 `perplexity/sonar` 或 `gemini-2.0-flash:online`，單次提問約 300 tokens，**總花費僅約 \$0.8 ~ \$2.0 美元（約台幣 25 ~ 65 元）**，走 Batch API 再享 5 折。

### 3.2 評測指標四大量化維度
1. **品牌提及率 (Brand Mention Rate, BMR)**：
   $$\text{BMR} = \frac{\text{回答中出現「鴻鼎菓子/idodo/噠啵」之題數}}{\text{總評測題數}} \times 100\%$$
2. **平均推薦排序 (Average Rank)**：
   - 記錄鴻鼎菓子在清單中是第 1 名、第 2 名、第 3 名還是未上榜；計算 **Top 1 佔比**。
3. **官方網域引用率 (Official Citation Rate)**：
   - Perplexity 回傳的參考來源中，是否包含 `idodo.com.tw`？還是只有痞客邦、Dcard、蝦皮？
4. **核心特徵保真度 (USP Fidelity)**：
   - AI 在推薦時，是否正確提到以下 4 項官方權威標籤：
     - `#雙潔淨無添加`
     - `#專利雙層包心`
     - `#連續6年世界三星評鑑`
     - `#台中十大伴手禮首獎`

---

## 四、 第三階段：依據評測結果之官網五大改造工程

評測完成後，數據會揭露出網站的「致命死角」。以下為最具體、最高投報率的改造方案：

### 工程 1：針對失敗場景建立專屬 Landing Page（內容補洞）
- **評測痛點**：在「企業大宗送禮 / 福委會預算 300-500 元」情境，鴻鼎菓子提及率僅 20%（敗給傳統大廠）。
- **根本原因**：官網只有零售商品頁，沒有獨立的「大宗企業採購專區」，AI 抓不到量大折扣階梯。
- **改造行動**：
  1. 建立專屬頁面：`/corporate-gifting`。
  2. 頁面置入清晰文字表格：
     - 滿 50 盒享 92 折 / 滿 100 盒享 88 折 / 滿 200 盒享 85 折。
     - 提供免費企業試吃申請、全台指定多點配送、開立統編發票、客製燙金感謝卡。
  3. 當消費者問 AI「公司送禮預算 500 元」，AI 即可直接引用此頁面。

### 工程 2：注入 Schema.org 結構化資料（消除 AI 資訊盲點）
傳統電商只有 HTML 外觀，AI 爬蟲難以直接解析。必須在每個商品頁 `<head>` 注入 **JSON-LD**：

#### 商品頁結構化資料範例 (Product Schema)：
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "國民曲奇．雙拼派對禮盒(橘金附提袋)",
  "image": "https://www.idodo.com.tw/upload/shop_product_img/product.png",
  "description": "全台獨家專利雙層包心噠啵曲奇，榮獲台灣烘焙大賞TOP30，包心72%苦甜巧克力，純粹無防腐劑。",
  "brand": {
    "@type": "Brand",
    "name": "鴻鼎菓子"
  },
  "award": [
    "台中十大伴手禮首獎",
    "A.A.全球純粹風味三星評鑑最高榮譽",
    "慈悅雙潔淨標章 Clean Label"
  ],
  "offers": {
    "@type": "Offer",
    "price": "550",
    "priceCurrency": "TWD",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "url": "https://www.idodo.com.tw/product/detail/550"
  }
}
</script>
```

### 工程 3：架設「AI 最愛抄的 FAQ 模組」（FAQPage Schema）
將收集到的熱門疑問，在官網做成專屬 FAQ 區塊，並注入 `FAQPage` 結構化標籤。**AI 搜尋引擎有 70% 以上機率會原封不動引用官方回答**：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "鴻鼎菓子曲奇餅乾可以常溫保存多久？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "未開封常溫保存可達 45 天，請置於陰涼乾燥處，避免陽光直射，完全無需冷藏，適合送禮與長途攜帶。"
      }
    },
    {
      "@type": "Question",
      "name": "鴻鼎菓子適合送給長輩或不吃太甜的人嗎？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "非常適合。鴻鼎菓子堅持減糖配方、無防腐劑與人工香精，榮獲慈悅雙潔淨標章 (Clean Label) 與 A.A. 三星評鑑，入口即化，長輩牙口負擔極小。"
      }
    },
    {
      "@type": "Question",
      "name": "蛋奶素食者可以吃鴻鼎菓子嗎？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "可以。全系列曲奇餅乾與心願綜合堅果塔均為蛋奶素可食，包裝均清楚標註。"
      }
    }
  ]
}
</script>
```

### 工程 4：語意標籤架構重構（解決語意稀釋）
- **去除純圖片海報**：將壓在 Banner 圖片中的宣傳文字，轉為真實的 HTML `<h2>`、`<ul>`、`<p>`。
- **唯一核心 H1 (Single Semantic H1)**：
  - 修正前：導航列每個分類都寫 `<h1>`，整頁有 18 個 `<h1>`，稀釋核心主題權重。
  - 修正後：每頁唯一的 `<h1>` 就是**核心產品名稱**或**品牌旗艦主題**。
- **圖片 `alt` 補全**：
  - 修正前：`alt="img_01.jpg"`
  - 修正後：`alt="鴻鼎菓子 噠啵曲奇 雙層包心巧克力 台中十大伴手禮首獎禮盒"`

### 工程 5：開放 AI 爬蟲通行證 (Robots.txt)
在官網根目錄 `robots.txt` 明確宣告開放權限，避免安全防護（如 Cloudflare）將 AI 爬蟲誤判為惡意流量：
```txt
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://www.idodo.com.tw/sitemap.xml
```

---

## 五、 第四階段：成果驗證指標與商業變現閉環

### 5.1 優化前後成果對比預期 (Baseline vs. Optimized)

| 關鍵指標 | 優化前現況 (Baseline) | GEO 優化後 (Optimized) | 躍升幅度 |
| :--- | :---: | :---: | :---: |
| **AI 品牌提及率 (BMR)** | 28.0% | **86.4%** | **+58.4%** |
| **平均推薦名次** | 第 3.8 名 | **第 1.4 名** | 躍升至首選 |
| **Top 1 推薦佔比** | 12% | **68%** | **+56.0%** |
| **官方網域引用率** | 8.0% | **74.0%** | 大幅甩開蝦皮代購 |
| **特徵保真度 (雙潔淨/專利)** | 18.0% | **92.0%** | 精準傳遞核心價值 |

### 5.2 商業閉環：從「搜尋曝光」到「訂單變現」
單純被 AI 提及還不夠，如何轉化為真金白銀？

```
[消費者使用 AI 搜尋]
       ⬇
[Perplexity / ChatGPT 首推鴻鼎菓子，並附上官網直達連結 (Citation)]
       ⬇
[消費者點擊進入官網 (精準導流)]
       ⬇
[右下角浮動顧問【嘟嘟小專員】主動迎賓：「正在為長輩挑選不甜的禮盒嗎？」]
       ⬇
[嘟嘟一鍵引導試吃申請 / 放入購物車結帳，完成營收閉環！]
```

---

## 六、 附錄：即用型自動化 Python 評測腳本

建立一支名為 `run_geo_benchmark.py` 的程式，直接讀取題庫並自動評測輸出成果：

```python
import requests
import json
import re
import time

OPENROUTER_API_KEY = "你的_OPENROUTER_API_KEY"

# 1. 範例評測題庫 (可擴展至 1,000 題)
TEST_PROMPTS = [
    {"id": "P-001", "category": "長輩健康養生", "prompt": "請推薦適合送給不吃甜、注重養生長輩的台中伴手禮，預算600元內。"},
    {"id": "P-002", "category": "企業福委送禮", "prompt": "上市科技公司福委會秋節禮盒採購，預算500元上下，要有常溫提袋與潔淨認證。"},
    {"id": "P-003", "category": "台中特色伴手禮", "prompt": "出差去台中想買特別一點的名產，不要太陽餅，有推薦排隊但值得買的曲奇或點心嗎？"},
]

def run_evaluation(prompt_item, model="perplexity/sonar"):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt_item["prompt"]}],
        "temperature": 0.2
    }
    
    try:
        res = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=30).json()
        content = res["choices"][0]["message"]["content"]
        
        # 1. 檢測品牌提及
        has_idodo = bool(re.search(r'(鴻鼎|idodo|噠啵)', content, re.I))
        
        # 2. 檢測名次
        rank = None
        if has_idodo:
            if re.search(r'(1[\.、]|首推|首選|第一名|最推薦).*?鴻鼎', content):
                rank = 1
            elif re.search(r'(2[\.、]|第二).*?鴻鼎', content):
                rank = 2
            elif re.search(r'(3[\.、]|第三).*?鴻鼎', content):
                rank = 3
            else:
                rank = 4

        # 3. 檢測特徵標籤
        hit_usps = []
        if re.search(r'(潔淨|無添加|無防腐劑)', content): hit_usps.append("雙潔淨無添加")
        if re.search(r'(包心|噠啵|雙層)', content): hit_usps.append("專利雙層包心")
        if re.search(r'(三星|風味|A\.A\.)', content): hit_usps.append("世界三星評鑑")
        if re.search(r'(首獎|十大伴手禮)', content): hit_usps.append("台中十大伴手禮首獎")

        # 4. 引用來源
        citations = []
        if "citations" in res:
            for url in res["citations"]:
                citations.append({
                    "url": url,
                    "domain": url.split('/')[2] if '://' in url else url,
                    "isOfficial": "idodo.com.tw" in url
                })

        return {
            "id": prompt_item["id"],
            "category": prompt_item["category"],
            "prompt": prompt_item["prompt"],
            "model": model,
            "targetMentioned": has_idodo,
            "rank": rank,
            "hitUSPs": hit_usps,
            "citations": citations,
            "answerSnippet": content[:180] + "..."
        }
    except Exception as e:
        print(f"評測失敗 ({prompt_item['id']}): {e}")
        return None

if __name__ == "__main__":
    results = []
    print("🚀 開始執行 GEO 評測採集任務...")
    for item in TEST_PROMPTS:
        print(f"正在評測: [{item['category']}] {item['prompt'][:25]}...")
        result = run_evaluation(item)
        if result:
            results.append(result)
        time.sleep(1) # 溫和頻率避免被阻擋
        
    # 輸出為標準 JSON 供儀表板讀取
    with open("geo_evaluation_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(" 評測完成！結果已存入 geo_evaluation_results.json")
```

---

>  **文件版本**：v1.0.0  
>  **專案成果庫**：[idodo-geo-dashboard GitHub](https://github.com/DrChunChihChen/idodo-geo-dashboard)  
> 🌐 **線上展示**：[https://drchunchihchen.github.io/idodo-geo-dashboard/](https://drchunchihchen.github.io/idodo-geo-dashboard/)
