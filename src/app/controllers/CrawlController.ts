// mock data
const data = [
    {
        id: 1,
        url: "https://thuvienphapluat.vn/van-ban/Quyen-dan-su/Luat-Hon-nhan-va-gia-dinh-2014-238640.aspx",
    },
    {
        id: 2,
        url: "https://thuvienphapluat.vn/van-ban/Quyen-dan-su/Nghi-dinh-126-2014-ND-CP-quy-dinh-chi-tiet-mot-so-dieu-bien-phap-thi-hanh-Luat-Hon-nhan-gia-dinh-262379.aspx",
    },
    {
        id: 3,
        url: "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Quyet-dinh-542-QD-BTP-2024-kiem-tra-thi-hanh-phap-luat-ve-xu-ly-vi-pham-hanh-chinh-604913.aspx",
    },
    {
        id: 4,
        url: "https://thuvienphapluat.vn/van-ban/Giao-thong-Van-tai/Nghi-dinh-19-2024-ND-CP-sua-doi-Nghi-dinh-48-2019-ND-CP-quan-ly-phuong-tien-vui-choi-duoi-nuoc-599548.aspx",
    },
    {
        id: 5,
        url: "https://thuvienphapluat.vn/van-ban/Cong-nghe-thong-tin/Nghi-quyet-127-NQ-CP-2023-ap-dung-cap-thi-thuc-dien-tu-cho-cong-dan-cac-nuoc-vung-lanh-tho-575687.aspx",
    },
    {
        id: 6,
        url: "https://thuvienphapluat.vn/van-ban/The-thao-Y-te/Nghi-dinh-96-2023-ND-CP-huong-dan-Luat-Kham-benh-chua-benh-583328.aspx",
    },
    {
        id: 7,
        url: "https://thuvienphapluat.vn/van-ban/Thu-tuc-To-tung/Bo-luat-to-tung-dan-su-2015-296861.aspx",
    },{
        id: 8,
        url: "https://thuvienphapluat.vn/van-ban/Trach-nhiem-hinh-su/Bo-luat-to-tung-hinh-su-2015-296884.aspx",
    },
];



import { crawler, search } from "../../services/Crawler";

class CrawlController {
    // [GET] /crawl /start?url=http://www.example.com&depth=2
    index(req: any, res: any) {
        res.send("Hello World ??");
    }

    // [GET] /crawl/status/:slug([a-z]+) /crawl/status/1234567890abcdefgh : Slug is the job id
    async status(req: any, res: any) {
        const slug = req.params.slug;

        //seach
        if (slug) {
            try {
                let re = await search(slug);
                res.json(re);
            } catch (e) {
                console.error("Error occurred while searching:", e);
                res.status(500).send(
                    "An error occurred while searching the URL."
                );
            }
        } else {
            res.status(404).send("URL not found for the given slug.");
        }
    }

    // [GET] /crawl/:slug([a-z]+) /crawl/1234567890abcdefgh : Slug is the job id
    async show(req: any, res: any) {
        let slug = req.params.slug;
        let url = data.find((item) => item.id == slug)?.url;

        if (url) {
            try {
                let re = await crawler(url); // Await the result of the crawler function
                console.log("re: ", re);
                res.json(re);
            } catch (error) {
                console.error("Error occurred while crawling:", error);
                res.status(500).send(
                    "An error occurred while crawling the URL."
                );
            }
        } else {
            res.status(404).send("URL not found for the given slug.");
        }
    }
}

export default CrawlController;
