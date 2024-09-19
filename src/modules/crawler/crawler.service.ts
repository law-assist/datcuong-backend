import { BadRequestException, Injectable } from '@nestjs/common';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import * as fs from 'fs';

// import axios from 'axios';
import {
  chuongRegex,
  diemRegex1,
  diemRegex2,
  dieuRegex,
  isClose,
  isOpen,
  khoanRegex,
  mucRegex,
  phanRegex,
  tieuMucRegex,
} from './helper/regex';
import { Content, Context, LawContent } from 'src/common/types';
import { Field } from 'src/common/enum/enum';
import { CreateLawDto } from '../law/dto/create-law.dto';
import { LawService } from '../law/law.service';

@Injectable()
export class CrawlerService {
  constructor(private lawService: LawService) {}

  async crawler(url: string) {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        // args: [
        //   '--disable-setuid-sandbox',
        //   '--no-sandbox',
        //   '--disable-gpu',
        //   '--single-process',
        //   '--no-zygote',
        //   '--disable-dev-shm-usage',
        // ],
        // dumpio: true,
        // protocolTimeout: 20000,
        // executablePath:
        //   process.env.NODE_ENV === 'production'
        //     ? process.env.PUPPETEER_EXECUTABLE_PATH ||
        //       '/usr/bin/chromium-browser'
        //     : puppeteer.executablePath(),
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });

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

      // await page.waitForSelector('#aLuocDo', { timeout: 60000 });
      // await page.click('#aLuocDo');
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      const $ = cheerio.load(await page.content());

      // const response = await axios.get(url);
      const soHieu = $("td:contains('Số hiệu:')").next().text().trim();
      const loaiVanBan = $("td:contains('Loại văn bản:')").next().text().trim();
      const coQuanBanHanh = $("td:contains('Nơi ban hành:')")
        .next()
        .text()
        .trim();

      const ngayBanHanh = $("td:contains('Ngày ban hành:')")
        .next()
        .text()
        .trim();

      // const topic = $("td:contains('Lĩnh vực, ngành:')").next();
      // console.log('topic', topic);

      const title = $('title').text().trim();
      const match = title.match(/(.+)\s+mới nhất$/);
      const tenVanBan = match ? match[1] : title;
      // const now = moment()
      //     .tz("Asia/Ho_Chi_Minh")
      //     .format("YYYY-MM-DD HH:mm:ss");

      const contents: LawContent = {
        header: [],
        description: [],
        mainContent: [],
        footer: [],
        extend: [],
      };

      let chapter = 0,
        muc = 0,
        part = 0; // muc: Mục, part: Phần
      let conText: Context = {
        name: '',
        title: '',
        content: [],
        tag: '', //
      };
      let khoan: Context = {
        name: '',
        title: '',
        content: [],
        tag: '', //
      };
      let diem: Context = {
        name: '',
        title: '',
        content: [],
        tag: '',
      };

      const checkContext = () => {
        if (conText.name !== '') {
          contents.mainContent.push(conText);
          conText = {
            name: '',
            title: '',
            content: [],
            tag: '',
          };
        }
        return;
      };
      const checkKhoan = () => {
        if (khoan.name !== '') {
          conText.content.push(khoan);
          khoan = {
            name: '',
            title: '',
            content: [],
            tag: '',
          };
        }
      };
      const checkDiem = () => {
        if (diem.name !== '') {
          khoan.content.push(diem);
          diem = {
            name: '',
            title: '',
            content: [],
            tag: '',
          };
        }
      };

      let checkPoint = 0;
      let current = 0;
      let openQuote = false;

      const readingCurrentLine = (line: string) => {
        let num;
        let matches;
        const lawContent: Content = {
          value: line,
          embedding: '',
        };

        if (isOpen.test(line)) {
          openQuote = true;
        }
        if (openQuote) {
          if (current === 1) {
            conText.content.push(lawContent);
          } else if (current === 2) {
            khoan.content.push(lawContent);
          } else if (current === 3) {
            diem.content.push(lawContent);
          }

          if (isClose.test(line)) {
            openQuote = false;
          }
          return;
        } else if (line === '') {
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

          conText.name = 'phan' + part;
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

          conText.name = 'chuong' + chapter;
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

          conText.name = 'muc' + muc;
          conText.title = line;
          conText.tag = 'chuong' + chapter;
          lawContent.value = line.substring(matches[0].length).trim();
          conText.content.push(lawContent);

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

          conText.name = 'tieuMuc' + num;
          conText.title = line;
          conText.tag = 'muc' + muc;
          lawContent.value = line.substring(matches[0].length).trim();
          conText.content.push(lawContent);
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

          conText.name = 'dieu' + num;
          conText.title = line;
          // conText.content.push(line.slice(line.indexOf(".") + 2));
          lawContent.value = line.substring(matches[0].length).trim();
          conText.content.push(lawContent);

          return;
        } else if (diemRegex1.test(line) || diemRegex2.test(line)) {
          matches = line.match(diemRegex1) || line.match(diemRegex2) || [];
          num = matches[1];

          // parent = current;
          current = 3;

          checkDiem();

          diem.name = 'diem' + num;
          diem.title = line;
          // if(line.indexOf(")") !== -1) {
          //     diem.content.push(line.slice(line.indexOf(")") + 2));
          // } else if (line.indexOf(".") !== -1) {
          //     diem.content.push(line.slice(line.indexOf(".") + 4));
          // }
          lawContent.value = line.substring(matches[0].length).trim();
          diem.content.push(lawContent);

          return;
        } else if (khoanRegex.test(line)) {
          matches = line.match(khoanRegex) || [];
          num = matches[1];

          // parent = current;
          current = 2;

          checkDiem();
          checkKhoan();

          khoan.name = 'khoan' + num;
          khoan.title = line;
          // khoan.content.push(line.slice(line.indexOf(".") + 2));
          lawContent.value = line.substring(matches[0].length).trim();
          khoan.content.push(lawContent);

          return;
        } else {
          if (checkPoint === 1) {
            contents.description.push(lawContent);
          } else if (checkPoint === 2) {
            if (current === 1) {
              conText.content.push(lawContent);
            } else if (current === 2) {
              khoan.content.push(lawContent);
            } else if (current === 3) {
              diem.content.push(lawContent);
            }
          }
        }
      };

      $('#tab1 .content1 div div')
        .children()
        .each((index, element) => {
          if (element.name == 'table' && (checkPoint == 0 || checkPoint == 3)) {
            if (checkPoint === 0) {
              $(element)
                .find('p')
                .each((i, e) => {
                  const text = $(e)
                    .text()
                    .replace(/\n/g, ' ')
                    .replace(/ +/g, ' ')
                    .replace(/-+$/g, '')
                    .trim();
                  const lawContent: Content = {
                    value: text,
                    embedding: '',
                  };
                  if (text !== '') contents.header.push(lawContent);
                });
              // contents.header.push($(element).html());
            } else if (checkPoint == 3) {
              checkDiem();
              checkKhoan();
              checkContext();
              $(element)
                .find('p')
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
                  const text = $(e).text().replace(/\n/g, '').trim();
                  const lawContent: Content = {
                    value: text,
                    embedding: '',
                  };
                  if (text !== '') contents.footer.push(lawContent);
                });
              // contents.footer.push($(element).html());
              checkPoint++;
            }
          } else if (checkPoint < 3) {
            const paragraph = $(element).text().replace(/\n/g, ' ').trim();
            if (paragraph !== 'Video Pháp Luật') {
              readingCurrentLine(paragraph);
            }
          } else {
            contents.extend.push($(element).html());
          }
        });

      await page.waitForSelector('#aLuocDo', { timeout: 60000 });
      await page.click('#aLuocDo');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const $$ = cheerio.load(await page.content());

      const topic = $$(
        "#tab4 #viewingDocument .att .hd.fl:contains('Lĩnh vực, ngành:')",
      )
        .next()
        .text()
        .trim();
      console.log(topic);

      const law: CreateLawDto = {
        name: tenVanBan,
        category: loaiVanBan,
        department: coQuanBanHanh,
        pdfUrl: url,
        baseUrl: url,
        numberDoc: soHieu,
        dateApproved: ngayBanHanh,
        fields: topic.split(', ') as Field[],
        content: contents,
        relationLaws: [],
      };

      await browser.close();

      const newLaw = await this.lawService.create(law);
      return {
        message: 'law_crawled',
        data: newLaw,
      };
    } catch (error) {
      if (error.message.includes('duplicate')) {
        if (error.message.includes('pdfUrl'))
          throw new BadRequestException('law_pdf_existed');
        if (error.message.includes('baseUrl'))
          throw new BadRequestException('law_existed');
      }
      console.log('Error:', error.message);
    }
  }

  async autoCrawler() {
    const data = fs.readFileSync('urlsEdit.json', 'utf8');
    const jsonData = JSON.parse(data.toString());
    const crawled: number = process.env.CRAWLED
      ? Number(process.env.CRAWLED)
      : 33400;
    for (let i = crawled; i < jsonData.length; i++) {
      const item = jsonData[i];
      const existed = await this.lawService.checkLawExistence(item);

      if (!existed) {
        console.log(i, item);
        await this.crawler(item);
      } else {
        console.log('existed', i);
      }
    }
  }
}
