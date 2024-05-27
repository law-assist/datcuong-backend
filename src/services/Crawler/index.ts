import cheerio from "cheerio";
import puppeteer from "puppeteer";
import axios from "axios";

// import { ObjectId } from "mongodb";
// import moment from "moment-timezone";
import { context, noiDungVanBan, Law } from "../../app/models/CrawlModel";

import { saveData, checkLink, client } from "../database.service";
import {
    phanRegex,
    chuongRegex,
    mucRegex,
    tieuMucRegex,
    dieuRegex,
    khoanRegex,
    diemRegex1,
    diemRegex2,
    isOpen,
    isClose,
} from "./regex";

interface UrlDoc {
    link: string;
}

export const crawler = async (url: string) => {
    try {
        // const checking = await checkLink(url);
        // if (checking) {
        //     return {
        //         status: "200",
        //         message: "Link đã tồn tại",
        //         law: checking,
        //     };
        // }
        const browser = await puppeteer.launch({
            // headless: false,
            // slowMo: 50,
        });
        const page = await browser.newPage();
        await page.goto(url);

        //login
        // await page.waitForSelector("#usernameTextBox");
        // await page.type("#usernameTextBox", "khtc_vietrade");
        // console.log("username");
        // await page.waitForSelector("#passwordTextBox");
        // await page.type("#passwordTextBox", "xttm2022");
        // console.log("password");
        // await page.waitForSelector("#loginButton");
        // await page.click("#loginButton");
        // console.log("login");
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        // confirm login
        // const findConfirmBtns =  await page.waitForSelector(".ui-button-text");

        // console.log("confirm");
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        await page.waitForSelector("#aLuocDo");
        await page.click("#aLuocDo");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const $ = cheerio.load(await page.content());

        // const response = await axios.get(url);
        const soHieu = $("td:contains('Số hiệu:')").next().text().trim();
        const loaiVanBan = $("td:contains('Loại văn bản:')")
            .next()
            .text()
            .trim();
        const coQuanBanHanh = $("td:contains('Nơi ban hành:')")
            .next()
            .text()
            .trim();

        const ngayBanHanh = $("td:contains('Ngày ban hành:')")
            .next()
            .text()
            .trim();

        const title = $("title").text().trim();
        const match = title.match(/(.+)\s+mới nhất$/);
        const tenVanBan = match ? match[1] : title;
        // const now = moment()
        //     .tz("Asia/Ho_Chi_Minh")
        //     .format("YYYY-MM-DD HH:mm:ss");

        const contents: noiDungVanBan = {
            header: [],
            description: [],
            mainContext: [],
            footer: [],
            extend: [],
        };

        let chapter = 0,
            muc = 0,
            part = 0; // muc: Mục, part: Phần
        let conText: context = {
            name: "",
            title: "",
            content: [],
            tag: "", //
        };
        let khoan: context = {
            name: "",
            title: "",
            content: [],
            tag: "", //
        };
        let diem: context = {
            name: "",
            title: "",
            content: [],
            tag: "",
        };

        const checkContext = () => {
            if (conText.name !== "") {
                contents.mainContext.push(conText);
                conText = {
                    name: "",
                    title: "",
                    content: [],
                    tag: "",
                };
            }
            return;
        };
        const checkKhoan = () => {
            if (khoan.name !== "") {
                conText.content.push(khoan);
                khoan = {
                    name: "",
                    title: "",
                    content: [],
                    tag: "",
                };
            }
        };
        const checkDiem = () => {
            if (diem.name !== "") {
                khoan.content.push(diem);
                diem = {
                    name: "",
                    title: "",
                    content: [],
                    tag: "",
                };
            }
        };

        let checkPoint = 0;
        let current = 0;
        let openQuote = false;

        const readingCurrentLine = (line: string) => {
            var num;
            var matches;
            if (isOpen.test(line)) {
                openQuote = true;
            }
            if (openQuote) {
                if (current === 1) {
                    conText.content.push(line);
                } else if (current === 2) {
                    khoan.content.push(line);
                } else if (current === 3) {
                    diem.content.push(line);
                }

                if (isClose.test(line)) {
                    openQuote = false;
                }
                return;
            } else if (line === "") {
                checkPoint++;
                return;
            } else if (phanRegex.test(line)) {
                part++;
                checkPoint = 2;

                // parent = current;
                current = 1;

                checkDiem();
                checkKhoan();
                checkContext();

                conText.name = "phan" + part;
                conText.title = line;
                return;
            } else if (chuongRegex.test(line)) {
                chapter++;
                checkPoint = 2;

                // parent = current;
                current = 1;

                checkDiem();
                checkKhoan();
                checkContext();

                conText.name = "chuong" + chapter;
                conText.title = line;
                return;
            } else if (mucRegex.test(line)) {
                muc++;
                matches = line.match(mucRegex) || [];
                num = matches[1];
                // parent = current;
                current = 1;

                checkDiem();
                checkKhoan();
                checkContext();

                conText.name = "muc" + muc;
                conText.title = line;
                conText.tag = "chuong" + chapter;
                conText.content.push(line.substring(matches[0].length).trim());

                // conText.content.push(line.slice(line.indexOf(".") + 2));
                return;
            } else if (tieuMucRegex.test(line)) {
                matches = line.match(tieuMucRegex) || [];
                num = matches[1];
                // parent = current;
                current = 1;

                checkDiem();
                checkKhoan();
                checkContext();

                conText.name = "tieuMuc" + num;
                conText.title = line;
                conText.tag = "muc" + muc;
                conText.content.push(line.substring(matches[0].length).trim());
                return;
            } else if (dieuRegex.test(line)) {
                checkPoint = 2;
                matches = line.match(dieuRegex) || [];

                num = matches[1];

                // parent = current;
                current = 1;

                checkDiem();
                checkKhoan();
                checkContext();

                conText.name = "dieu" + num;
                conText.title = line;
                // conText.content.push(line.slice(line.indexOf(".") + 2));
                conText.content.push(line.substring(matches[0].length).trim());

                return;
            } else if (diemRegex1.test(line) || diemRegex2.test(line)) {
                matches =
                    line.match(diemRegex1) || line.match(diemRegex2) || [];
                num = matches[1];

                // parent = current;
                current = 3;

                checkDiem();

                diem.name = "diem" + num;
                diem.title = line;
                // if(line.indexOf(")") !== -1) {
                //     diem.content.push(line.slice(line.indexOf(")") + 2));
                // } else if (line.indexOf(".") !== -1) {
                //     diem.content.push(line.slice(line.indexOf(".") + 4));
                // }
                diem.content.push(line.substring(matches[0].length).trim());

                return;
            } else if (khoanRegex.test(line)) {
                matches = line.match(khoanRegex) || [];
                num = matches[1];

                // parent = current;
                current = 2;

                checkDiem();
                checkKhoan();

                khoan.name = "khoan" + num;
                khoan.title = line;
                // khoan.content.push(line.slice(line.indexOf(".") + 2));
                khoan.content.push(line.substring(matches[0].length).trim());

                return;
            } else {
                if (checkPoint === 1) {
                    contents.description.push(line);
                } else if (checkPoint === 2) {
                    if (current === 1) {
                        conText.content.push(line);
                    } else if (current === 2) {
                        khoan.content.push(line);
                    } else if (current === 3) {
                        diem.content.push(line);
                    }
                }
            }
        };

        $("#tab1 .content1 div div")
            .children()
            .each((index, element) => {
                if (
                    element.name == "table" &&
                    (checkPoint == 0 || checkPoint == 3)
                ) {
                    if (checkPoint === 0) {
                        $(element)
                            .find("p")
                            .each((i, e) => {
                                const text = $(e)
                                    .text()
                                    .replace(/\n/g, " ")
                                    .replace(/ +/g, " ")
                                    .replace(/-+$/g, "")
                                    .trim();
                                if (text !== "") contents.header.push(text);
                            });
                        // contents.header.push($(element).html());
                    } else if (checkPoint == 3) {
                        checkDiem();
                        checkKhoan();
                        checkContext();
                        $(element)
                            .find("p")
                            .each((i, e) => {
                                // $(e)
                                //     .children()
                                //     .each((i, e) => {
                                //         const text = $(e)
                                //             .text()
                                //             // .replace(/\n/g, "")
                                //             // .replace(/ +/g, " ")
                                //             .trim();
                                //         if (text !== "")
                                //             contents.footer.push(text);
                                //     });
                                const text = $(e).text().replace(/\n/g, "").trim();
                                if (text !== "") contents.footer.push(text);
                            });
                        // contents.footer.push($(element).html());
                        checkPoint++;
                    }
                } else if (checkPoint < 3) {
                    let paragraph = $(element)
                        .text()
                        .replace(/\n/g, " ")
                        .trim();
                    if (paragraph !== "Video Pháp Luật") {
                        readingCurrentLine(paragraph);
                    }
                } else {
                    contents.extend.push($(element).html());
                }
            });

        const topic = $(
            "#tab4 #viewingDocument .hd.fl:contains('Lĩnh vực, ngành:')"
        )
            .next()
            .text()
            .trim();

        const law: Law = {
            category: loaiVanBan,
            department: coQuanBanHanh,
            name: tenVanBan,
            pdf_link: url,
            created_at: new Date(Date.now() + 7 * 60 * 60 * 1000), // to UTC +7
            updated_at: new Date(Date.now() + 7 * 60 * 60 * 1000), // to UTC +7
            number_doc: soHieu,
            date_approved: ngayBanHanh,
            field: topic,
            content: contents,
            relatedLaws: [],
        };

        await browser.close();
        await new Promise((resolve) => setTimeout(resolve, 600000));

        // await saveData(law);
        return {
            status: "200",
            message: "Crawl thành công",
            url: law,
        };
    } catch (error) {
        console.log(error);
    }
};

export const search = async (id: number) => {
    // try {
    //     const idObj = new ObjectId(id);
    //     const response = await client
    //         .db("law_dev")
    //         .collection("lawData")
    //         .findOne({
    //             _id: idObj,
    //         })
    //         .then((data: any) => {
    //             return data;
    //         });
    //     if (response) {
    //         return {
    //             status: "200",
    //             message: "Found",
    //             data: response,
    //         };
    //     } else {
    //         return {
    //             status: "404",
    //             message: "Not found",
    //         };
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
    try {
        const res = await client
            .db("law_dev")
            .collection("lawData")
            .find({})
            .toArray();
        return {
            status: "200",
            message: "Found",
            data: res[id - 1],
        };
    } catch (error) {
        console.log(error);
        return {
            status: "500",
            message: "Error",
        };
    }
};

export const getAllUrl = async function () {
    try {
        const db = client.db("law_dev");
        const collection = db.collection("laws");
        const allDocs: UrlDoc[] = await collection
            .find({}, { projection: { link: 1, _id: 0 } })
            .toArray();
        return allDocs.map((doc) => doc.link);
    } catch (error) {
        console.error("Error occurred while checking data in MongoDB:", error);
        throw error;
    }
};
