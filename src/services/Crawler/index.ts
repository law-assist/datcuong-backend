import cheerio from "cheerio";
import axios from "axios";
import { ObjectId } from "mongodb";
import moment from "moment-timezone";
import { content, noiDungVanBan, LawModel } from "../../app/models/CrawlModel";

import { saveData, checkLink, client } from "../database.service";
import {
    chuongRegex,
    mucRegex,
    dieuRegex,
    khoanRegex,
    diemRegex1,
    diemRegex2,
    isOpen,
    isClose,
} from "./regex";

export const crawler = async (url: string) => {
    try {
        const checking = await checkLink(url);
        if (checking) {
            return {
                status: "200",
                message: "Link đã tồn tại",
            };
        }

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

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

        // const noiDungVanBan = $(".content1").html();
        const title = $("title").text().trim();
        const match = title.match(/(.+)\s+mới nhất$/);
        const tenVanBan = match ? match[1] : title;
        const now = moment()
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD HH:mm:ss");

        const contents: noiDungVanBan = {
            header: [],
            description: [],
            mainContext: [],
            footer: [],
        };
        // const header = [];
        // const description = [];
        // const mainContext = [];
        // const footer = [];

        let chapter = 0;
        let conText: content = {
            name: "",
            title: "",
            content: [],
            tag: null, // Or any other default value for tag, as it's of type `any`
        };
        let khoan: content = {
            name: "",
            title: "",
            content: [],
            tag: null, // Or any other default value for tag, as it's of type `any`
        };
        let diem: content = {
            name: "",
            title: "",
            content: [],
            tag: null, // Or any other default value for tag, as it's of type `any`
        };

        let checkPoint = 0;
        let current = 0;
        // let parent = 0;
        let openQuote = false;
        // let closeQuote = false;

        const readingCurrentLine = (line: string) => {
            var num;
            var matches;
            if (isOpen.test(line)) {
                console.log("line: ", line);
                openQuote = true;
                console.log("openQuote: ", openQuote);
            }
            if (openQuote) {
                if (current === 1) {
                    conText.content.push(line);
                } else if (current === 2) {
                    conText.content.push(line);
                } else if (current === 3) {
                    conText.content.push(line);
                } else if (current === 4) {
                    khoan.content.push(line);
                } else if (current === 5) {
                    diem.content.push(line);
                }

                if (isClose.test(line)) {
                    openQuote = false;
                }
            } else if (line === "") {
                checkPoint++;
                return;
            } else if (chuongRegex.test(line)) {
                chapter++;
                checkPoint = 2;

                // parent = current;
                current = 1;

                if (diem.name !== "") {
                    khoan.content.push(diem);
                    diem = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }
                if (khoan.name !== "") {
                    conText.content.push(khoan);
                    khoan = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }
                if (conText.name !== "") {
                    contents.mainContext.push(conText);
                    conText = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }

                conText.name = "chuong" + chapter;
                conText.title = line;
                return;
            } else if (mucRegex.test(line)) {
                matches = line.match(mucRegex) || [];
                num = matches[1];

                // parent = current;
                current = 2;

                if (diem.name !== "") {
                    khoan.content.push(diem);
                    diem = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }
                if (khoan.name !== "") {
                    conText.content.push(khoan);
                    khoan = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }
                if (conText.name !== "") {
                    contents.mainContext.push(conText);
                    conText = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }

                conText.name = "muc" + num;
                conText.title = line;
                conText.tag = "chuong" + chapter;
                conText.content.push(line.slice(line.indexOf(".") + 2));
                return;
            } else if (dieuRegex.test(line)) {
                checkPoint = 2;

                matches = line.match(dieuRegex) || [];
                num = matches[1];

                // parent = current;
                current = 3;

                if (diem.name !== "") {
                    khoan.content.push(diem);
                    diem = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }
                if (khoan.name !== "") {
                    conText.content.push(khoan);
                    khoan = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }
                if (conText.name !== "") {
                    contents.mainContext.push(conText);
                    conText = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }

                conText.name = "dieu" + num;
                conText.title = line;
                conText.content.push(line.slice(line.indexOf(".") + 2));
                return;
            } else if (diemRegex1.test(line) || diemRegex2.test(line)) {
                matches =
                    line.match(diemRegex1) || line.match(diemRegex2) || [];
                num = matches[1];
                // parent = current;
                current = 5;

                if (diem.name !== "") {
                    khoan.content.push(diem);
                    diem = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }

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
                current = 4;

                if (diem.name !== "") {
                    khoan.content.push(diem);
                    diem = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }
                if (khoan.name !== "") {
                    conText.content.push(khoan);
                    khoan = {
                        name: "",
                        title: "",
                        content: [],
                        tag: null, // Or any other default value for tag, as it's of type `any`
                    };
                }

                khoan.name = "khoan" + num;
                khoan.title = line;
                khoan.content.push(line.slice(line.indexOf(".") + 2));
                return;
            } else {
                if (checkPoint === 0) {
                    contents.header.push(line);
                } else if (checkPoint === 1) {
                    contents.description.push(line);
                } else if (checkPoint === 2) {
                    if (current === 1) {
                        conText.content.push(line);
                    } else if (current === 2) {
                        conText.content.push(line);
                    } else if (current === 3) {
                        conText.content.push(line);
                    } else if (current === 4) {
                        khoan.content.push(line);
                    } else if (current === 5) {
                        diem.content.push(line);
                    }
                } else if (checkPoint > 2) {
                    contents.footer.push(line);
                }
            }
        };

        $("#tab1 p").each((index, element) => {
            let paragraph = $(element).text();
            paragraph = paragraph.replace(/\n/g, " ");
            paragraph = paragraph.trim();

            if (paragraph !== "Video Pháp Luật") {
                readingCurrentLine(paragraph);
            }
        });

        const crawlData: LawModel = {
            link: url,
            tenVanBan: tenVanBan,
            sohieu: soHieu,
            loaiVanBan: loaiVanBan,
            coQuanBanHanh: coQuanBanHanh,
            ngayBanHanh: ngayBanHanh,
            noiDungVanBan: contents,
            ngayThem: now,
        };

        await saveData(crawlData);
        return {
            status: "200",
            message: "Crawl thành công",
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
        const res = await client.db("law_dev").collection("lawData").find({}).toArray();
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
